import { client } from "@/sanity/lib/client";
import { AUTHORS, BLOGS } from "@/sanity/lib/queries";
import { MetadataRoute } from "next";
import { BlogCardType } from "./(root)/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch(BLOGS);
  const authors = await client.fetch(AUTHORS);

  const postEntries: MetadataRoute.Sitemap = posts.map(
    ({ _id, _updatedAt }: BlogCardType) => ({
      url: `${process.env.NEXT_PUBLIC_URL}/blog/${_id}`,
      lastModified: new Date(_updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const authorEntries: MetadataRoute.Sitemap = authors.map(
    ({ _id, _updatedAt }: BlogCardType) => ({
      url: `${process.env.NEXT_PUBLIC_URL}/user/${_id}`,
      lastModified: new Date(_updatedAt),
      changeFrequency: "hourly",
      priority: 0.7,
    })
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_URL}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/blog/create`,
      lastModified: new Date(),
      changeFrequency: "always",
    },
    ...postEntries,
    ...authorEntries,
  ];
}
