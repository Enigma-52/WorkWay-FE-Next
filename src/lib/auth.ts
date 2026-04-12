import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return false;
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
        const data = await res.json();
        if (data.user) {
          (user as any).dbId = data.user.id;
          (user as any).roles = data.user.roles ?? [];
          (user as any).displayName = data.user.display_name;
        }
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.dbId = (user as any).dbId;
        token.roles = (user as any).roles ?? [];
        token.displayName = (user as any).displayName ?? user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.dbId = token.dbId as string;
      session.user.roles = token.roles as string[];
      session.user.displayName = token.displayName as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
