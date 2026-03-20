import { NextResponse } from "next/server";

interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url?: string;
    img_logo_url?: string;
}

interface SteamGamesResponse {
    response: {
        game_count: number;
        games?: SteamGame[];
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
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
        );

        if (!response.ok) {
            throw new Error(
                `Steam API responded with status ${response.status}`,
            );
        }

        const data: SteamGamesResponse = await response.json();

        if (!data.response?.games) {
            return NextResponse.json([]);
        }

        const games = data.response.games.sort(
            (a, b) => b.playtime_forever - a.playtime_forever,
        );

        return NextResponse.json(games);
    } catch (error) {
        console.error("Steam games fetch error:", error);
        return NextResponse.json(
            { error: "Помилка при запиті ігор" },
            { status: 500 },
        );
    }
}
