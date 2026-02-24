import { Auth0JWTPayload } from "@/middleware/auth";
import {
  getEmailFromPayload,
  getNameFromPayload,
  getPictureFromPayload,
} from "@/middleware/auth";
import { Account, WigglesContext } from "@/types";

export const ACCOUNT_KEY_PREFIX = "account";

export function genAccountKey(id: string) {
  return `${ACCOUNT_KEY_PREFIX}-${id}`;
}

export async function readAccount(c: WigglesContext, key: string) {
  const accountRaw = await c.env.WIGGLES.get(key);
  if (accountRaw === null) return null;
  return JSON.parse(accountRaw);
}

export async function ensureAccount(
  c: WigglesContext,
  payload: Auth0JWTPayload,
): Promise<Account> {
  const email = getEmailFromPayload(payload);
  const key = genAccountKey(email);
  const existing = await c.env.WIGGLES.get(key);
  if (existing !== null) {
    return JSON.parse(existing) as Account;
  }
  const account: Account = {
    displayName: getNameFromPayload(payload),
    email,
    id: email,
    photoURL: getPictureFromPayload(payload),
  };
  await c.env.WIGGLES.put(key, JSON.stringify(account));
  return account;
}
