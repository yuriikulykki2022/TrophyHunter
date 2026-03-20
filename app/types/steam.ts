export interface SteamProfile {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personastate: number;
    communityvisibilitystate: number;
    profilestate?: number;
    lastlogoff?: number;
    commentpermission?: number;
}

export interface Game {
    appid: string;
    name: string;
    playtime_forever?: number;
    playtime_2weeks?: number;
    img_icon_url?: string;
    img_logo_url?: string;
    has_community_visible_stats?: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    hidden: boolean;
    percent: number;
}

export interface SearchResult {
    id: string;
    name: string;
    tiny_image: string;
}

export type ScreenType = "landing" | "dashboard";
export type ModeType = "personal" | "global";
export type SortType = "rare" | "common" | "locked" | "unlocked" | "default";

export interface AchievementsCache {
    [key: string]: Achievement[];
}
