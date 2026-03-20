import NextAuth from "next-auth";
import SteamProvider from "steam-next-auth";
import type { NextRequest } from "next/server";

export const { handlers, auth, signIn, signOut } = NextAuth(
    (req: NextRequest | undefined) => ({
        providers: req
            ? [
                  SteamProvider(req, {
                      clientSecret: process.env.STEAM_API_KEY!,
                      callbackUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/steam/callback`,
                  }),
              ]
            : [],

        callbacks: {
            jwt({ token, profile }) {
                if (profile) {
                    // Steam profile contains steamid, personaname, avatarfull
                    if ("steamid" in profile) {
                        token.steamId = profile.steamid as string;
                    }
                    if ("personaname" in profile) {
                        token.name = profile.personaname as string;
                    }
                    if ("avatarfull" in profile) {
                        token.picture = profile.avatarfull as string;
                    }
                }
                return token;
            },

            session({ session, token }) {
                if (token.steamId && session.user) {
                    session.user.steamId = token.steamId as string;
                }
                return session;
            },
        },

        pages: {
            signIn: "/",
        },

        trustHost: process.env.NODE_ENV === "production",
    }),
);
