import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  BLOG_BY_ID_QUERY,
  POPULAR_BLOG_BY_VIEW_QUERY,
} from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { BlogCardType } from "../../page";
import { EditorPicksCard, MostPopular } from "@/components/Cards";
import Image from "next/image";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { unified } from "unified";

export const experimental_ppr = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await client.fetch(BLOG_BY_ID_QUERY, { id });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: post.title,
    description: post.description || "Read the latest blog post on Blogify.",
    keywords: post.category || "blog",
    openGraph: {
      title: post.title,
      description: post.description || "Read the latest blog post on Blogify.",
      url: `https://blogapp-09.vercel.app/blog/${id}`,
      images: [
        {
          url: post.image || "https://blogapp-09.vercel.app/logo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || "Read the latest blog post on Blogify.",
      images: [post.image || "https://blogapp-09.vercel.app/logo.png"],
    },
  };
}

const DetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [post, popular, { select: editorPosts }] = await Promise.all([
    client.fetch(BLOG_BY_ID_QUERY, { id }),
    client.fetch(POPULAR_BLOG_BY_VIEW_QUERY),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ]);

  if (!post) return notFound();

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument, { title: "👋🌍" })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
    });

  const parsedContent = (await processor.process(post?.pitch)).toString();

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="subtitle">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post?.image}
          alt={post?.title}
          className="w-full md:w-2/3 rounded-xl h-auto mx-auto"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post?.author?.image}
                height={64}
                width={64}
                className="rounded-full drop-shadow-lg"
                alt="avatar"
              />
              <div>
                <p className="text-20-medium">{post?.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post?.author?.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post?.category}</p>
          </div>

          {parsedContent ? (
            <article
              className="prose prose-a:text-blue-600 max-w-4xl font-work-sans"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="my-10 w-full" />

        <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
          {popular?.length > 0 && (
            <div className="w-full md:w-[25%]">
              <p className="text-26-semibold mb-5">Most Popular</p>
              <ul className="space-y-2">
                {popular.map((post: BlogCardType) => (
                  <MostPopular key={post?._id} post={post} />
                ))}
              </ul>
            </div>
          )}

          {editorPosts?.length > 0 && (
            <div className="w-full md:w-[75%]">
              <p className="text-26-semibold mb-5">Editor Picks</p>
              <ul className="card_grid">
                {editorPosts.map((post: BlogCardType) => (
                  <EditorPicksCard key={post?._id} post={post} />
                ))}
              </ul>
            </div>
          )}
        </div>

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default DetailsPage;
