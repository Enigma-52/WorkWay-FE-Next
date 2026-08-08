import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      dbId: string;
      roles: string[];
      displayName: string;
      planKey: string;
      isNewUser: boolean;
      authProvider: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    dbId?: string;
    roles?: string[];
    displayName?: string;
    planKey?: string;
    isNewUser?: boolean;
    authProvider?: string;
  }
}
