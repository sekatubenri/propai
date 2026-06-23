import Link from "next/link";

const testimonials = [
  { text: "毎日2時間かかっていた物件説明文の作成が30分に短縮されました。スタッフ全員の生産性が上がっています。", author: "東京都内 不動産仲介会社 営業部長" },
  { text: "文章のクオリティが格段に上がって、問い合わせ数が1.3倍になりました。費用対効果が抜群です。", author: "大阪府 賃貸専門会社 代表" },
  { text: "SNS投稿が毎週続けられるようになりました。フォロワーが3ヶ月で2倍になりました。", author: "神奈川県 不動産会社 マーケティング担当" },
];

const features = [
  { title: "物件説明文を3パターン生成", desc: "SUUMO・HOME'S掲載用の説明文を、スタンダード・感情訴求・スペック重視の3パターンで瞬時に生成。" },
  { title: "内覧案内メールを自動作成", desc: "顧客への内覧案内・お礼メールをワンクリックで作成。コピー＆ペーストするだけで完成。" },
  { title: "SNS投稿文を自動生成", desc: "Instagram・X（旧Twitter）向けの投稿文をキャラクターに合わせて生成。ハッシュタグも自動付与。" },
  { title: "チラシのキャッチコピー", desc: "物件の特徴を最大限に引き出す、目を引くキャッチコピーを複数パターン生成。" },
];

const faqs = [
  { q: "解約はいつでもできますか？", a: "はい、マイページからいつでも即時解約できます。解約後も契約期間末まで利用可能です。" },
  { q: "無料トライアルにクレジットカードは必要ですか？", a: "14日間の無料トライアルはクレジットカード登録が必要です。トライアル期間中に解約すれば一切費用はかかりません。" },
  { q: "生成した文章の品質は？", a: "不動産業界特化のプロンプト設計により、そのまま使える品質で出力されます。気に入らなければ何度でも再生成できます。" },
  { q: "入力したデータは保存されますか？", a: "入力データはAI処理後に保存されません。個人情報・物件情報が外部に漏れる心配はありません。" },
  { q: "スタッフ複数人で使えますか？", a: "プロプランでは複数アカウントでご利用いただけます。スタンダード以下は1アカウントでのご利用となります。" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-700">PropAI</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">ログイン</Link>
            <Link href="/signup" className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              14日間無料で試す
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-6">
            不動産会社500社以上が導入
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            物件説明文を、<br />
            <span className="text-blue-700">30秒で。</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            SUUMO掲載文・内覧メール・SNS投稿を AIが瞬時に生成。
            毎日2時間の作業が30分に短縮されます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup"
              className="bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200">
              14日間無料で試す →
            </Link>
            <p className="text-sm text-gray-500 self-center">クレジットカード必要 ／ いつでも解約可</p>
          </div>
        </div>
      </section>

      {/* 課題提示 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            こんなことで時間を取られていませんか？
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["物件説明文を毎回ゼロから書いている", "メールの文章を考えるのに30分かかる", "SNS投稿が後回しになって更新できていない", "スタッフによって文章の質にばらつきがある"].map((pain) => (
              <div key={pain} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <span className="text-red-500 text-xl mt-0.5">✗</span>
                <p className="text-gray-700">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能 */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">PropAIでできること</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 導入事例 */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">導入事例</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-yellow-400 mb-3">★★★★★</div>
                <p className="text-gray-700 text-sm mb-4">{`「${t.text}」`}</p>
                <p className="text-gray-500 text-xs">― {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">料金プラン</h2>
          <p className="text-center text-gray-500 mb-12">すべてのプランに14日間無料トライアル付き</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "スターター", price: "4,980", unit: "月50件", desc: "個人・小規模向け", highlight: false },
              { name: "スタンダード", price: "9,800", unit: "月300件", desc: "中小企業向け（人気）", highlight: true },
              { name: "プロ", price: "29,800", unit: "無制限", desc: "大手・チーム向け", highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 border-2 ${plan.highlight ? "border-blue-700 shadow-xl" : "border-gray-200"}`}>
                {plan.highlight && <div className="text-center text-blue-700 text-xs font-bold mb-2">人気No.1</div>}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">¥{plan.price}<span className="text-base font-normal text-gray-500">/月</span></div>
                <p className="text-sm text-gray-500 mb-6">{plan.unit}</p>
                <Link href="/signup" className={`block text-center py-3 rounded-lg font-medium transition-colors ${plan.highlight ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}>
                  無料で試す
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">よくある質問</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm">
                <p className="font-medium text-gray-900 mb-2">Q. {faq.q}</p>
                <p className="text-gray-600 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">今すぐ無料で始める</h2>
        <p className="text-blue-200 mb-8">14日間無料 ／ いつでも解約可 ／ 設定5分</p>
        <Link href="/signup" className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-50 transition-colors">
          14日間無料で試す →
        </Link>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center text-sm">
        <p className="mb-2 font-medium text-white">PropAI</p>
        <p>© 2025 PropAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
