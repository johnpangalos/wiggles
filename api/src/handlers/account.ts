import {
  getEmailFromPayload,
  getNameFromPayload,
  getPictureFromPayload,
} from "@/middleware/auth";
import { Account, WigglesContext } from "@/types";

export async function GetMe(c: WigglesContext) {
  try {
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
  } catch (e) {
    console.error({
      level: "error",
      handler: "GetMe",
      message: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined,
    });
    return c.json({ error: "Could not fetch account." }, 500);
  }
}
