import { Skeleton } from "@/components/ui/skeleton";

export default function SearchFormSkeleton() {
  return (
    <div className="search-form flex gap-2">
      <Skeleton className="h-[50px] w-full rounded-full bg-secondary" />
    </div>
  );
}
