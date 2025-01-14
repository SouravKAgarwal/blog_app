import { BlogCard } from "@/components/Cards";
import SearchForm from "@/components/SearchForm";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import { Blog, Author } from "@/sanity/types";

export type BlogCardType = Omit<Blog, "author"> & { author: Author };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;

  return {
    title: query
      ? `Search-${query.charAt(0).toUpperCase() + query.slice(1).toLowerCase()} | Blogify`
      : "Home | Blogify",
    description: query
      ? `Discover blogs matching "${query}" on Blogify. Share your thoughts and experiences with our global audience.`
      : "Explore a variety of blogs on Blogify. Share your experiences and engage with a global audience.",
    openGraph: {
      title: query ? `Blogify | ${query}` : "Blogify",
      description: query
        ? `Discover blogs matching "${query}" on Blogify. Share your thoughts and experiences with our global audience.`
        : "Explore a variety of blogs on Blogify. Share your experiences and engage with a global audience.",
      type: "website",
      url: "https://blogapp-09.vercel.app",
      images: [
        {
          url: "https://blogapp-09.vercel.app/logo.png",
          width: 1200,
          height: 630,
          alt: "Blogify",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: query ? `Blogify | ${query}` : "Blogify",
      description: query
        ? `Discover blogs matching "${query}" on Blogify. Share your thoughts and experiences with our global audience.`
        : "Explore a variety of blogs on Blogify. Share your experiences and engage with a global audience.",
      images: ["https://blogapp-09.vercel.app/logo.png"],
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({ query: BLOG_QUERY, params });

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

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: BlogCardType) => (
              <BlogCard key={post?._id} post={post} />
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
