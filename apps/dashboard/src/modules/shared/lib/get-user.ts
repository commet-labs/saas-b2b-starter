import { auth } from "@/modules/auth/lib/auth";
import type { User } from "@repo/database/schema";
import { headers } from "next/headers";

export const getUser = async (): Promise<User | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user as User;
};
