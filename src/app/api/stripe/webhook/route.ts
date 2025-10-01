import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/server/supabaseClient"; // ⚠️ must use SERVICE_ROLE key!

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = "nodejs"; // required for raw body parsing

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    console.log("🔔 Event received:", event.type);
  } catch (err: unknown) {
    console.error("❌ Signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const user_id = session.metadata?.user_id;
    const course = session.metadata?.course;

    console.log("➡️ User:", user_id);
    console.log("➡️ Course:", course);
    console.log("➡️ Payment status:", session.payment_status);

    if (user_id && course && session.payment_status === "paid") {
      const { data, error } = await supabase
        .from("purchases")
        .insert({
          user_id,
          course,
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          payment_provider: "stripe",
          payment_id: session.payment_intent as string,
        })
        .select();

      if (error) {
        console.error("❌ Supabase insert error:", error.message);
      } else {
        console.log("✅ Purchase inserted:", data);
      }
    } else {
      console.warn("⚠️ Missing user_id, course, or payment not 'paid'");
    }
  }

  return NextResponse.json({ received: true });
}
