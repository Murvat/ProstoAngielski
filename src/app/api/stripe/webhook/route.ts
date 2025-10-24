import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/server/supabaseClient";
import {
  getPurchaseForCourse,
  insertPurchase,
  getSubscriptionByUser,
  insertSubscription,
} from "@/lib/supabase/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    console.log("Event received:", event.type);
  } catch (err) {
    console.error("Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const user_id = session.metadata?.user_id;
    const course = session.metadata?.course;

    if (!user_id || !course) {
      console.warn("Missing metadata");
      return NextResponse.json({ received: true });
    }

    if (session.payment_status === "paid") {
      const { data: existingPurchase, error: purchaseLookupError } =
        await getPurchaseForCourse(supabase, user_id, course);

      if (purchaseLookupError) {
        console.error("Purchase lookup error:", purchaseLookupError.message);
      } else if (!existingPurchase) {
        const purchaseError = await insertPurchase(supabase, {
          user_id,
          course,
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          payment_provider: "stripe",
          payment_id: session.payment_intent as string,
          price_id: session.line_items?.data?.[0]?.price?.id ?? null,
        });

        if (purchaseError) {
          console.error("Purchase insert error:", purchaseError.message);
        } else {
          console.log("Purchase inserted");
        }
      } else {
        console.log("Purchase already exists, skipping insert");
      }

      const { data: existingSub, error: subLookupError } =
        await getSubscriptionByUser(supabase, user_id);

      if (subLookupError) {
        console.error("Subscription lookup error:", subLookupError.message);
      } else if (!existingSub) {
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(now.getMonth() + 1);

        const subscriptionError = await insertSubscription(supabase, {
          user_id,
          status: "active",
          payment_provider: "stripe",
          payment_id: session.payment_intent as string,
          started_at: now.toISOString(),
          period_end: oneMonthLater.toISOString(),
          plan: "free_trial",
          price_id: "free_trial",
        });

        if (subscriptionError) {
          console.error(
            "Subscription insert error:",
            subscriptionError.message
          );
        } else {
          console.log("Subscription created (1-month free trial)");
        }
      } else {
        console.log("Subscription already exists, skipping insert");
      }
    }
  }

  return NextResponse.json({ received: true });
}
