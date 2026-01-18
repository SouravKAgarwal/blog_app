import { BlogCardSkeleton, UserCards } from "@/components/Cards";
import SearchForm from "@/components/SearchForm";
import SearchFormSkeleton from "@/components/SearchFormSkeleton";
import { client } from "@/sanity/lib/client";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import { Blog, Author } from "@/sanity/types";
import { Suspense } from "react";
import { generateBlurDataURL } from "@/lib/utils/image";
import Pagination from "@/components/Pagination";

export type BlogCardType = Omit<Blog, "author"> & { author: Author } & {
  blurDataURL?: string;
};


async function fetchPosts(query?: string, page: number = 1) {
  "use cache";
  const PAGE_SIZE = 6;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE + 1; // Fetch one extra to check for next page

  const params = { search: query || null, start, end };
  const posts = await client.fetch(BLOG_QUERY, params);

  const postsWithBlur = await Promise.all(
    posts.map(async (post: BlogCardType) => {
      const blurDataURL = await generateBlurDataURL(post.image);
      return { ...post, blurDataURL };
    }),
  );

  return {
    posts: postsWithBlur.slice(0, PAGE_SIZE),
    hasMore: postsWithBlur.length > PAGE_SIZE,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page?: string }>;
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
  searchParams: Promise<{ query: string; page?: string }>;
}) {
  return (
    <>
      <section className="hero_container animate-fade-in">
        <div className="space-y-4 max-w-4xl text-center">
          <div className="inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground mb-4">
            The Blog Platform for Creators
          </div>
          <h1 className="heading">
            Read. Write. <br className="hidden sm:block" />
            <span className="text-muted-foreground">Master your craft.</span>
          </h1>
          <p className="sub-heading mx-auto">
            Share your stories, ideas, and expertise with a growing community of
            readers.
          </p>
        </div>

        <div className="w-full max-w-2xl mt-8">
          <Suspense fallback={<SearchFormSkeleton />}>
            <SearchFormWrapper searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <section className="section_container pt-0">
        <Suspense
          fallback={
            <ul className="mt-7 card_grid">
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
  searchParams: Promise<{ query: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { posts, hasMore } = await fetchPosts(query, currentPage);

  return (
    <>
      <h2 className="text-3xl font-semibold">
        {query ? `Search results for "${query}"` : "All Blogs"}
      </h2>
      <ul className="mt-7 card_grid-sm">
        {posts?.length ? (
          posts.map((post: BlogCardType, index: number) => (
            <li key={post._id} className="list-none">
              <UserCards post={post} index={index} />
            </li>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </ul>

      <Pagination page={currentPage} hasMore={hasMore} />
    </>
  );
}
