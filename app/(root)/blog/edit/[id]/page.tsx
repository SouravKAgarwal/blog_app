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
      <section className="w-full py-12 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Refining your story
        </h1>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Make your work shine. Update your content and keep it fresh.
        </p>
      </section>

      <Suspense
        fallback={
          <p className="text-center mt-10 text-muted-foreground">
            Loading editor...
          </p>
        }
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
