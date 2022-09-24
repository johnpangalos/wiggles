import { WigglesContext } from "@/types";

export const ACCOUNT_KEY_PREFIX = "account";

export function genAccountKey(id: string) {
  return `${ACCOUNT_KEY_PREFIX}-${id}`;
}

export async function readAccount(c: WigglesContext, key: string) {
  const accountRaw = await c.env.WIGGLES.get(key);
  if (accountRaw === null) return null;
  return JSON.parse(accountRaw);
}
