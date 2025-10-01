import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server/server"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  const { course } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user_id = user.id;
  
  // Always work with course IDs ("beginner", "intermediate", "upper", "advanced")
  const prices: Record<string, number> = {
    beginner: 9900,
    intermediate: 14900,
    upper: 17900,
    advanced: 19900,
  };

  if (!prices[course]) {
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "blik"],
    line_items: [
      {
        price_data: {
          currency: "pln",
          product_data: { name: `${course} English Course` }, // title for Stripe only
          unit_amount: prices[course],
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.nextUrl.origin}/payment-success`,
    cancel_url: `${req.nextUrl.origin}/profile`,
    metadata: {
      user_id,
      course, // ✅ keep id in metadata so webhook can update correctly
    },
  });

  return NextResponse.json({ url: session.url });
}
