import { auth } from "@/auth";
import EditBlogForm from "@/components/EditBlogForm";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Edit",
  description: "Write, Share and Grow",
};

async function fetchPost(id: string) {
  "use cache";
  return client.fetch(BLOG_BY_ID_QUERY, { id });
}

const EditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <>
      <section className="pink_container min-h-[230px]!">
        <h1 className="heading">Edit your blog</h1>
      </section>

      <Suspense
        fallback={<p className="text-center mt-10">Loading editor...</p>}
      >
        <ProtectedEditForm params={params} />
      </Suspense>
    </>
  );
};

async function ProtectedEditForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();

  if (!session) redirect("/");

  const post = await fetchPost(id);
  if (!post) notFound();

  if (post?.author?.id !== session?.user?.id) {
    redirect(`/blog/${id}`);
  }

  return <EditBlogForm post={post} />;
}

export default EditPage;
