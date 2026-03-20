import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            steamId?: string;
            steam?: SteamProfile;
        };
    }

    interface Profile {
        steamid?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        steamId?: string;
        steam?: SteamProfile;
    }
}

interface SteamProfile {
    steamid?: string;
    personaname?: string;
    avatarfull?: string;
    profileurl?: string;
}
