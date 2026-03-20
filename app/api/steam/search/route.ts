import { NextResponse } from "next/server";

interface SteamSearchItem {
    id: number;
    type: number;
    name: string;
    discounted: boolean;
    discount_percent: number;
    original_price: number;
    final_price: number;
    currency: string;
    small_capsule_image: string;
    windows_available: boolean;
    mac_available: boolean;
    linux_available: boolean;
    streamingvideo_available: boolean;
    tiny_image: string;
}

interface SteamSearchResponse {
    items: SteamSearchItem[];
    total: number;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
        return NextResponse.json(
            { error: "Введіть назву гри (мінімум 2 символи)" },
            { status: 400 },
        );
    }

    try {
        const res = await fetch(
            `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=ukrainian&cc=UA`,
        );

        if (!res.ok) {
            throw new Error(
                `Steam Store API responded with status ${res.status}`,
            );
        }

        const data: SteamSearchResponse = await res.json();

        return NextResponse.json(data.items || []);
    } catch (error) {
        console.error("Steam search error:", error);
        return NextResponse.json(
            { error: "Помилка пошуку в Steam" },
            { status: 500 },
        );
    }
}
