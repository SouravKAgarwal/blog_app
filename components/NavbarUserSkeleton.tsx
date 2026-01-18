import { Skeleton } from "./ui/skeleton";

const NavbarUserSkeleton = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Skeleton className="hidden sm:block h-10 w-24 rounded-full bg-secondary/50" />
      <Skeleton className="sm:hidden h-10 w-10 rounded-full bg-secondary/50" />

      <Skeleton className="hidden sm:block h-10 w-20 bg-transparent" />
      <Skeleton className="sm:hidden h-10 w-10 rounded-full bg-transparent" />

      <Skeleton className="size-10 rounded-full bg-secondary" />
    </div>
  );
};

export default NavbarUserSkeleton;
