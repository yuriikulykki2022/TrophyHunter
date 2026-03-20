import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const appid = searchParams.get("appid");
    const steamId = searchParams.get("steamId");

    const apiKey = process.env.STEAM_API_KEY;

    if (!appid || !apiKey || !steamId) {
        return NextResponse.json(
            { error: "Немає ключів, ID гри або Steam ID" },
            { status: 400 },
        );
    }

    try {
        // 1. Прогрес гравця
        const progressRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${apiKey}&steamid=${steamId}`,
        );
        const progressData = await progressRes.json();

        if (
            !progressData.playerstats ||
            !progressData.playerstats.achievements
        ) {
            return NextResponse.json([]);
        }

        // 2. Словник гри
        const schemaRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${appid}`,
        );
        const schemaData = await schemaRes.json();

        // 3. НОВЕ: Глобальні відсотки рідкісності (зверни увагу, тут параметр називається gameid)
        const globalRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appid}`,
        );
        const globalData = await globalRes.json();
        const globalPercentages =
            globalData.achievementpercentages?.achievements || [];

        const schemaAchievements =
            schemaData.game.availableGameStats?.achievements || [];
        const userAchievements = progressData.playerstats.achievements;

        // Зшиваємо все докупи
        const mergedAchievements = schemaAchievements.map((schema: any) => {
            const userStat = userAchievements.find(
                (ua: any) => ua.apiname === schema.name,
            );
            const isAchieved = userStat ? userStat.achieved === 1 : false;

            // Шукаємо відсоток для цієї ачівки (якщо немає, ставимо 0)
            const globalStat = globalPercentages.find(
                (g: any) => g.name === schema.name,
            );
            const percent = globalStat ? globalStat.percent : 0;

            return {
                id: schema.name,
                name: schema.displayName,
                description: schema.description || "Секретне досягнення",
                icon: isAchieved ? schema.icon : schema.icongray,
                achieved: isAchieved,
                hidden: schema.hidden === 1,
                percent: percent, // Зберігаємо відсоток!
            };
        });

        mergedAchievements.sort(
            (a: any, b: any) => Number(a.achieved) - Number(b.achieved),
        );

        return NextResponse.json(mergedAchievements);
    } catch (error) {
        return NextResponse.json(
            { error: "Помилка при зборі досягнень" },
            { status: 500 },
        );
    }
}
