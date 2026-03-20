import { useState, useEffect } from "react";
import { SearchResult } from "../types/steam";
import { SEARCH_DEBOUNCE_MS, MIN_SEARCH_LENGTH } from "../config/constants";

interface UseGameSearchReturn {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    isSearching: boolean;
}

export function useGameSearch(): UseGameSearchReturn {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length > MIN_SEARCH_LENGTH) {
                setIsSearching(true);
                fetch(`/api/steam/search?q=${searchQuery}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setSearchResults(Array.isArray(data) ? data : []);
                        setIsSearching(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setSearchResults([]);
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return { searchQuery, setSearchQuery, searchResults, isSearching };
}
