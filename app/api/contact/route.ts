import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Quiet anti-spam (2026-07-17, no CAPTCHA): honeypot field, minimum
 * fill time, and a small per-IP rate limit. Rejected humans still see
 * the LinkedIn path in the client's failure copy. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 3000;
const hits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, company, startedAt } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // honeypot: humans never fill "company"
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ error: "Rejected" }, { status: 422 });
    }
    // minimum fill time: instant submissions are not people
    if (typeof startedAt === "number" && Date.now() - startedAt < MIN_FILL_MS) {
      return NextResponse.json({ error: "Rejected" }, { status: 422 });
    }
    // per-IP rate limit (in-memory; resets on redeploy, good enough here)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    recent.push(now);
    hits.set(ip, recent);

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "elletamc@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
