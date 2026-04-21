import type { StructuredSpecialTerms } from '@/types';

/**
 * 選択式特記事項を契約書の特記事項ブロック用テキストに変換する。
 * 未選択（undefined）の項目は出力しない。
 */
export function buildStructuredNotesText(terms: StructuredSpecialTerms): string {
  const lines: string[] = [];

  // 交通費
  if (terms.transportationFee === 'included') {
    lines.push('・交通費：セッション料金に含むものとする。');
  } else if (terms.transportationFee === 'separate') {
    lines.push('・交通費：実費を別途クライアント（甲）の負担とし、セッション料金とは別に精算するものとする。');
  }

  // 施設利用料
  if (terms.facilityFee === 'client') {
    lines.push('・施設利用料：クライアント（甲）の負担とする。');
  } else if (terms.facilityFee === 'trainer') {
    lines.push('・施設利用料：トレーナー（乙）の負担とする。');
  } else if (terms.facilityFee === 'split') {
    lines.push('・施設利用料：甲乙折半とする。');
  }

  // キャンセルポリシー
  if (terms.cancellationPolicy === 'pattern_a') {
    lines.push(
      '・キャンセルポリシー：予約セッション開始時刻の24時間前までのキャンセルは無料とする。' +
      'それ以降のキャンセルおよび無断欠席は、当該セッション料金の100%を請求するものとする。'
    );
  } else if (terms.cancellationPolicy === 'pattern_b') {
    lines.push(
      '・キャンセルポリシー：予約セッション前日のキャンセルは当該セッション料金の50%、' +
      '当日のキャンセルおよび無断欠席は100%を請求するものとする。'
    );
  } else if (terms.cancellationPolicy === 'pattern_c') {
    lines.push(
      '・キャンセルポリシー：甲乙が別途書面または口頭で合意した個別のキャンセルポリシーに従うものとする。' +
      '合意内容が本契約の記載と異なる場合、個別合意を優先する。'
    );
  }

  // セッション形態
  if (terms.sessionFormat === 'in_person') {
    const loc = terms.sessionLocation ? `（主な実施場所：${terms.sessionLocation}）` : '';
    lines.push(`・セッション形態：対面のみとする${loc}。`);
  } else if (terms.sessionFormat === 'online') {
    lines.push('・セッション形態：オンラインのみとする（使用するビデオ通話ツールは甲乙協議のうえ決定する）。');
  } else if (terms.sessionFormat === 'both') {
    const loc = terms.sessionLocation ? `（対面の主な実施場所：${terms.sessionLocation}）` : '';
    lines.push(
      `・セッション形態：対面およびオンラインの組み合わせとする${loc}。` +
      '各回の形態は甲乙が事前に協議のうえ決定するものとする。'
    );
  }

  // 撮影・利用許諾
  if (terms.photoConsent === 'allowed') {
    lines.push(
      '・撮影・利用許諾：トレーナー（乙）は、トレーニング中の写真・動画を撮影し、' +
      '宣伝・SNS等への掲載に利用することができる。クライアント（甲）は本条に同意するものとする。'
    );
  } else if (terms.photoConsent === 'not_allowed') {
    lines.push(
      '・撮影・利用許諾：トレーニング中の写真・動画の撮影および外部への公開・利用は、' +
      'クライアント（甲）の書面による事前同意がない限り行わないものとする。'
    );
  } else if (terms.photoConsent === 'ask_each_time') {
    lines.push(
      '・撮影・利用許諾：トレーニング中の写真・動画の撮影・利用については、' +
      'その都度クライアント（甲）に確認し、同意を得た場合のみ行うものとする。'
    );
  }

  return lines.join('\n');
}
