import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY, BLOGS } from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { BlogCardType } from "../../page";
import Image from "next/image";
import ViewMarkdownWrapper from "@/components/ViewMarkdownWrapper";
import ViewMarkdownSkeleton from "@/components/ViewMarkdownSkeleton";
import { generateBlurDataURL } from "@/lib/utils/image";

async function fetchPostById(id: string) {
  "use cache";
  return client.fetch(BLOG_BY_ID_QUERY, { id });
}

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
  const blurDataURL = await generateBlurDataURL(post?.image);

  if (!post) notFound();

  return (
    <article className="pb-20">
      <section className="bg-background relative pt-20 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
            <span className="bg-secondary px-3 py-1 rounded-full text-secondary-foreground uppercase tracking-wider text-xs">
              {post.category}
            </span>
            <span>{formatDate(post._createdAt)}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl leading-tight font-bold text-foreground">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-serif italic leading-relaxed">
            {post.description}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex items-center gap-3 group"
            >
              <div className="size-12 overflow-hidden rounded-full border border-border group-hover:ring-2 group-hover:ring-ring transition-all relative bg-secondary flex items-center justify-center">
                {post.author?.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-secondary-foreground font-bold text-lg">
                    {post.author?.name?.slice(0, 2).toUpperCase() || "CN"}
                  </span>
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {post.author?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg border border-border/50">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline focus:prose-a:outline-none">
          {post.pitch ? (
            <Suspense fallback={<ViewMarkdownSkeleton />}>
              <ViewMarkdownWrapper content={post.pitch} />
            </Suspense>
          ) : (
            <div className="text-center py-20 bg-secondary/30 rounded-xl">
              <p className="text-muted-foreground font-serif italic">
                No details provided for this story.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              datePublished: post._createdAt,
              dateModified: post._createdAt,
              description: post.description,
              image: post.image,
              author: {
                "@type": "Person",
                name: post.author?.name,
                url: `${process.env.NEXT_PUBLIC_URL}/user/${post.author?._id}`,
              },
            }),
          }}
        />
      </section>
    </article>
  );
};

export default DetailsPage;
