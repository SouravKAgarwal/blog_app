import { BlogCardType } from "@/app/(root)/page";
import { generateBlurDataURL } from "@/lib/utils/image";
import { client } from "@/sanity/lib/client";
import { BLOGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { UserCards } from "./Cards";

const UserBlogs = async ({ id }: { id: string }) => {
  const blogs = await client.fetch(BLOGS_BY_AUTHOR_QUERY, { id });

  const blogsWithBlur = await Promise.all(
    blogs.map(async (blog: BlogCardType) => {
      const blurDataURL = await generateBlurDataURL(blog.image);
      return { ...blog, blurDataURL };
    })
  );

  return (
    <>
      {blogsWithBlur.length > 0 ? (
        blogsWithBlur.map((blog: BlogCardType) => (
          <li key={blog?._id} className="list-none">
            <UserCards isProfile post={blog} />
          </li>
        ))
      ) : (
        <p className="no-result">No posts yet.</p>
      )}
    </>
  );
};

export default UserBlogs;
