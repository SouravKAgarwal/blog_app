import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  BLOG_BY_ID_QUERY,
  POPULAR_BLOG_BY_VIEW_QUERY,
  BLOGS,
} from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { BlogCardType } from "../../page";
import Image from "next/image";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { unified } from "unified";
import Related from "@/components/Related";
import { MostPopular } from "@/components/Cards";
import { BsFacebook, BsTwitterX, BsWhatsapp } from "react-icons/bs";

export const experimental_ppr = true;

const fetchPostById = cache(async (id: string) => {
  return client.fetch(BLOG_BY_ID_QUERY, { id });
});

const fetchPopularBlogs = cache(async () => {
  return client.fetch(POPULAR_BLOG_BY_VIEW_QUERY);
});

const fetchEditorPicks = cache(async () => {
  return client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" });
});

const parseContent = async (content: string) => {
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
          feedbackDuration: 3000,
        }),
      ],
    });

  return content ? (await processor.process(content)).toString() : "";
};

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

  const [post, popularBlogs, { select: editorPicks }] = await Promise.all([
    fetchPostById(id),
    fetchPopularBlogs(),
    fetchEditorPicks(),
  ]);

  if (!post) notFound();

  const parsedContent = await parseContent(post.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="subtitle">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt={post.title}
          className="w-full md:w-2/3 rounded-xl h-auto mx-auto"
        />
        <div className="space-y-5 mt-10 max-w-3xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image}
                height={64}
                width={64}
                className="rounded-full drop-shadow-lg"
                alt="avatar"
              />
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          {parsedContent ? (
            <article
              className="prose prose-a:text-blue-600 max-w-4xl prose-pre:max-h-[300px] font-work-sans"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="my-10 w-full" />

        <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
          {popularBlogs?.length > 0 && (
            <div className="w-full">
              <p className="text-26-semibold mb-5">Popular blogs</p>
              <Related editorPosts={popularBlogs} />
            </div>
          )}
        </div>

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>

      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 bg-white p-4 shadow-lg rounded-l-lg">
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=https://blogapp-09.vercel.app/blog/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link facebook"
        >
          <BsFacebook />
        </Link>
        <Link
          href={`https://wa.me/?text=Check%20out%20this%20blog!%20https://blogapp-09.vercel.app/blog/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link whatsapp"
        >
          <BsWhatsapp />
        </Link>
        <Link
          href={`https://twitter.com/intent/tweet?url=https://blogapp-09.vercel.app/blog/${id}&text=Check%20out%20this%20blog!\n`}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link twitter"
        >
          <BsTwitterX />
        </Link>
      </div>
    </>
  );
};

export default DetailsPage;
