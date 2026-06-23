'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLANS } from '@/lib/stripe'

type Profile = {
  plan: string
  generation_count: number
  generation_limit: number
  subscription_status: string
  company_name?: string
}

const PLAN_DISPLAY = {
  starter: { name: 'スターター', price: '4,980', limit: '月50件' },
  standard: { name: 'スタンダード', price: '9,800', limit: '月300件' },
  pro: { name: 'プロ', price: '29,800', limit: '無制限' },
}

export default function SettingsClient({ profile, userEmail }: { profile: Profile | null, userEmail: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: string) => {
    setLoading(plan)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  const handlePortal = async () => {
    setLoading('portal')
    const res = await fetch('/api/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  const currentPlan = profile?.plan ?? 'free'
  const hasActiveSubscription = profile?.subscription_status === 'active'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-blue-700">PropAI</Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">← ダッシュボードへ</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* アカウント情報 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">アカウント情報</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">メールアドレス</span>
              <span className="text-gray-900">{userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">会社名</span>
              <span className="text-gray-900">{profile?.company_name ?? '未設定'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">現在のプラン</span>
              <span className="font-medium text-blue-700 capitalize">{currentPlan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">今月の生成数</span>
              <span>{profile?.generation_count ?? 0} / {currentPlan === 'pro' ? '無制限' : (profile?.generation_limit ?? 0)}件</span>
            </div>
          </div>
        </div>

        {/* プラン選択 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-2">プランを選択</h2>
          <p className="text-sm text-gray-500 mb-6">すべてのプランに14日間無料トライアル付き</p>

          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(PLAN_DISPLAY) as [string, typeof PLAN_DISPLAY.starter][]).map(([key, plan]) => {
              const isCurrent = currentPlan === key
              return (
                <div key={key} className={`border-2 rounded-xl p-5 ${isCurrent ? 'border-blue-700 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="font-bold text-gray-900 mb-1">{plan.name}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">¥{plan.price}<span className="text-sm font-normal text-gray-500">/月</span></div>
                  <div className="text-sm text-gray-500 mb-4">{plan.limit}</div>

                  {isCurrent ? (
                    <div className="text-center text-sm font-medium text-blue-700 py-2">現在のプラン</div>
                  ) : (
                    <button
                      onClick={() => handleCheckout(key)}
                      disabled={loading === key}
                      className="w-full bg-blue-700 text-white text-sm py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {loading === key ? '処理中...' : hasActiveSubscription ? 'このプランに変更' : '無料で試す'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 請求管理 */}
        {hasActiveSubscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-2">請求・解約管理</h2>
            <p className="text-sm text-gray-500 mb-4">Stripeの請求ポータルでカード変更・解約ができます。</p>
            <button
              onClick={handlePortal}
              disabled={loading === 'portal'}
              className="bg-gray-100 text-gray-900 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading === 'portal' ? '処理中...' : '請求・解約管理ページへ →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
