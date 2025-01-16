import { BlogCardType } from "@/app/(root)/page";
import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

export const BlogCard = ({ post }: { post: BlogCardType }) => {
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
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup-card_date">{formatDate(_createdAt)}</p>

        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/blog/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>

        <Link href={`/user/${author?._id}`}>
          <Image
            src={`${author?.image}`}
            alt="avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/blog/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <Image
          src={`${image}`}
          alt={`${title}`}
          width={144}
          height={144}
          className="startup-card_img"
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/blog/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const EditorPicksCard = ({ post }: { post: BlogCardType }) => {
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
    <div className="blog-card group">
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
            <h3 className="text-18-semibold line-clamp-1">{title}</h3>
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
        <img src={`${image}`} alt={`${title}`} className="blog-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-14-medium">{category}</p>
        </Link>
        <Button className="blog-card_btn" asChild>
          <Link href={`/blog/${_id}`}>Details</Link>
        </Button>
      </div>
    </div>
  );
};

export const MostPopular = ({ post }: { post: BlogCardType }) => {
  const { description, image, _id, title } = post;

  return (
    <li className="border-b border-black-300/40 pb-2 group">
      <Link href={`/blog/${_id}`} className="flex-between gap-3">
        <img
          src={`${image}`}
          alt={`${title}`}
          className="rounded-lg w-[80px] h-[60px] object-cover"
        />
        <div>
          <p className="text-16-semibold line-clamp-1">{title}</p>
          <p className="blog-card_desc !my-0">{description}</p>
        </div>
      </Link>
    </li>
  );
};

export const BlogCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((i: number) => (
      <li key={cn("skeleton", i)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);
