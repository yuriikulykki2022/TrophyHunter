import { Achievement, Game, ModeType, SortType } from "../types/steam";
import { STEAM_STORE_ASSETS } from "../config/constants";
import AchievementCard from "./AchievementCard";

interface AchievementGridProps {
    selectedGame: Game | null;
    mode: ModeType;
    achievements: Achievement[];
    loadingAchievements: boolean;
    sortBy: SortType;
    setSortBy: (sort: SortType) => void;
    revealedSpoilers: Set<string>;
    onToggleSpoiler: (id: string) => void;
    onRequestAIHint?: (
        gameName: string,
        achievementName: string,
        achievementDescription: string
    ) => void;
}

export default function AchievementGrid({
    selectedGame,
    mode,
    achievements,
    loadingAchievements,
    sortBy,
    setSortBy,
    revealedSpoilers,
    onToggleSpoiler,
    onRequestAIHint,
}: AchievementGridProps) {
    const sortedAchievements = [...achievements].sort((a, b) => {
        const percentA = Number.parseFloat(String(a.percent)) || 0;
        const percentB = Number.parseFloat(String(b.percent)) || 0;

        if (sortBy === "rare") return percentA - percentB;
        if (sortBy === "common") return percentB - percentA;

        if (sortBy === "locked") {
            if (a.achieved === b.achieved) return percentA - percentB;
            return a.achieved ? 1 : -1;
        }
        if (sortBy === "unlocked") {
            if (a.achieved === b.achieved) return percentA - percentB;
            return a.achieved ? -1 : 1;
        }

        return 0;
    });

    if (!selectedGame) {
        return (
            <div className="h-full flex items-center justify-center text-center">
                <div>
                    <p className="text-6xl mb-4">🎮</p>
                    <h2 className="text-2xl font-bold text-slate-300">
                        Вибери гру зі списку зліва
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-20 max-w-6xl mx-auto w-full">
            <div className="flex items-end gap-6 mb-8 border-b border-slate-700 pb-6 sticky top-0 bg-slate-900/90 backdrop-blur-md pt-4 z-40 pl-14 md:pl-0">
                <img
                    src={`${STEAM_STORE_ASSETS}/${selectedGame.appid}/capsule_231x87.jpg`}
                    alt={selectedGame.name}
                    className="rounded-lg shadow-lg hidden sm:block h-24 object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-bold">
                            {selectedGame.name}
                        </h2>
                        <span
                            className={`px-3 py-1 text-xs font-bold rounded-full border ${mode === "global" ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "bg-blue-500/20 text-blue-400 border-blue-500/50"}`}
                        >
                            {mode === "global"
                                ? "Глобальна база"
                                : "Особистий прогрес"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-slate-300 font-medium bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 shadow-sm">
                            {loadingAchievements
                                ? "Шукаємо..."
                                : mode === "global"
                                  ? `Всього досягнень: ${achievements.length}`
                                  : `Виконано: ${achievements.filter((a) => a.achieved).length} з ${achievements.length}`}
                        </p>

                        {!loadingAchievements && achievements.length > 0 && (
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as SortType)
                                }
                                className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1.5 px-3 cursor-pointer outline-none hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <option value="rare">Найрідкісніші</option>
                                <option value="common">Найчастіші</option>
                                {mode === "personal" && (
                                    <>
                                        <option value="locked">
                                            Спочатку закриті
                                        </option>
                                        <option value="unlocked">
                                            Спочатку відкриті
                                        </option>
                                    </>
                                )}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {loadingAchievements ? (
                <div className="flex justify-center pt-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortedAchievements.map((ach) => (
                        <AchievementCard
                            key={ach.id}
                            achievement={ach}
                            mode={mode}
                            isRevealed={revealedSpoilers.has(ach.id)}
                            onToggleSpoiler={onToggleSpoiler}
                            gameName={selectedGame.name}
                            onRequestAIHint={onRequestAIHint}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center pt-20 text-slate-500">
                    <p className="text-4xl mb-4">🤷‍♂️</p>
                    <p>У цієї гри немає досягнень або до них немає доступу.</p>
                </div>
            )}
        </div>
    );
}
