import { auth } from "@/auth";
import EditBlogForm from "@/components/EditBlogForm";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Create",
  description: "Write, Share and Grow",
};

const fetchPost = cache(async (id: string) => {
  return client.fetch(BLOG_BY_ID_QUERY, { id });
});

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  if (!session) redirect("/");

  const post = await fetchPost(id);
  if (!post) notFound();

  if (post?.author?.id !== session.user.id) {
    redirect(`/blog/${id}`);
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Edit your blog</h1>
      </section>

      <EditBlogForm post={post} />
    </>
  );
};

export default EditPage;
