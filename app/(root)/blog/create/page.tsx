import { auth } from "@/auth";
import { Suspense } from "react";
import BlogForm from "@/components/BlogForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create",
  description: "Write, Share and Grow",
};

const CreatePage = () => {
  return (
    <>
      <section className="pink_container min-h-[230px]!">
        <h1 className="heading">Submit your blog</h1>
      </section>

      <Suspense fallback={<p className="text-center mt-10">Loading form...</p>}>
        <ProtectedBlogForm />
      </Suspense>
    </>
  );
};

async function ProtectedBlogForm() {
  const session = await auth();
  if (!session) redirect("/");
  return <BlogForm />;
}

export default CreatePage;
