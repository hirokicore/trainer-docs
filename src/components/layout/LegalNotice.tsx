/**
 * 契約書生成サービスに関する法的注意喚起（全プラン共通）
 * 料金プランページ・契約書生成画面などに表示する。
 */
export default function LegalNotice({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 space-y-1.5 ${className}`}>
      <p className="text-xs text-amber-800 leading-relaxed">
        ※本サービスが生成する契約書・書面は、一般的なひな形をもとにしたサンプルです。
      </p>
      <p className="text-xs text-amber-800 leading-relaxed">
        ※最終的な内容の妥当性・適法性については、お客様ご自身の判断および責任においてご確認ください。
      </p>
      <p className="text-xs text-amber-800 leading-relaxed">
        ※重要な契約・高額な取引などにご利用される場合は、弁護士・行政書士などの専門家への確認をおすすめします。
      </p>
    </div>
  );
}
