import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

import PaginationItem from "./part/PaginationItem";

export default function Pagination({ itemsAmount, itemsLimit }) {
  const router = useRouter();

  const pagesCount = Math.ceil(itemsAmount / itemsLimit);

  const curPageIndex = router.query?.page ? router.query?.page : "1";

  const nextPageIndex = +curPageIndex + 1 <= pagesCount ? +curPageIndex + 1 : null;
  const prevPageIndex = +curPageIndex - 1 > 0 ? +curPageIndex - 1 : null;

  const pages = [];
  for (let i = 0; i < pagesCount; i++) {
    const pageIndex = i + 1;

    pages.push(
      <PaginationItem
        pageIndex={pageIndex}
        pagesCount={pagesCount}
        curPageIndex={+curPageIndex}
        key={`?page=${pageIndex}`}
      />
    );
  }

  return (
    <>
      {pages.length !== 0 && (
        <div className="text-center mt-2.5">
          <span className="inline-block font-bold mr-[23px]">Страницы:</span>
          {prevPageIndex && (
            <Link href={`?page=${prevPageIndex}`}>
              <a className="pl-2 pr-2">Пред.</a>
            </Link>
          )}

          {pages}

          {nextPageIndex && (
            <Link href={`?page=${nextPageIndex}`}>
              <a className="pl-2 pr-2">След.</a>
            </Link>
          )}
        </div>
      )}
    </>
  );
}