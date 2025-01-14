import { auth } from "@/auth";
import BlogForm from "@/components/BlogForm";
import { redirect } from "next/navigation";

const CreatePage = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit your blog</h1>
      </section>

      <BlogForm />
    </>
  );
};

export default CreatePage;
