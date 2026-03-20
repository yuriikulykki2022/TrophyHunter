import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(request: Request) {
    try {
        const { gameName, achievementName, achievementDescription } =
            await request.json();

        if (!achievementName) {
            return new Response(
                JSON.stringify({ error: "Назва досягнення обов'язкова" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        const result = streamText({
            model: google("gemini-3.1-flash-lite-preview"),
            system: `Ти — експерт-гайдрайтер для відеоігор. Твоя задача — давати чіткі технічні гайди як отримати конкретні досягнення (achievements).

ФОРМАТ ВІДПОВІДІ:
- Пиши українською, але назви локацій, предметів, NPC, квестів давай англійською або українською з англійською в дужках
  Приклад: "Йди в Залу Вогню (Hall of Fire)" або "поговори з Blacksmith"
- Давай конкретні кроки: локації, NPC, предмети, умови
- Якщо є кілька способів — опиши найпростіший
- Якщо потрібні специфічні умови (рівень, клас, квест) — вкажи їх
- Відповідай стисло але інформативно (3-5 речень)
- НЕ використовуй markdown форматування (без ** _ \` тощо) — пиши звичайним текстом

ВАЖЛИВО:
- Це НЕ підказка, а повний гайд
- Якщо не знаєш точно — скажи що не впевнений, але дай загальний напрямок`,
            prompt: `Гра: ${gameName || "Невідома гра"}
Досягнення: "${achievementName}"
${achievementDescription ? `Опис: "${achievementDescription}"` : "Опис прихований."}

Напиши технічний гайд як отримати це досягнення:`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("AI hint generation error:", error);
        return new Response(
            JSON.stringify({ error: "Помилка генерації підказки" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
