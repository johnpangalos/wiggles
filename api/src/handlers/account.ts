import { getEmailFromPayload, getNameFromPayload, getPictureFromPayload } from "@/middleware/auth";
import { Account, WigglesContext } from "@/types";

export async function GetMe(c: WigglesContext) {
  const { payload } = c.get("JWT");
  const email = getEmailFromPayload(payload);

  const meStr = await c.env.WIGGLES.get(`account-${email}`);
  if (meStr === null) {
    const account: Account = {
      displayName: getNameFromPayload(payload),
      email,
      id: email,
      photoURL: getPictureFromPayload(payload),
    };
    await c.env.WIGGLES.put(`account-${email}`, JSON.stringify(account));
    return c.json(account);
  }
  const me = JSON.parse(meStr) as Account;

  return c.json(me);
}
