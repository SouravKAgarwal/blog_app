import { auth } from "@/auth";
import { BlogCardSkeleton } from "@/components/Cards";
import UserTitleSkeleton from "@/components/UserTitleSkeleton";
import UserBlogs from "@/components/UserBlogs";
import { client } from "@/sanity/lib/client";
import { AUTHORS } from "@/sanity/lib/queries";
import { generateBlurDataURL } from "@/lib/utils/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlogCardType } from "../../page";
import { fetchUser } from "@/sanity/lib/fetch";

async function BlogTitle({ id, user }: { id: string; user: { name: string } }) {
  const session = await auth();
  return (
    <h2 className="font-serif text-2xl font-bold text-foreground">
      {session?.user?.id === id ? "Your" : `${user.name.split(" ")[0]}'s`}{" "}
      Stories
    </h2>
  );
}

export async function generateStaticParams() {
  const posts = await client.fetch(AUTHORS);
  return posts.map(({ _id }: BlogCardType) => ({ id: _id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const user = await fetchUser(id);

  const title = user.name;
  const description =
    user.bio ||
    `Explore blogs by ${user.name} on Blogify. Share your thoughts with the world!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${process.env.NEXT_PUBLIC_URL}/user/${id}`,
      images: [
        {
          url: user.image,
          width: 1200,
          height: 630,
          alt: user.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [user.image],
    },
  };
}

const UserPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const id = (await params).id;

  const user = await fetchUser(id);
  const blurDataURL = await generateBlurDataURL(user?.image);

  if (!user) notFound();

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-6">
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center space-y-4 shadow-sm max-w-3xl mx-auto mb-16 relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src={user.image}
            alt={user.name}
            width={140}
            height={140}
            className="relative rounded-full border-4 border-background shadow-xl"
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
            loading="eager"
            preload
            fetchPriority="high"
          />
        </div>

        <div className="space-y-2 z-10">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {user.name}
          </h1>
          <p className="text-primary font-medium tracking-wide">
            @{user.username}
          </p>
        </div>

        <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
          {user.bio}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Suspense fallback={<UserTitleSkeleton />}>
            <BlogTitle id={id} user={user} />
          </Suspense>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<BlogCardSkeleton />}>
            <UserBlogs id={id} searchParams={searchParams} />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default UserPage;
