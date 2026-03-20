import { SearchResult } from "../types/steam";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    isSearching: boolean;
    onSelectGame: (game: SearchResult) => void;
}

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    onSelectGame,
}: SearchBarProps) {
    return (
        <div className="relative w-full max-w-2xl z-20 px-4">
            <div className="relative">
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-slate-400">
                    🔍
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введіть назву гри (наприклад, Portal) ..."
                    className="w-full bg-slate-800/80 backdrop-blur-xl text-white text-base sm:text-xl pl-12 sm:pl-16 pr-6 py-4 sm:py-5 rounded-2xl border border-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:outline-none shadow-2xl transition-all"
                />
                {isSearching && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>

            {searchResults.length > 0 && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto custom-scrollbar">
                    {searchResults.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => onSelectGame(game)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-700 transition-colors text-left border-b border-slate-700/50 last:border-0"
                        >
                            <img
                                src={game.tiny_image}
                                alt={game.name}
                                className="w-16 h-auto rounded shadow"
                            />
                            <span className="text-lg font-medium text-slate-200">
                                {game.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
