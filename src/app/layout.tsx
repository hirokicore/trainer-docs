import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrainerDocs — パーソナルトレーナー向け契約書自動生成',
  description:
    'AIを活用してパーソナルトレーナー向けの契約書類を瞬時に生成。トレーニング委託契約書・免責同意書・健康状態確認書などを自動作成してPDFダウンロード。',
  keywords: 'パーソナルトレーナー, 契約書, 自動生成, AI, フィットネス',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
