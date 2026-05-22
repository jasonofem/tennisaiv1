import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json({ success: false, error: "API key required" });
  }

  try {
    // Try ATP Hamburg Open first (has matches right now)
    const sportsToTry = ["tennis_atp_hamburg_open", "tennis_wta_strasbourg", "tennis_atp_french_open", "tennis_wta_french_open"];

    for (const sportKey of sportsToTry) {
      const oddsRes = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`,
        { cache: 'no-store', signal: AbortSignal.timeout(15000) }
      );

      if (oddsRes.ok) {
        const data = await oddsRes.json();
        if (data && data.length > 0) {
          return NextResponse.json({ 
            success: true, 
            totalMatches: data.length,
            matches: data,
            sportKey: sportKey
          });
        }
      }
    }

    // If no matches found, return empty
    return NextResponse.json({ 
      success: true, 
      totalMatches: 0,
      matches: [],
      message: "No matches currently available for these tournaments"
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.name === 'TimeoutError' ? 'Request timeout' : error.message 
    });
  }
}
