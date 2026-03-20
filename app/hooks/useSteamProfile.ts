import { useState, useEffect } from "react";
import { SteamProfile, Game } from "../types/steam";

interface UseSteamProfileReturn {
    profile: SteamProfile | null;
    games: Game[];
    isLoading: boolean;
    error: string | null;
}

export function useSteamProfile(steamId?: string): UseSteamProfileReturn {
    const [profile, setProfile] = useState<SteamProfile | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!steamId) {
            setIsLoading(false);
            return;
        }

        Promise.all([
            fetch(`/api/steam?steamId=${steamId}`).then((res) => res.json()),
            fetch(`/api/steam/games?steamId=${steamId}`).then((res) =>
                res.json(),
            ),
        ])
            .then(([profileData, gamesData]) => {
                if (!profileData.error) {
                    setProfile(profileData);
                }

                if (Array.isArray(gamesData)) {
                    setGames(gamesData);
                }

                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Не вдалося завантажити профіль Steam");
                setIsLoading(false);
            });
    }, [steamId]);

    return { profile, games, isLoading, error };
}
