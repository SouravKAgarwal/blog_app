"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  hasMore: boolean;
}

const Pagination = ({ page, hasMore }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => handleNavigation("prev")}
        className="group"
      >
        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
      </Button>

      <span className="text-sm font-medium text-muted-foreground">{page}</span>

      <Button
        variant="outline"
        disabled={!hasMore}
        onClick={() => handleNavigation("next")}
        className="group"
      >
        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default Pagination;
