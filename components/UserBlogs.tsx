import { BlogCardType } from "@/app/(root)/page";
import { client } from "@/sanity/lib/client";
import { BLOGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { UserCards } from "./Cards";

const UserBlogs = async ({ id }: { id: string }) => {
  const blogs = await client.fetch(BLOGS_BY_AUTHOR_QUERY, { id });

  return (
    <>
      {blogs.length > 0 ? (
        blogs.map((blog: BlogCardType) => (
          <UserCards isProfile key={blog?._id} post={blog} />
        ))
      ) : (
        <p className="no-result">No posts yet.</p>
      )}
    </>
  );
};

export default UserBlogs;
