"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSteamProfile } from "./hooks/useSteamProfile";
import { useGameSearch } from "./hooks/useGameSearch";
import { useAchievements } from "./hooks/useAchievements";
import SearchBar from "./components/SearchBar";
import GameSidebar from "./components/GameSidebar";
import AchievementGrid from "./components/AchievementGrid";
import AIChatSidebar from "./components/AIChatSidebar";
import ErrorMessage from "./components/ErrorMessage";
import {
    Game,
    SearchResult,
    ScreenType,
    ModeType,
    SortType,
} from "./types/steam";

type ViewMode = "personal" | "search";

interface AIHintRequest {
    gameName: string;
    achievementName: string;
    achievementDescription: string;
}

export default function Home() {
    const [screen, setScreen] = useState<ScreenType>("landing");
    const [mode, setMode] = useState<ModeType>("personal");
    const [viewMode, setViewMode] = useState<ViewMode>("personal");
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [sortBy, setSortBy] = useState<SortType>("rare");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // AI Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [pendingAIRequest, setPendingAIRequest] =
        useState<AIHintRequest | null>(null);

    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const {
        profile,
        games,
        isLoading: isLoadingProfile,
        error: profileError,
    } = useSteamProfile(session?.user?.steamId);

    const { searchQuery, setSearchQuery, searchResults, isSearching } =
        useGameSearch();
    const {
        achievements,
        loadingAchievements,
        error: achievementsError,
        revealedSpoilers,
        toggleSpoiler,
    } = useAchievements(selectedGame, mode, session?.user?.steamId);

    // Автоматичний перехід на dashboard після авторизації
    useEffect(() => {
        if (isAuthenticated && screen === "landing") {
            setScreen("dashboard");
        }
    }, [isAuthenticated, screen]);

    const handleGlobalSearchSelect = (game: SearchResult) => {
        setSelectedGame({ appid: game.id, name: game.name } as Game);
        setMode("global");
        setScreen("dashboard");
        setSearchQuery("");
    };

    const handlePersonalGameSelect = (game: Game) => {
        setSelectedGame(game);
        setMode("personal");
        setViewMode("personal");
        setScreen("dashboard");
    };

    const handleSteamLoginClick = () => {
        signIn("steam");
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
        setScreen("landing");
    };

    const handleGoToSearch = () => {
        setViewMode("search");
        setSelectedGame(null);
    };

    const handleGoToPersonal = () => {
        setViewMode("personal");
        setSelectedGame(null);
    };

    const handleRequestAIHint = (
        gameName: string,
        achievementName: string,
        achievementDescription: string,
    ) => {
        setPendingAIRequest({
            gameName,
            achievementName,
            achievementDescription,
        });
        setIsChatOpen(true);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Landing або режим пошуку для авторизованих
    const showSearchScreen =
        screen === "landing" ||
        (isAuthenticated && viewMode === "search" && !selectedGame);

    if (
        showSearchScreen &&
        !(isAuthenticated && viewMode === "search" && selectedGame)
    ) {
        return (
            <div className="h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden px-4">
                {profileError && <ErrorMessage message={profileError} />}

                {/* Кнопка зверху справа */}
                {isAuthenticated ? (
                    <button
                        onClick={handleGoToPersonal}
                        className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-all border border-slate-700 z-20 text-sm sm:text-base"
                    >
                        {profile?.avatarfull && (
                            <img
                                src={profile.avatarfull}
                                alt="Avatar"
                                className="w-6 h-6 rounded-full"
                            />
                        )}
                        <span className="font-medium">Мої</span>
                    </button>
                ) : (
                    <button
                        onClick={handleSteamLoginClick}
                        className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 bg-slate-800/80 hover:bg-[#171a21] text-white px-3 py-2 sm:px-4 rounded-lg transition-all border border-slate-700 hover:border-[#66c0f4] shadow-lg z-20 text-sm sm:text-base"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
                            alt="Steam Logo"
                            className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity invert"
                        />
                        <span className="font-medium">Увійти</span>
                    </button>
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 mb-6 sm:mb-8 md:mb-10 z-10 drop-shadow-xl tracking-tight leading-tight pb-2 sm:pb-4 px-4">
                    TrophyHunter
                </h1>

                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    isSearching={isSearching}
                    onSelectGame={handleGlobalSearchSelect}
                />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {achievementsError && <ErrorMessage message={achievementsError} />}

            {/* Mobile backdrop for sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Показуємо sidebar тільки в режимі personal */}
            {isAuthenticated && viewMode === "personal" && (
                <GameSidebar
                    games={games}
                    profile={profile}
                    selectedGame={selectedGame}
                    mode={mode}
                    isSidebarOpen={isSidebarOpen}
                    onSelectGame={(game) => {
                        handlePersonalGameSelect(game);
                        setIsSidebarOpen(false);
                    }}
                    onBackToLanding={handleGoToSearch}
                    onLogout={handleLogout}
                />
            )}

            {/* Для неавторизованих або режиму пошуку для авторизованих */}
            <main
                className={`flex-1 flex flex-col h-screen overflow-y-auto relative custom-scrollbar ${!isAuthenticated || viewMode === "search" ? "w-full" : ""}`}
            >
                {/* Burger button для мобільних (тільки в personal режимі) */}
                {isAuthenticated && viewMode === "personal" && (
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 border border-slate-700 p-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                )}

                {/* Верхня панель для неавторизованих */}
                {!isAuthenticated && (
                    <div className="relative flex items-center justify-between p-4 px-6">
                        {/* Кнопка "Назад" зліва */}
                        <button
                            onClick={() => setScreen("landing")}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                        >
                            <span className="text-xl">←</span>
                            <span className="font-medium">Назад</span>
                        </button>

                        {/* Логотип по центру */}
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            TrophyHunter
                        </h1>

                        {/* Кнопка "Увійти" справа */}
                        <button
                            onClick={handleSteamLoginClick}
                            className="flex items-center gap-2 bg-slate-800/80 hover:bg-[#171a21] text-white px-4 py-2 rounded-lg transition-all border border-slate-700 hover:border-[#66c0f4] backdrop-blur-md"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
                                alt="Steam"
                                className="w-5 h-5 opacity-70 group-hover:opacity-100 invert"
                            />
                            <span className="font-medium">Увійти</span>
                        </button>
                    </div>
                )}

                {/* Показуємо ачівки якщо вибрана гра */}
                {selectedGame && (
                    <>
                        {/* Верхня панель для авторизованих в режимі пошуку з обраною грою */}
                        {isAuthenticated && viewMode === "search" && (
                            <div className="relative flex items-center justify-between p-4 px-6 border-b border-slate-700">
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    <span className="text-xl">←</span>
                                    <span className="font-medium">Пошук</span>
                                </button>

                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                    TrophyHunter
                                </h1>

                                <button
                                    onClick={handleGoToPersonal}
                                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all border border-slate-700"
                                >
                                    {profile?.avatarfull && (
                                        <img
                                            src={profile.avatarfull}
                                            alt="Avatar"
                                            className="w-6 h-6 rounded-full"
                                        />
                                    )}
                                    <span className="font-medium">Мої</span>
                                </button>
                            </div>
                        )}

                        <AchievementGrid
                            selectedGame={selectedGame}
                            mode={mode}
                            achievements={achievements}
                            loadingAchievements={loadingAchievements}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            revealedSpoilers={revealedSpoilers}
                            onToggleSpoiler={toggleSpoiler}
                            onRequestAIHint={handleRequestAIHint}
                        />
                    </>
                )}

                {/* Floating AI Chat Button */}
                {!isChatOpen && screen === "dashboard" && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
                        title="Відкрити AI помічник"
                    >
                        <span className="text-xl sm:text-2xl">✨</span>
                    </button>
                )}
            </main>

            {/* Mobile backdrop for AI Chat */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* AI Chat Sidebar */}
            <AIChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                pendingRequest={pendingAIRequest}
                onRequestHandled={() => setPendingAIRequest(null)}
            />
        </div>
    );
}
