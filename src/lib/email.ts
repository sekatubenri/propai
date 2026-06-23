import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM!

export async function sendWelcomeEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '【PropAI】ご登録ありがとうございます',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">PropAIへようこそ！</h1>
        <p>ご登録ありがとうございます。</p>
        <p>PropAIを使えば、物件説明文・内覧メール・SNS投稿を<strong>30秒で自動生成</strong>できます。</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
           style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">
          ダッシュボードへ →
        </a>
        <hr style="margin-top: 32px;" />
        <p style="color: #666; font-size: 12px;">
          このメールはPropAIから自動送信されています。<br/>
          ご不明な点はサポートページをご確認ください。
        </p>
      </div>
    `,
  })
}

export async function sendActivationReminderEmail(email: string, daysLeft: number) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `【PropAI】無料トライアル残り${daysLeft}日です`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>無料トライアルは残り<span style="color:#e74c3c">${daysLeft}日</span>です</h2>
        <p>PropAIをお試しいただきありがとうございます。</p>
        <p>トライアル期間終了後も継続してご利用いただけます。</p>
        <h3>導入事例</h3>
        <blockquote style="border-left:4px solid #1a56db;padding-left:16px;color:#555;">
          「毎日2時間かかっていた物件説明文の作成が30分に短縮されました。」<br/>
          ― 東京都内 不動産仲介会社
        </blockquote>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
           style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">
          今すぐ使う →
        </a>
      </div>
    `,
  })
}

export async function sendInactiveUserEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '【PropAI】最近使っていますか？活用事例をご紹介',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>PropAIの活用Tips</h2>
        <p>しばらくログインがないためご連絡しました。</p>
        <h3>こんな使い方ができます</h3>
        <ul>
          <li>物件説明文を3パターン同時生成</li>
          <li>内覧案内メールをワンクリック作成</li>
          <li>Instagram/X用の投稿文を自動生成</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
           style="display:inline-block;background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">
          ダッシュボードへ →
        </a>
      </div>
    `,
  })
}

export async function sendCancellationEmail(email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '【PropAI】解約が完了しました',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ご利用ありがとうございました</h2>
        <p>PropAIの解約手続きが完了しました。</p>
        <p>ご意見・ご感想をお聞かせいただけると幸いです。</p>
        <p>またいつでもご利用いただけます。</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}"
           style="display:inline-block;background:#666;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">
          PropAIトップへ
        </a>
      </div>
    `,
  })
}
