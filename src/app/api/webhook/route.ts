import { NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendCancellationEmail } from '@/lib/email'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const email = session.customer_email ?? session.customer_details?.email ?? ''
      const priceId = session.line_items?.data[0]?.price?.id ?? ''

      const plan = Object.entries(PLANS).find(([, p]) => p.priceId === priceId)?.[0] ?? 'starter'
      const limit = PLANS[plan as keyof typeof PLANS]?.limit ?? 50

      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: session.subscription as string,
          plan,
          generation_limit: limit,
          subscription_status: 'active',
        })
        .eq('email', email)

      await sendWelcomeEmail(email)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const priceId = sub.items.data[0]?.price.id ?? ''
      const plan = Object.entries(PLANS).find(([, p]) => p.priceId === priceId)?.[0] ?? 'starter'
      const limit = PLANS[plan as keyof typeof PLANS]?.limit ?? 50

      await supabase
        .from('profiles')
        .update({
          plan,
          generation_limit: limit,
          subscription_status: sub.status,
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('stripe_subscription_id', sub.id)
        .single()

      await supabase
        .from('profiles')
        .update({ plan: 'free', subscription_status: 'canceled', generation_limit: 0 })
        .eq('stripe_subscription_id', sub.id)

      if (profile?.email) await sendCancellationEmail(profile.email)
      break
    }
  }

  return NextResponse.json({ received: true })
}
