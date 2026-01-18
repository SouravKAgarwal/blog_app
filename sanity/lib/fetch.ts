import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { cacheTag } from "next/cache";

export async function fetchUser(id: string) {
  "use cache";
  cacheTag(`user-${id}`);
  return client.fetch(AUTHOR_BY_ID_QUERY, { id });
}
