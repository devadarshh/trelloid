import { createApi } from "unsplash-js";
import fetch from "node-fetch";

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
  fetch: fetch as any,
});
