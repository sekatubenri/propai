'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  plan: string
  generation_count: number
  generation_limit: number
  company_name?: string
}

type GenerationType = 'property' | 'email' | 'sns'

const TAB_LABELS: Record<GenerationType, string> = {
  property: '物件説明文',
  email: '内覧メール',
  sns: 'SNS投稿',
}

export default function DashboardClient({ profile, userEmail }: { profile: Profile | null, userEmail: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<GenerationType>('property')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    type: 'マンション',
    size: '',
    age: '',
    station: '',
    walk: '',
    rent: '',
    features: '',
    customerName: '',
    viewingDate: '',
    postTone: 'プロフェッショナル',
  })

  const usagePercent = profile
    ? Math.min((profile.generation_count / Math.max(profile.generation_limit, 1)) * 100, 100)
    : 0

  const isLimitReached = profile
    ? profile.generation_count >= profile.generation_limit && profile.plan !== 'pro'
    : false

  const handleGenerate = async () => {
    if (isLimitReached) return
    setLoading(true)
    setResult('')

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: activeTab, form }),
    })

    if (res.status === 429) {
      setResult('今月の生成上限に達しました。プランをアップグレードしてください。')
      setLoading(false)
      return
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      setResult(`エラー [${res.status}]: ${errData.error || '不明なエラー'}`)
      setLoading(false)
      return
    }

    const data = await res.json()
    setResult(data.result)
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-700">PropAI</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 hidden sm:block">{userEmail}</span>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">設定</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">ログアウト</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* プラン表示 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-sm text-gray-500">現在のプラン：</span>
            <span className="font-medium text-gray-900 ml-1 capitalize">{profile?.plan ?? 'free'}</span>
            {profile?.plan === 'free' && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">トライアル中</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              今月の生成数：<strong>{profile?.generation_count ?? 0}</strong> / {profile?.plan === 'pro' ? '無制限' : (profile?.generation_limit ?? 0)}件
            </div>
            {profile?.plan !== 'pro' && (
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${usagePercent}%` }} />
              </div>
            )}
            {profile?.plan === 'free' && (
              <Link href="/settings" className="text-xs bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800">
                プランを選択
              </Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 入力パネル */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* タブ */}
            <div className="flex border-b border-gray-200 mb-6">
              {(Object.keys(TAB_LABELS) as GenerationType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setResult('') }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-700 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* 物件説明文フォーム */}
            {activeTab === 'property' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">物件種別</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {['マンション', '戸建て', 'アパート', 'テラスハウス', '土地'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">広さ（㎡）</label>
                    <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                      placeholder="65" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">築年数（年）</label>
                    <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                      placeholder="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">家賃（万円）</label>
                    <input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })}
                      placeholder="12" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">最寄り駅</label>
                    <input type="text" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })}
                      placeholder="渋谷" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">駅からの徒歩（分）</label>
                    <input type="number" value={form.walk} onChange={(e) => setForm({ ...form, walk: e.target.value })}
                      placeholder="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">物件の特徴（カンマ区切り）</label>
                  <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="日当たり良好、リフォーム済み、オートロック、宅配ボックス"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            )}

            {/* 内覧メールフォーム */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">お客様のお名前</label>
                  <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="田中 様" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">内覧日時</label>
                  <input type="text" value={form.viewingDate} onChange={(e) => setForm({ ...form, viewingDate: e.target.value })}
                    placeholder="7月5日（土）14:00" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">物件名・住所</label>
                  <input type="text" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })}
                    placeholder="グランドメゾン渋谷 201号室" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">物件の特徴</label>
                  <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="2LDK、リフォーム済み、南向き" rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            )}

            {/* SNS投稿フォーム */}
            {activeTab === 'sns' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">投稿のトーン</label>
                  <select value={form.postTone} onChange={(e) => setForm({ ...form, postTone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['プロフェッショナル', '親しみやすい', '情熱的', 'シンプル'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">物件情報・訴求ポイント</label>
                  <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="渋谷5分、2LDK、リフォーム済み、ペット可、月12万円" rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || isLimitReached}
              className="mt-6 w-full bg-blue-700 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '生成中...' : `${TAB_LABELS[activeTab]}を生成する →`}
            </button>

            {isLimitReached && (
              <p className="text-center text-sm text-red-500 mt-2">
                今月の上限に達しました。
                <Link href="/settings" className="underline">プランをアップグレード</Link>
              </p>
            )}
          </div>

          {/* 出力パネル */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">生成結果</h2>
              {result && (
                <button onClick={handleCopy}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                  {copied ? 'コピーしました！' : 'コピー'}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm">AIが生成中...</p>
                </div>
              </div>
            ) : result ? (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed min-h-48 max-h-96 overflow-y-auto">
                {result}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
                左のフォームを入力して生成ボタンを押してください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
