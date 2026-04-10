'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Download } from 'lucide-react';
import type { Document } from '@/types';
import { DOCUMENT_TYPE_LABELS } from '@/types';

// キャッシュ：フォントバイト列をメモリに保持して2回目以降を高速化
let cachedFontBytes: ArrayBuffer | null = null;

async function getFontBytes(): Promise<ArrayBuffer> {
  if (cachedFontBytes) return cachedFontBytes;
  const res = await fetch('/fonts/NotoSansJP.ttf');
  if (!res.ok) throw new Error('フォントファイルの読み込みに失敗しました');
  cachedFontBytes = await res.arrayBuffer();
  return cachedFontBytes;
}

/** 1行をページ幅に収まるよう文字単位で折り返す */
function wrapText(
  text: string,
  widthOf: (s: string) => number,
  maxWidth: number
): string[] {
  if (text.length === 0) return [''];
  const result: string[] = [];
  let current = '';

  for (const char of text) {
    const candidate = current + char;
    if (widthOf(candidate) > maxWidth && current.length > 0) {
      result.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }
  if (current !== '') result.push(current);
  return result;
}

async function buildPdf(doc: Document): Promise<Uint8Array> {
  // 動的インポート（Edge Runtime / SSR を避けてブラウザ専用で実行）
  const { PDFDocument, rgb } = await import('pdf-lib');
  const fontkitModule = await import('@pdf-lib/fontkit');
  const fontkit = fontkitModule.default ?? fontkitModule;

  const pdfDoc = await PDFDocument.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc.registerFontkit(fontkit as any);

  // Noto Sans JP フォント埋め込み
  const fontBytes = await getFontBytes();
  const font = await pdfDoc.embedFont(fontBytes, { subset: true });

  // A4 サイズ（pt）
  const A4_W = 595.28;
  const A4_H = 841.89;
  const margin = 50;
  const maxWidth = A4_W - margin * 2;
  const fontSize = 10;
  const titleFontSize = 15;
  const lineHeight = fontSize * 1.9;

  const widthOf = (s: string) => font.widthOfTextAtSize(s, fontSize);

  let page = pdfDoc.addPage([A4_W, A4_H]);
  let y = A4_H - margin;

  /** ページ残量を確認し、必要なら改ページ */
  const ensureLine = () => {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([A4_W, A4_H]);
      y = A4_H - margin;
    }
  };

  /** 1行描画して y を進める */
  const drawLine = (text: string, size = fontSize) => {
    if (text.length > 0) {
      page.drawText(text, { x: margin, y, size, font, color: rgb(0, 0, 0) });
    }
    y -= size * 1.9;
  };

  // ── タイトル ──
  const title = DOCUMENT_TYPE_LABELS[doc.document_type];
  const titleW = font.widthOfTextAtSize(title, titleFontSize);
  page.drawText(title, {
    x: (A4_W - titleW) / 2,
    y,
    size: titleFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  y -= titleFontSize * 2;

  // 区切り線
  page.drawLine({
    start: { x: margin, y },
    end: { x: A4_W - margin, y },
    thickness: 0.5,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= lineHeight;

  // ── 本文 ──
  const rawLines = doc.content.split('\n');
  for (const rawLine of rawLines) {
    const wrapped = wrapText(rawLine, widthOf, maxWidth);
    for (const line of wrapped) {
      ensureLine();
      drawLine(line);
    }
  }

  return pdfDoc.save();
}

interface PdfDownloadProps {
  document: Document;
  autoDownload?: boolean;
}

export default function PdfDownload({ document, autoDownload }: PdfDownloadProps) {
  const [loading, setLoading] = useState(false);

  const downloadPdf = async () => {
    setLoading(true);
    try {
      const pdfBytes = await buildPdf(document);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${DOCUMENT_TYPE_LABELS[document.document_type]}_${
        document.form_data.clientName
      }_${new Date(document.created_at).toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF生成エラー:', err);
      alert('PDF生成に失敗しました。コンソールで詳細を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoDownload) downloadPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  return (
    <Button variant="primary" size="lg" loading={loading} onClick={downloadPdf} className="gap-2">
      <Download size={18} />
      PDFでダウンロード
    </Button>
  );
}
