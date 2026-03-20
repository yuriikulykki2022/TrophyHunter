import type { NextRequest } from "next/server";

type Params = { params: Promise<{ provider: string }> };

export async function GET(
    req: NextRequest,
    { params }: Params,
): Promise<Response> {
    const { provider } = await params;
    const { searchParams } = new URL(req.url);

    // Inject a fake code to satisfy NextAuth v5 validation
    searchParams.set("code", "steam_openid");

    const callbackUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/${provider}?${searchParams.toString()}`;

    return Response.redirect(callbackUrl);
}

export async function POST(): Promise<Response> {
    // Fake token endpoint for NextAuth v5 compatibility
    return Response.json({ token: "steam_openid_token" });
}
