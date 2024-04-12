import Link from "next/link";
import React from "react";

export default function PaginationItem({ pageIndex, pagesCount, curPageIndex }) {
  const lastItemClass = pageIndex === pagesCount ? "border-r-[1px]" : "";
  const curItemClass = pageIndex === curPageIndex ? "text-blue pointer-events-none cursor-copy" : "";

  return (
    <Link href={`?page=${pageIndex}`}>
      <a
        className={`inline-block pl-2 pr-2 border-l-[1px] ${lastItemClass} ${curItemClass}`}>
        {pageIndex}
      </a>
    </Link>
  );
}