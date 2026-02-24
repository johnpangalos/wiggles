import { ensureAccount } from "@/db";
import { WigglesContext } from "@/types";

export async function GetMe(c: WigglesContext) {
  try {
    const { payload } = c.get("JWT");
    const account = await ensureAccount(c, payload);
    return c.json(account);
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
