import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/lib/client";

// export const { sanityFetch, SanityLive } = defineLive({ client });

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "v2025-01-11",
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});
