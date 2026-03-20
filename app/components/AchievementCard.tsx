import { Achievement, ModeType } from "../types/steam";
import { RARE_ACHIEVEMENT_THRESHOLD } from "../config/constants";

interface AchievementCardProps {
    achievement: Achievement;
    mode: ModeType;
    isRevealed: boolean;
    onToggleSpoiler: (id: string) => void;
    gameName?: string;
    onRequestAIHint?: (
        gameName: string,
        achievementName: string,
        achievementDescription: string
    ) => void;
}

export default function AchievementCard({
    achievement,
    mode,
    isRevealed,
    onToggleSpoiler,
    gameName,
    onRequestAIHint,
}: AchievementCardProps) {
    const isLocked = !achievement.achieved;
    const needsSpoiler =
        mode === "global" ? achievement.hidden : isLocked && achievement.hidden;
    const percentValue = Number.parseFloat(String(achievement.percent)) || 0;
    const isRare =
        percentValue > 0 && percentValue < RARE_ACHIEVEMENT_THRESHOLD;

    // Показувати кнопку "Як?" після відкриття спойлера або для не-hidden досягнень
    const showHowButton = gameName && onRequestAIHint && (!needsSpoiler || isRevealed);

    const handleAIHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRequestAIHint && gameName) {
            onRequestAIHint(
                gameName,
                achievement.name,
                achievement.description || ""
            );
        }
    };

    return (
        <div
            onClick={() => needsSpoiler && !isRevealed && onToggleSpoiler(achievement.id)}
            className={`relative p-4 rounded-xl border flex gap-4 transition-all
        ${
            achievement.achieved
                ? "bg-slate-800/50 border-emerald-500/30"
                : "bg-slate-800 border-slate-700"
        }
        ${needsSpoiler && !isRevealed ? "cursor-pointer hover:border-blue-500/50" : ""}
      `}
        >
            {needsSpoiler && !isRevealed && (
                <div className="absolute inset-0 z-40 backdrop-blur-md bg-slate-900/40 flex flex-col items-center justify-center transition-opacity hover:bg-slate-900/20 rounded-xl">
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium border border-slate-600 shadow-xl flex items-center gap-2">
                        👁️ Натисніть, щоб відкрити секрет
                    </span>
                </div>
            )}

            <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                {((mode === "global" && isRare) ||
                    (mode === "personal" &&
                        achievement.achieved &&
                        isRare)) && (
                    <div
                        className="absolute -inset-1 z-10 pointer-events-none animate-[spin_6s_linear_infinite] rounded-full blur-[2px]"
                        style={{
                            background:
                                "repeating-conic-gradient(#ffd9002d, #ffb84e00 6%, #ffd9002d 10%, #ffb84e 26%, #ffd9002d 35%, #ffb84e 40%, #ffd9002d 60%, #ffb84e 82%, #ffd9002d)",
                        }}
                    ></div>
                )}

                <img
                    src={achievement.icon}
                    alt={achievement.name}
                    className={`w-full h-full object-cover rounded-md relative z-20 
            ${mode === "personal" && isLocked ? "opacity-50 grayscale" : ""}
            ${(mode === "global" && isRare) || (mode === "personal" && achievement.achieved && isRare) ? "border border-[#d2a341]/80 shadow-md" : "border border-transparent"}
          `}
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3
                            className={`font-bold break-words ${achievement.achieved ? "text-emerald-400" : "text-slate-200"}`}
                        >
                            {achievement.name}
                        </h3>

                        <div className="relative group flex-shrink-0 z-50">
                            <span className="text-xs font-bold px-2 py-0.5 rounded block bg-slate-700 text-slate-300 cursor-default transition-colors group-hover:bg-slate-600">
                                {percentValue.toFixed(1)}%
                            </span>
                            <div className="absolute right-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none w-max bg-black/90 text-slate-200 text-[11px] px-2.5 py-1.5 rounded shadow-xl border border-slate-700">
                                {percentValue.toFixed(1)}% гравців мають це
                                досягнення
                            </div>
                        </div>
                    </div>
                    <p
                        className="text-sm text-slate-400 mt-1"
                        title={achievement.description}
                    >
                        {achievement.description}
                    </p>
                </div>

                {showHowButton && (
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleAIHintClick}
                            className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-2 py-1 rounded border border-purple-500/50 transition-colors"
                        >
                            Як?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
