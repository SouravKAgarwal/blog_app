import { BlogCardType } from "@/app/(root)/page";
import { generateBlurDataURL } from "@/lib/utils/image";
import { client } from "@/sanity/lib/client";
import { BLOGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { UserCards } from "./Cards";

import Pagination from "@/components/Pagination";
import { cacheTag } from "next/cache";

const UserBlogsContent = async ({
  id,
  page = 1,
}: {
  id: string;
  page?: number;
}) => {
  "use cache";
  cacheTag(`user-blogs-${id}`);

  const PAGE_SIZE = 6;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE + 1;

  const blogs = await client.fetch(BLOGS_BY_AUTHOR_QUERY, { id, start, end });

  const blogsWithBlur = await Promise.all(
    blogs.map(async (blog: BlogCardType) => {
      const blurDataURL = await generateBlurDataURL(blog.image);
      return { ...blog, blurDataURL };
    }),
  );

  const hasMore = blogsWithBlur.length > PAGE_SIZE;
  const displayedBlogs = blogsWithBlur.slice(0, PAGE_SIZE);

  return (
    <>
      {displayedBlogs.length > 0 ? (
        displayedBlogs.map((blog: BlogCardType) => (
          <li key={blog?._id} className="list-none">
            <UserCards isProfile post={blog} />
          </li>
        ))
      ) : (
        <p className="no-result">No posts yet.</p>
      )}

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Pagination page={page} hasMore={hasMore} />
      </div>
    </>
  );
};

const UserBlogs = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: Promise<{ page?: string }>;
}) => {
  const page = Number((await searchParams)?.page) || 1;
  return <UserBlogsContent id={id} page={page} />;
};

export default UserBlogs;
