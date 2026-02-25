import type { Account } from "~/types";

export const ACCOUNT_KEY_PREFIX = "account";

export function genAccountKey(id: string) {
  return `${ACCOUNT_KEY_PREFIX}-${id}`;
}

export async function readAccount(kv: KVNamespace, key: string) {
  const accountRaw = await kv.get(key);
  if (accountRaw === null) return null;
  return JSON.parse(accountRaw) as Account;
}

export async function ensureAccount(
  kv: KVNamespace,
  user: { email: string; name: string; picture: string },
): Promise<Account> {
  const key = genAccountKey(user.email);
  const existing = await kv.get(key);
  if (existing !== null) {
    return JSON.parse(existing) as Account;
  }
  const account: Account = {
    displayName: user.name,
    email: user.email,
    id: user.email,
    photoURL: user.picture,
  };
  await kv.put(key, JSON.stringify(account));
  return account;
}
