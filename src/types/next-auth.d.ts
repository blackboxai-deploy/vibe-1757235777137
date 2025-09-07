import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isProfileComplete: boolean;
      isQuestionnairComplete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isProfileComplete: boolean;
    isQuestionnairComplete: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isProfileComplete: boolean;
    isQuestionnairComplete: boolean;
  }
}