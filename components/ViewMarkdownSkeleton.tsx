import { Skeleton } from "@/components/ui/skeleton";

const ViewMarkdownSkeleton = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-3/4 bg-zinc-200 rounded-md" />
      <Skeleton className="h-4 w-full bg-zinc-200 rounded-md" />
      <Skeleton className="h-4 w-full bg-zinc-200 rounded-md" />
      <Skeleton className="h-4 w-5/6 bg-zinc-200 rounded-md" />
      <Skeleton className="h-64 w-full bg-zinc-200 rounded-xl mt-6" />
      <Skeleton className="h-4 w-full bg-zinc-200 rounded-md" />
      <Skeleton className="h-4 w-4/5 bg-zinc-200 rounded-md" />
    </div>
  );
};

export default ViewMarkdownSkeleton;
