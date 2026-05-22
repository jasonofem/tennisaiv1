import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json({ success: false, error: "API key required" });
  }

  try {
    const sportsRes = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`, { signal: AbortSignal.timeout(10000) });

    if (!sportsRes.ok) {
      const err = await sportsRes.text();
      return NextResponse.json({ success: false, error: `HTTP ${sportsRes.status}`, details: err });
    }

    const sports = await sportsRes.json();
    const tennis = sports.find((s: any) => s.title?.toLowerCase().includes('tennis'));

    if (!tennis) {
      return NextResponse.json({ success: false, error: "No tennis sports found" });
    }

    const oddsRes = await fetch(`https://api.the-odds-api.com/v4/sports/${tennis.key}/odds?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    });

    if (!oddsRes.ok) {
      const err = await oddsRes.text();
      return NextResponse.json({ success: false, error: `HTTP ${oddsRes.status}`, details: err });
    }

    const data = await oddsRes.json();
    return NextResponse.json({ success: true, totalMatches: data?.length || 0, matches: data || [] });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.name === 'TimeoutError' ? 'Request timeout' : error.message });
  }
}