"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, clearSession, getSession } from "./auth";
import { str } from "./utils";

export async function signInAction(formData: FormData): Promise<void> {
  const email = str(formData.get("email"));
  const password = str(formData.get("password"));

  const result = await authenticate(email, password);
  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.error)}&email=${encodeURIComponent(email)}`);
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function currentUserAction() {
  return getSession();
}
