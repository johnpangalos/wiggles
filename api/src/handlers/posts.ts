import { readPosts } from "@/db";
import { WigglesContext } from "@/types";
// import { jsonResponse } from "../../utils/jsonResponse";
import { parseFormDataRequest } from "@/utils";
// import { IMAGE_KEY_PREFIX } from "../../utils/constants";

export async function GetPosts(c: WigglesContext) {
  let size: string | null = c.req.query("size");
  if (size === null) size = "WRPost";
  if ("WRPost" !== size && "WRThumbnail" !== size)
    throw new Error("Invalid query param.");

  const cursor: string | null = c.req.query("cursor");

  let limitStr: string | null = c.req.query("limit");
  if (limitStr === null) limitStr = "10";
  const limit = Number.parseInt(limitStr);

  return c.json(await readPosts(c, { size, cursor, limit }));
}

export async function PostPosts(c: WigglesContext) {
  try {
    // const { apiToken, accountId } = (await c.env.WIGGLES.get(
    //   "setup",
    //   "json"
    // )) as Setup;

    // Compatibility dates aren't yet possible to set: https://developers.cloudflare.com/workers/platform/compatibility-dates#formdata-parsing-supports-file
    const formData = (await parseFormDataRequest(c.req)) as FormData;
    formData.set("requireSignedURLs", "true");
    const alt = formData.get("alt") as string;
    formData.delete("alt");
    const isPrivate = formData.get("isPrivate") === "on";
    formData.delete("isPrivate");

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        body: formData,
        headers: {
          "X-Auth-Email": "john@pangalos.dev",
          "X-Auth-Key": c.env.API_KEY,
        },
      }
    );

    const {
      result: {
        id,
        filename: name,
        uploaded,
        variants: [url],
      },
    } = await response.json<{
      result: {
        id: string;
        filename: string;
        uploaded: string;
        requireSignedURLs: boolean;
        variants: string[];
      };
    }>();

    //   const downloadCounterId = env.DOWNLOAD_COUNTER.newUniqueId().toString();
    //
    //   const metadata: ImageMetadata = {
    //     id,
    //     previewURLBase: url.split("/").slice(0, -1).join("/"),
    //     name,
    //     alt,
    //     uploaded,
    //     isPrivate,
    //     downloadCounterId,
    //   };
    //
    //   await env.IMAGES.put(
    //     `${IMAGE_KEY_PREFIX}uploaded:${uploaded}`,
    //     "Values stored in metadata.",
    //     { metadata }
    //   );
    //   await env.IMAGES.put(`${IMAGE_KEY_PREFIX}${id}`, JSON.stringify(metadata));
    //
    return c.json(true);
  } catch {
    return c.json(
      {
        error:
          "Could not upload image. Have you completed setup? Is it less than 10 MB? Is it a supported file type (PNG, JPEG, GIF, WebP)?",
      },
      500
    );
  }
}
