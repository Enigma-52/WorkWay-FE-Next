import "next-auth";

declare module "next-auth" {
  interface User {
    dbId?: string;
    roles?: string[];
    displayName?: string;
  }
  interface Session {
    user: {
      dbId: string;
      roles: string[];
      displayName: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    dbId?: string;
    roles?: string[];
    displayName?: string;
  }
}
