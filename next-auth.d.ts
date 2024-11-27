import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface SessionUser {
    userId: string;
    meta: Partial<UserMetaData>;
  }

  interface Session {
    user: SessionUser & DefaultSession["user"];
  }
}
