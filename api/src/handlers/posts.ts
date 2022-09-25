import { v4 as uuidv4 } from "uuid";
import { createPosts, deletePosts, readPosts } from "@/db";
import { Post, WigglesContext } from "@/types";
// import { jsonResponse } from "../../utils/jsonResponse";
import { parseFormDataRequest } from "@/utils";
import { Identity } from "@/middleware/auth";
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

  const myPosts: boolean = c.req.query("myPosts") === "true";

  return c.json(await readPosts(c, { size, cursor, limit, myPosts }));
}

type ImageUploadResponse = {
  result: {
    id: string;
  };
};
export async function PostUpload(c: WigglesContext) {
  try {
    // Compatibility dates aren't yet possible to set: https://developers.cloudflare.com/workers/platform/compatibility-dates#formdata-parsing-supports-file
    const formDataList = await parseFormDataRequest(c.req);
    const promises = formDataList?.map(async (formData) => {
      formData.set("requireSignedURLs", "true");

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

      if (response.status > 300)
        throw new Error(
          `Failed to upload image: ${res.status} ${await res.text()}`
        );
      const {
        result: { id },
      } = await response.json<ImageUploadResponse>();

      return id;
    });

    if (promises === undefined) return c.json({ message: "No content" }, 204);

    const idList = await Promise.all(promises);
    const timestamp = +new Date();

    const access = await c.get("cloudflareAccess");
    const identity: Identity | undefined = await access.JWT.getIdentity();
    if (identity === undefined) throw new Error("Identity not found");

    const postList: Post[] = idList.map((id, idx) => ({
      id: uuidv4(),
      contentType: "image/*",
      cfImageId: id,
      timestamp: (timestamp + idx).toString(),
      accountId: identity.email,
    }));

    const res = await createPosts(c, postList);

    if (res.status > 300)
      throw new Error(
        `Failed to upload post: ${res.status} ${await res.text()}`
      );
    return c.json({ message: "success" });
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return c.json(
      {
        error:
          "Could not upload image. Have you completed setup? Is it less than 10 MB? Is it a supported file type (PNG, JPEG, GIF, WebP)?",
      },
      500
    );
  }
}

export async function DeletePosts(c: WigglesContext) {
  const orderKeys: string[] = await c.req.json();
  try {
    await deletePosts(c, orderKeys);
    return c.json({ message: "OK" });
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return c.json(
      {
        error: "Could not delete images...",
      },
      500
    );
  }
}
