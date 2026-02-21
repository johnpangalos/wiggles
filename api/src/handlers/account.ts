import { Account, WigglesContext } from "@/types";

export async function GetMe(c: WigglesContext) {
  const { payload } = c.get("JWT");
  const email = payload.email;

  const meStr = await c.env.WIGGLES.get(`account-${email}`);
  if (meStr === null) return c.json({ message: "Account invalid" }, 422);
  const me = JSON.parse(meStr) as Account;

  return c.json(me);
}
