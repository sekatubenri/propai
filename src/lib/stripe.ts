import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export const PLANS = {
  starter: {
    name: 'スターター',
    price: 4980,
    limit: 50,
    priceId: process.env.STRIPE_PRICE_STARTER!,
  },
  standard: {
    name: 'スタンダード',
    price: 9800,
    limit: 300,
    priceId: process.env.STRIPE_PRICE_STANDARD!,
  },
  pro: {
    name: 'プロ',
    price: 29800,
    limit: 999999,
    priceId: process.env.STRIPE_PRICE_PRO!,
  },
} as const

export type PlanKey = keyof typeof PLANS
