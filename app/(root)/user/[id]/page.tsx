import { auth } from "@/auth";
import { BlogCardSkeleton } from "@/components/Cards";
import UserBlogs from "@/components/UserBlogs";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY, AUTHORS } from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { BlogCardType } from "../../page";

export const experimental_ppr = true;

const fetchUser = cache(async (id: string) => {
  return client.fetch(AUTHOR_BY_ID_QUERY, { id });
});

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
      url: `https://blogapp-09.vercel.app/user/${id}`,
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

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const user = await fetchUser(id);

  if (!user) notFound();

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>
        <Image
          src={user.image || "https://blogapp-09.vercel.app/logo.png"}
          alt={user.name}
          width={220}
          height={220}
          className="profile_image"
        />
        <p className="text-30-extrabold mt-7 text-center">@{user.username}</p>
        <p className="mt-1 text-center text-14-normal">{user.bio}</p>
      </div>

      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {session?.user?.id === id ? "Your" : `${user.name}'s`} Blogs
        </p>
        <ul className="card_grid">
          <Suspense fallback={<BlogCardSkeleton />}>
            <UserBlogs id={id} />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default UserPage;
