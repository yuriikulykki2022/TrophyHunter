import { NextResponse } from "next/server";

interface SteamPlayerResponse {
    response: {
        players: Array<{
            steamid: string;
            personaname: string;
            profileurl: string;
            avatar: string;
            avatarmedium: string;
            avatarfull: string;
            personastate: number;
            communityvisibilitystate: number;
        }>;
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get("steamId");
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamId) {
        return NextResponse.json(
            { error: "Steam ID required" },
            { status: 400 },
        );
    }

    if (!apiKey) {
        return NextResponse.json(
            { error: "API Key not configured" },
            { status: 500 },
        );
    }

    try {
        const response = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
        );

        if (!response.ok) {
            throw new Error(
                `Steam API responded with status ${response.status}`,
            );
        }

        const data: SteamPlayerResponse = await response.json();

        if (!data.response?.players?.[0]) {
            return NextResponse.json(
                { error: "Профіль не знайдено" },
                { status: 404 },
            );
        }

        return NextResponse.json(data.response.players[0]);
    } catch (error) {
        console.error("Steam profile fetch error:", error);
        return NextResponse.json(
            { error: "Помилка при запиті до Steam" },
            { status: 500 },
        );
    }
}
