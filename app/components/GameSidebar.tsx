import { Game, SteamProfile, ModeType } from "../types/steam";
import { STEAM_MEDIA_BASE } from "../config/constants";

interface GameSidebarProps {
    games: Game[];
    profile: SteamProfile | null;
    selectedGame: Game | null;
    mode: ModeType;
    isSidebarOpen?: boolean;
    onSelectGame: (game: Game) => void;
    onBackToLanding: () => void;
    onLogout?: () => void;
}

export default function GameSidebar({
    games,
    profile,
    selectedGame,
    mode,
    isSidebarOpen = false,
    onSelectGame,
    onBackToLanding,
    onLogout,
}: GameSidebarProps) {
    return (
        <aside
            className={`w-80 lg:w-96 bg-slate-800 border-r border-slate-700 flex flex-col z-50 fixed md:relative inset-y-0 left-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
            <div
                className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors group"
                onClick={onBackToLanding}
            >
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    TrophyHunter
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {games.length > 0 ? (
                    <>
                        <p className="text-xs font-bold text-slate-500 uppercase px-2 pt-2 pb-1 tracking-wider">
                            Моя бібліотека
                        </p>
                        {games.map((game) => (
                            <button
                                key={game.appid}
                                onClick={() => onSelectGame(game)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left
                  ${selectedGame?.appid === game.appid && mode === "personal" ? "bg-blue-600" : "hover:bg-slate-700"}
                `}
                            >
                                {game.img_icon_url ? (
                                    <img
                                        src={`${STEAM_MEDIA_BASE}/${game.appid}/${game.img_icon_url}.jpg`}
                                        alt=""
                                        className="w-8 h-8 rounded"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded bg-slate-600"></div>
                                )}
                                <span className="truncate text-sm font-medium">
                                    {game.name}
                                </span>
                            </button>
                        ))}
                    </>
                ) : (
                    <div className="p-4 text-center text-slate-500 text-sm mt-10">
                        <p>Бібліотека порожня або профіль приховано.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-800">
                {profile ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={profile.avatarfull}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <p className="font-bold text-sm">
                                {profile.personaname}
                            </p>
                        </div>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-700"
                                title="Вийти"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic">
                        Не авторизовано
                    </p>
                )}
            </div>
        </aside>
    );
}
