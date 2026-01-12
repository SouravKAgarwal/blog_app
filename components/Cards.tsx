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
    </div>
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
