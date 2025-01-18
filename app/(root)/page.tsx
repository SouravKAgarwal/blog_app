import { EditorPicksCard } from "@/components/Cards";
import SearchForm from "@/components/SearchForm";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import { Blog, Author } from "@/sanity/types";
import { cache } from "react";

export type BlogCardType = Omit<Blog, "author"> & { author: Author };

const fetchPosts = cache(async (query?: string) => {
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({ query: BLOG_QUERY, params });

  return posts;
});

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;

  return {
    title: query ? `Search results for "${query}"` : "Home",
    description: query
      ? `Discover blogs matching "${query}" on Blogify. Share your thoughts and experiences with our global audience.`
      : "Explore a variety of blogs on Blogify. Share your experiences and engage with a global audience.",
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const posts = await fetchPosts(query);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Write Your Blogs, <br /> Share with global readers
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Blogs and share your experiences.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Blogs"}
        </p>
        <ul className="mt-7 card_grid-sm">
          {posts?.length ? (
            posts.map((post: BlogCardType) => (
              <EditorPicksCard key={post._id} post={post} />
            ))
          ) : (
            <p>No blogs found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
