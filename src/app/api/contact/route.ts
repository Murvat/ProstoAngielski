import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Email to support
    await resend.emails.send({
      from: "ProstoAngielski <onboarding@resend.dev>", // domain configured in Resend
      to: process.env.SUPPORT_EMAIL!,
      subject: `📩 Nowa wiadomość od ${name}`,
      replyTo: email,
      text: `Od: ${name} <${email}>\n\n${message}`,
    });

    // (Optional) confirmation email to user
    await resend.emails.send({
      from: "ProstoAngielski <onboarding@resend.dev>",
      to: email,
      subject: "Dziękujemy za kontakt",
      text: `Cześć ${name},\n\nDziękujemy za Twoją wiadomość. Skontaktujemy się wkrótce.\n\n— Zespół ProstoAngielski`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
