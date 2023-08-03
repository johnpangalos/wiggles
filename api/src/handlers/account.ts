import { Identity } from "@/middleware/auth";
import { Account, WigglesContext } from "@/types";

export async function GetMe(c: WigglesContext) {
  const access = c.get("JWT");
  const identity: Identity | undefined = await access.getIdentity();
  if (identity === undefined) throw new Error("Identity not found");

  const meStr = await c.env.WIGGLES.get(`account-${identity.email}`);
  if (meStr === null) return c.json({ message: "Account invalid" }, 422);
  const me = JSON.parse(meStr) as Account;

  return c.json(me);
}
