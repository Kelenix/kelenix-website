import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";

export type MessageStatus = "NEW" | "READ" | "IN_PROGRESS" | "TREATED" | "ARCHIVED";

export type ApiSuccess<T = void> = T extends void
  ? { success: true }
  : { success: true; data: T };

export type ApiError = {
  error: string;
  details?: unknown;
};
