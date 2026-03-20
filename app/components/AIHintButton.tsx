"use client";

import { useState } from "react";

interface AIHintButtonProps {
    gameName: string;
    achievementName: string;
    achievementDescription: string;
}

export default function AIHintButton({
    gameName,
    achievementName,
    achievementDescription,
}: AIHintButtonProps) {
    const [hint, setHint] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateHint = async () => {
        if (isLoading || hint) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/ai/hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameName,
                    achievementName,
                    achievementDescription,
                }),
            });

            if (!response.ok) {
                throw new Error("Помилка генерації");
            }

            // Читаємо streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("Не вдалося прочитати відповідь");
            }

            let text = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                text += decoder.decode(value, { stream: true });
                setHint(text);
            }
        } catch (err) {
            setError("Не вдалося згенерувати підказку");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-2">
            {!hint && !error ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        generateHint();
                    }}
                    disabled={isLoading}
                    className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            Генерую...
                        </>
                    ) : (
                        <>✨ AI підказка</>
                    )}
                </button>
            ) : error ? (
                <div
                    className="text-xs bg-red-900/20 border border-red-500/30 rounded-lg p-2 text-red-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {error}
                </div>
            ) : (
                <div
                    className="text-xs bg-purple-900/20 border border-purple-500/30 rounded-lg p-2 text-purple-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {hint}
                </div>
            )}
        </div>
    );
}
