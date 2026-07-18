import { NextRequest, NextResponse } from "next/server";
import { matchFit } from "@/lib/fit";

/* find-your-fit, the OPTIONAL AI leg (amended spec, 2026-07-17).
 * Without ANTHROPIC_API_KEY this returns 503 and the client uses the
 * deterministic matcher (same UI, no LLM). With a key: one capped
 * Claude call re-ranks the deterministic candidates and phrases ONE
 * honest sentence per case, grounded ONLY in the metadata we pass.
 * Key lives server-side only; per-IP rate limit; hard token cap.
 * NEEDS ELLETA: add ANTHROPIC_API_KEY in Vercel + a spend cap before
 * this goes beyond preview. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "AI leg not configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  recent.push(now);
  hits.set(ip, recent);

  const { jd } = await req.json();
  if (typeof jd !== "string" || !jd.trim()) {
    return NextResponse.json({ error: "Missing jd" }, { status: 400 });
  }

  const det = matchFit(jd.slice(0, 4000));
  if (det.cases.length === 0) return NextResponse.json({ mode: "ai", cases: [] });

  const candidates = det.cases.map((c) => ({
    id: c.id,
    title: c.title,
    skills: c.skills,
    impact: c.impact,
    matched: c.matched,
  }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Rank these portfolio cases for the role below and write ONE factual sentence per case on why it matches, using ONLY the metadata given (skills, impact). No invented claims, no numbers not present, no praise words. Return strict JSON: [{"id":"...","reason":"..."}] in rank order.\n\nRole:\n${jd.slice(0, 2000)}\n\nCases:\n${JSON.stringify(candidates)}`,
        },
      ],
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "AI call failed" }, { status: 502 });
  const data = await res.json();
  try {
    const text: string = data.content?.[0]?.text ?? "[]";
    const ranked = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1)) as {
      id: string;
      reason: string;
    }[];
    const valid = ranked.filter((r) => det.cases.some((c) => c.id === r.id));
    return NextResponse.json({ mode: "ai", ranked: valid, matchedSkills: det.matchedSkills });
  } catch {
    return NextResponse.json({ error: "Unparseable AI response" }, { status: 502 });
  }
}
