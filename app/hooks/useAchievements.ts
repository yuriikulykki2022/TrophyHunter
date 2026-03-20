import { useState, useEffect } from "react";
import { Achievement, Game, ModeType } from "../types/steam";

interface UseAchievementsReturn {
    achievements: Achievement[];
    loadingAchievements: boolean;
    error: string | null;
    revealedSpoilers: Set<string>;
    toggleSpoiler: (id: string) => void;
}

export function useAchievements(
    selectedGame: Game | null,
    mode: ModeType,
    steamId?: string,
): UseAchievementsReturn {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loadingAchievements, setLoadingAchievements] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(
        new Set(),
    );

    useEffect(() => {
        if (selectedGame) {
            setLoadingAchievements(true);
            setAchievements([]);
            setRevealedSpoilers(new Set());
            setError(null);

            const endpoint =
                mode === "personal" && steamId
                    ? `/api/steam/achievements?appid=${selectedGame.appid}&steamId=${steamId}`
                    : `/api/steam/achievements/global?appid=${selectedGame.appid}`;

            fetch(endpoint)
                .then((res) => res.json())
                .then((data) => {
                    setAchievements(Array.isArray(data) ? data : []);
                    setLoadingAchievements(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Не вдалося завантажити досягнення");
                    setLoadingAchievements(false);
                });
        }
    }, [selectedGame, mode, steamId]);

    const toggleSpoiler = (id: string) => {
        setRevealedSpoilers((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    return {
        achievements,
        loadingAchievements,
        error,
        revealedSpoilers,
        toggleSpoiler,
    };
}
