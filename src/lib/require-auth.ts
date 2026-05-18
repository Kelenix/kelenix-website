import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";

const ROLE_LEVEL: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  MODERATOR: 1,
};

export async function requireAuth(minRole: Role = "MODERATOR") {
  const session = await auth();

  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role?: Role }).role;

  if (!role || ROLE_LEVEL[role] < ROLE_LEVEL[minRole]) {
    redirect("/admin?unauthorized=1");
  }

  return session as typeof session & { user: { role: Role; id: string } };
}
