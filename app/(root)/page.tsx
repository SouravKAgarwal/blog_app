import { BlogCardSkeleton, UserCards } from "@/components/Cards";
import SearchForm from "@/components/SearchForm";
import { client } from "@/sanity/lib/client";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import { Blog, Author } from "@/sanity/types";
import { Suspense } from "react";
import { generateBlurDataURL } from "@/lib/utils/image";

export type BlogCardType = Omit<Blog, "author"> & { author: Author } & {
  blurDataURL?: string;
};

async function fetchPosts(query?: string) {
  "use cache";
  const params = { search: query || null };
  const posts = await client.fetch(BLOG_QUERY, params);

  const postsWithBlur = await Promise.all(
    posts.map(async (post: BlogCardType) => {
      const blurDataURL = await generateBlurDataURL(post.image);
      return { ...post, blurDataURL };
    })
  );

  return postsWithBlur;
}

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

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Write Your Blogs, <br /> Share with global readers
        </h1>
        <p className="sub-heading max-w-3xl!">
          Submit Blogs and share your experiences.
        </p>
        <Suspense fallback={<SearchForm />}>
          <SearchFormWrapper searchParams={searchParams} />
        </Suspense>
      </section>

      <section className="section_container">
        <Suspense
          fallback={
            <ul className="mt-7 card_grid-sm">
              <BlogCardSkeleton />
            </ul>
          }
        >
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function SearchFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  return <SearchForm query={query} />;
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const posts = await fetchPosts(query);

  return (
    <>
      <p className="text-30-semibold">
        {query ? `Search results for "${query}"` : "All Blogs"}
      </p>
      <ul className="mt-7 card_grid-sm">
        {posts?.length ? (
          posts.map((post: BlogCardType) => (
            <li key={post._id} className="list-none">
              <UserCards post={post} />
            </li>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </ul>
    </>
  );
}
