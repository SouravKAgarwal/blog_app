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
      <section className="w-full py-12 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Start a new story
        </h1>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Share your ideas with the world. Create a compelling story that
          resonates.
        </p>
      </section>

      <Suspense
        fallback={
          <p className="text-center mt-10 text-muted-foreground">
            Loading form...
          </p>
        }
      >
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
