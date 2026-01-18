import { BlogCardType } from "@/app/(root)/page";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, Edit2Icon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    blurDataURL,
  } = post;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-glow hover:border-primary/30 h-full">
      {/* Image Section - Top */}
      <Link
        href={`/blog/${_id}`}
        className="block relative aspect-16/10 overflow-hidden w-full"
      >
        {/* Gradient Overlay for Mood */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Image
          src={`${image}`}
          alt={`${title}`}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Header */}
        <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
          <Link href={`/?query=${category?.toLowerCase()}`} className="z-20">
            <span className="bg-secondary px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px] text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300 font-semibold">
              {category}
            </span>
          </Link>
          <span>{formatDate(_createdAt)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <Link
            href={`/blog/${_id}`}
            className="block group-hover:text-primary transition-colors duration-300"
          >
            <h3 className="text-2xl font-serif font-bold leading-tight">
              {title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-2 overflow-hidden text-ellipsis leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/40">
          <Link
            href={`/user/${author?._id}`}
            className="flex items-center gap-3 group/author z-20"
          >
            <Avatar className="size-8 border border-border group-hover/author:border-primary/50 transition-colors">
              <AvatarImage src={author?.image} alt={author?.name || "avatar"} />
              <AvatarFallback>
                {author?.name?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold line-clamp-1 text-muted-foreground group-hover/author:text-foreground transition-colors">
              {author?.name}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <EyeIcon className="size-3.5" />
              <span>{views}</span>
            </div>

            {isProfile && (
              <Link href={`/blog/edit/${_id}`} className="z-20">
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Edit2Icon className="size-3.5" />
                </Button>
              </Link>
            )}

            <Link href={`/blog/${_id}`} className="z-20">
              <Button
                size="icon"
                variant="ghost"
                className="size-8 -mr-2 text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export const BlogCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((i: number) => (
      <li key={cn("skeleton", i)}>
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card">
          <Skeleton className="w-full aspect-16/10 rounded-none bg-secondary" />
          <div className="p-6 flex flex-col flex-1 gap-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20 rounded-full bg-secondary" />
              <Skeleton className="h-4 w-24 bg-secondary" />
            </div>
            <Skeleton className="h-8 w-full bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full bg-secondary" />
                <Skeleton className="h-4 w-24 bg-secondary" />
              </div>
              <Skeleton className="size-8 rounded-full bg-secondary" />
            </div>
          </div>
        </div>
      </li>
    ))}
  </>
);
