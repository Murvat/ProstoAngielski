import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/server/supabaseClient"; // service role client!

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    console.log("🔔 Event received:", event.type);
  } catch (err) {
    console.error("❌ Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const user_id = session.metadata?.user_id;
    const course = session.metadata?.course;

    if (!user_id || !course) {
      console.warn("⚠️ Missing metadata");
      return NextResponse.json({ received: true });
    }

    if (session.payment_status === "paid") {
      // ✅ 1. Insert purchase if not exists
      const { data: existingPurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user_id)
        .eq("course", course)
        .maybeSingle();

      if (!existingPurchase) {
        const { error } = await supabase.from("purchases").insert({
          user_id,
          course,
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          payment_provider: "stripe",
          payment_id: session.payment_intent as string,
        });

        if (error) console.error("❌ Purchase insert error:", error.message);
        else console.log("✅ Purchase inserted");
      } else {
        console.log("⚠️ Purchase already exists, skipping insert");
      }

      // ✅ 2. Insert free trial subscription if not exists
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .maybeSingle();

      if (!existingSub) {
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        const { error } = await supabase.from("subscriptions").insert({
          user_id,
          status: "active",
          payment_provider: "stripe",
          payment_id: session.payment_intent as string,
          started_at: now.toISOString(),
          period_end: oneMonthLater.toISOString(),
          plan: "free_trial", // ⚠️ must be added to your CHECK constraint
          price_id: "free_trial",
        });

        if (error) console.error("❌ Subscription insert error:", error.message);
        else console.log("✅ Subscription created (1-month free trial)");
      } else {
        console.log("⚠️ Subscription already exists, skipping insert");
      }
    }
  }

  return NextResponse.json({ received: true });
}
