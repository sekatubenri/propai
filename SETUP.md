# PropAI セットアップ手順書

## 全体の流れ（所要時間：約2〜3時間）

```
STEP 1: Supabase設定        (20分)
STEP 2: Anthropic API取得   (5分)
STEP 3: Stripe設定          (30分)
STEP 4: Resend設定          (10分)
STEP 5: Vercelデプロイ      (20分)
STEP 6: Webhook設定         (10分)
STEP 7: n8n設定             (30分)
STEP 8: 動作確認            (10分)
```

---

## STEP 1: Supabase設定

1. https://app.supabase.com にアクセスしてアカウント作成
2. 「New Project」をクリックしてプロジェクト作成
3. プロジェクト名: `propai`、パスワードは安全なものを設定

### APIキーの取得
- 左メニュー → Settings → API
- 以下をコピーして `.env.local` に貼り付け:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### スキーマの実行
- 左メニュー → SQL Editor
- `supabase/schema.sql` の内容を全てペーストして「Run」クリック

---

## STEP 2: Anthropic API取得

1. https://console.anthropic.com にアクセスしてアカウント作成
2. 「API Keys」→「Create Key」
3. 作成したキーを `ANTHROPIC_API_KEY` に設定

---

## STEP 3: Stripe設定

1. https://dashboard.stripe.com にアクセスしてアカウント作成

### 料金プランの作成
- 左メニュー → Products → 「Add Product」
- 以下の3つを作成:

| 商品名 | 価格 | 請求期間 |
|--------|------|---------|
| PropAI スターター | ¥4,980 | 月次 |
| PropAI スタンダード | ¥9,800 | 月次 |
| PropAI プロ | ¥29,800 | 月次 |

- 各商品の「Price ID」（`price_xxxx`）をコピーして `.env.local` に設定

### APIキーの取得
- 左メニュー → Developers → API Keys
- `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `Secret key` → `STRIPE_SECRET_KEY`

### カスタマーポータルの有効化
- 左メニュー → Settings → Billing → Customer portal
- 「Activate test link」をクリックして有効化

---

## STEP 4: Resend設定

1. https://resend.com にアクセスしてアカウント作成
2. 「API Keys」→「Create API Key」
3. 作成したキーを `RESEND_API_KEY` に設定
4. 「Domains」でドメインを追加（独自ドメインがある場合）
   - ない場合は `onboarding@resend.dev` で開始可能

---

## STEP 5: Vercelデプロイ

### GitHubにプッシュ
```bash
cd C:\Users\ha082\Documents\propai
git init
git add .
git commit -m "Initial commit"
# GitHubでリポジトリを作成してからプッシュ
git remote add origin https://github.com/あなたのユーザー名/propai.git
git push -u origin main
```

### Vercelにデプロイ
1. https://vercel.com にアクセスしてGitHubでログイン
2. 「New Project」→ GitHubリポジトリを選択
3. 「Environment Variables」に `.env.local` の内容を全て入力
4. 「Deploy」クリック

### デプロイ後
- `NEXT_PUBLIC_SITE_URL` を Vercelの実際のURLに更新
  例: `https://propai.vercel.app`

---

## STEP 6: Stripe Webhook設定

1. Stripeダッシュボード → Developers → Webhooks
2. 「Add endpoint」クリック
3. Endpoint URL: `https://あなたのドメイン/api/webhook`
4. 以下のイベントを選択:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. 「Signing secret」をコピーして `STRIPE_WEBHOOK_SECRET` に設定
6. Vercelの環境変数を更新して再デプロイ

---

## STEP 7: n8n設定（自動化）

### n8nのインストール（サーバー版）
```bash
# Railway.appやRenderで無料ホスティング可能
# または npm install -g n8n でローカル実行
npx n8n start
```

### ワークフローのインポート
1. n8n画面 → Workflows → Import
2. `n8n/workflows/` 内の3つのJSONファイルをそれぞれインポート
3. 各ワークフローで「Supabase DB」接続を設定:
   - Host: `あなたのproject.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: Supabaseで設定したパスワード

---

## STEP 8: 動作確認

### 確認チェックリスト
```
□ トップページが表示される
□ サインアップができる（メールが届く）
□ ログインができる
□ ダッシュボードで文章が生成される
□ 設定ページでStripeのプラン選択画面に遷移する
□ 解約がStripeポータルからできる
```

---

## 料金目安（月次ランニングコスト）

| サービス | 料金 |
|---------|------|
| Vercel | 無料（Hobbyプラン） |
| Supabase | 無料（〜500MBまで） |
| Claude API | 約1〜3円/生成 × 利用数 |
| Resend | 無料（月3,000通まで） |
| n8n | 無料（セルフホスト） |
| **合計** | **Claude API費用のみ** |

100社のユーザーが月300件生成した場合:
- Claude API費用 ≈ 約3万円/月
- 売上 ≈ 9,800円 × 100社 = 98万円/月
- 粗利 ≈ 95万円/月

---

## サポート

問題が発生した場合は、以下を確認してください:
1. `.env.local` の値が正しいか
2. Supabaseのスキーマが正しく実行されているか
3. VercelのEnvironment Variablesが最新か
