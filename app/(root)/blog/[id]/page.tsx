import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY, BLOGS } from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import ViewMarkdown from "@/components/ViewMarkdown";
import { BlogCardType } from "../../page";
import Image from "next/image";

export const experimental_ppr = true;

const fetchPostById = cache(async (id: string) => {
  return client.fetch(BLOG_BY_ID_QUERY, { id });
});

export async function generateStaticParams() {
  const posts = await client.fetch(BLOGS);
  return posts.map(({ _id }: BlogCardType) => ({
    id: _id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const post = await fetchPostById(id);

  return {
    title: post.title,
    description: post.description,
    keywords: post.category,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://blogapp-09.vercel.app/blog/${id}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

const DetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const post = await fetchPostById(id);

  if (!post) notFound();

  return (
    <>
      <section className="pink_container min-h-57.5!">
        <p className="subtitle">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading max-w-5xl!">{post.description}</p>
      </section>

      <section className="section_container">
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={500}
          className="w-full md:w-3/4 lg:w-2/3 rounded-2xl h-auto mx-auto object-cover border-4 border-white"
          priority
        />
        <div className="space-y-5 mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 max-w-3xl mx-auto mb-10">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-3 items-center group"
            >
              <Image
                src={post.author?.image}
                height={64}
                width={64}
                className="rounded-full drop-shadow-md group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-primary/50"
                alt="avatar"
              />
              <div>
                <p className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {post.author?.name}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          {post.pitch ? (
            <ViewMarkdown content={post.pitch} />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default DetailsPage;
