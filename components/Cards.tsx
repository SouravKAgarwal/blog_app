import { BlogCardType } from "@/app/(root)/page";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, Edit2Icon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

export const UserCards = ({
  post,
  isProfile = false,
}: {
  post: BlogCardType;
  isProfile?: boolean;
}) => {
  const {
    _createdAt,
    views,
    description,
    author,
    image,
    _id,
    title,
    category,
  } = post;

  return (
    <article className="blog-card group">
      <div className="flex-between">
        <p className="blog-card_date">{formatDate(_createdAt)}</p>

        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/blog/${_id}`}>
            <h3 className="text-18-semibold line-clamp-2">{title}</h3>
          </Link>
        </div>

        <Link href={`/user/${author?._id}`}>
          <Image
            src={`${author?.image}`}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/blog/${_id}`}>
        <p className="blog-card_desc">{description}</p>
        <Image
          src={`${image}`}
          alt={`${title}`}
          width={400}
          height={200}
          className="blog-card_img"
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-14-medium">{category}</p>
        </Link>
        <div className="flex gap-2">
          {isProfile && (
            <Button className="blog-card_edit-btn rounded-full" asChild>
              <Link href={`/blog/edit/${_id}`}>
                <Edit2Icon />
              </Link>
            </Button>
          )}
          <Button className="blog-card_btn" asChild>
            <Link href={`/blog/${_id}`}>
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

export const BlogCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((i: number) => (
      <li key={cn("skeleton", i)}>
        <div className="blog-card group h-full">
          <div className="flex-between">
            <Skeleton className="h-5 w-24 bg-zinc-200 rounded-full" />
            <Skeleton className="size-6 bg-zinc-200 rounded-full" />
          </div>
          <div className="flex-between mt-5 gap-5">
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 bg-zinc-200 rounded-md mb-2" />
              <Skeleton className="h-6 w-1/2 bg-zinc-200 rounded-md" />
            </div>
            <Skeleton className="size-8 bg-zinc-200 rounded-full" />
          </div>

          <div className="mt-5">
            <Skeleton className="h-4 w-full bg-zinc-200 rounded-md mb-2" />
            <Skeleton className="h-4 w-5/6 bg-zinc-200 rounded-md mb-4" />
            <Skeleton className="w-full h-[120px] rounded-[10px] bg-zinc-200" />
          </div>

          <div className="flex-between gap-3 mt-5">
            <Skeleton className="h-8 w-24 bg-zinc-200 rounded-full" />
            <Skeleton className="size-10 bg-zinc-200 rounded-full" />
          </div>
        </div>
      </li>
    ))}
  </>
);
