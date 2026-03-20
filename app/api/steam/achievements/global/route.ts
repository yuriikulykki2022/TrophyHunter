import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const appid = searchParams.get("appid");

    const apiKey = process.env.STEAM_API_KEY;

    if (!appid || !apiKey) {
        return NextResponse.json(
            { error: "Немає ID гри або ключа" },
            { status: 400 },
        );
    }

    try {
        // 1. Запитуємо СЛОВНИК гри (назви, описи, іконки)
        const schemaRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${appid}`,
        );
        const schemaData = await schemaRes.json();
        const schemaAchievements =
            schemaData.game.availableGameStats?.achievements || [];

        // 2. Запитуємо глобальні відсотки
        const globalRes = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appid}`,
        );
        const globalData = await globalRes.json();
        const globalPercentages =
            globalData.achievementpercentages?.achievements || [];

        // 3. Зшиваємо дані докупи (без прогресу гравця)
        const mergedAchievements = schemaAchievements.map((schema: any) => {
            const globalStat = globalPercentages.find(
                (g: any) => g.name === schema.name,
            );
            const percent = globalStat ? globalStat.percent : 0;

            return {
                id: schema.name,
                name: schema.displayName,
                description: schema.description || "Секретне досягнення",
                icon: schema.icon, // Для загальної бази віддаємо відразу кольорові іконки!
                achieved: false, // Оскільки це глобальний пошук, ніхто ще нічого не вибив
                hidden: schema.hidden === 1,
                percent: percent,
            };
        });

        // Сортуємо: найрідкісніші (найскладніші) будуть зверху!
        mergedAchievements.sort((a: any, b: any) => a.percent - b.percent);

        return NextResponse.json(mergedAchievements);
    } catch (error) {
        return NextResponse.json(
            { error: "Помилка при зборі глобальних досягнень" },
            { status: 500 },
        );
    }
}
