import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        token: { type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token as string | undefined;
        if (!token) return null;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`
          );
          if (!res.ok) return null;
          const data = await res.json();
          if (!data.success || !data.user) return null;
          const u = data.user;
          return {
            id: String(u.id),
            email: u.email,
            name: u.display_name ?? u.email.split("@")[0],
            image: u.avatar_url ?? null,
            dbId: String(u.id),
            roles: u.roles ?? [],
            displayName: u.display_name ?? "",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // On session update (e.g. after onboarding saves role)
      if (trigger === "update" && session) {
        if (session.roles) token.roles = session.roles;
        if (session.displayName) token.displayName = session.displayName;
        return token;
      }

      // On Google sign-in — sync user to backend and store role in token
      if (account?.provider === "google" && user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              display_name: user.name,
              first_name: (profile as any)?.given_name ?? null,
              last_name: (profile as any)?.family_name ?? null,
              avatar_url: user.image ?? null,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              token.dbId = data.user.id;
              token.roles = data.user.roles ?? [];
              token.displayName = data.user.display_name ?? user.name ?? "";
            }
          }
        } catch {
          // backend unreachable — allow sign-in, roles will be empty
        }
        if (!token.roles) token.roles = [];
        if (!token.displayName) token.displayName = user.name ?? "";
      }

      // On magic-link sign-in — Credentials authorize() already populated these fields
      if (account?.provider === "magic-link" && user) {
        token.dbId = (user as any).dbId ?? "";
        token.roles = (user as any).roles ?? [];
        token.displayName = (user as any).displayName ?? user.name ?? "";
      }

      return token;
    },
    async session({ session, token }) {
      session.user.dbId = (token.dbId as string) ?? "";
      session.user.roles = (token.roles as string[]) ?? [];
      session.user.displayName = (token.displayName as string) ?? session.user.name ?? "";
      return session;
    },
  },
});
