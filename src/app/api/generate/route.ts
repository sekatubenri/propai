import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic()

function buildPrompt(type: string, form: Record<string, string>): string {
  if (type === 'property') {
    return `あなたは不動産物件説明文の専門ライターです。以下の物件情報から、魅力的な説明文を3パターン生成してください。

【物件情報】
- 種別: ${form.type}
- 広さ: ${form.size}㎡
- 築年数: ${form.age}年
- 最寄り駅: ${form.station}駅 徒歩${form.walk}分
- 家賃: ${form.rent}万円
- 特徴: ${form.features}

【出力形式】
▼ パターン1｜スタンダード（SUUMO・HOME'S掲載用）
（200字程度の説明文）

▼ パターン2｜感情訴求（暮らしのイメージを膨らませる）
（200字程度の説明文）

▼ パターン3｜スペック重視（機能・条件を明確に伝える）
（200字程度の説明文）

▼ キャッチコピー（チラシ・SNS用）
（30字以内）`
  }

  if (type === 'email') {
    return `あなたは不動産会社の丁寧な担当者です。以下の情報から内覧案内メールを作成してください。

【情報】
- お客様名: ${form.customerName}
- 内覧日時: ${form.viewingDate}
- 物件: ${form.station}
- 物件の特徴: ${form.features}

以下の3種類のメールを作成してください：

▼ メール1｜内覧案内メール
（内覧日時の確認・アクセス情報・持ち物案内を含む丁寧なメール）

▼ メール2｜内覧後のお礼メール
（ご来場のお礼と次のステップの案内）

▼ メール3｜追客メール（内覧から1週間後）
（検討状況の確認と背中を押す一文を含む）`
  }

  if (type === 'sns') {
    return `あなたは不動産会社のSNS担当者です。以下の物件情報から、SNS投稿文を作成してください。

【物件情報】
${form.features}

【トーン】${form.postTone}

以下の3種類の投稿文を作成してください：

▼ X（旧Twitter）用投稿
（140字以内、ハッシュタグ3〜5個付き）

▼ Instagram用投稿
（300字程度、ハッシュタグ10個付き、改行を活用）

▼ Facebook用投稿
（300字程度、ビジネスライクな文体）`
  }

  return ''
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('generation_count, generation_limit, plan')
    .eq('id', user.id)
    .single()

  if (profile && profile.plan !== 'pro' && profile.generation_count >= profile.generation_limit) {
    return NextResponse.json({ error: 'Limit reached' }, { status: 429 })
  }

  const { type, form } = await request.json()
  const prompt = buildPrompt(type, form)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const result = message.content[0].type === 'text' ? message.content[0].text : ''

  await supabase.rpc('increment_generation_count', { user_id: user.id })

  await supabase.from('generations').insert({
    user_id: user.id,
    input_data: form,
    output_text: result,
    generation_type: type,
  })

  return NextResponse.json({ result })
}
