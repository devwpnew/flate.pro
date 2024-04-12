import { useEffect, useState } from "react";
import NewsItem from "../item/newsItem";

import Image from "next/image";
import Link from "next/link";

import tmpPhoto1 from "public/news-photo1.jpeg";
import tmpPhoto from "public/news-photo.jpg";

export default function NewsContainer({ news }) {
  return (
    <div className="flex flex-col gap-2.5 overflow-hidden">
      <Link href={'/message'}>
        <a className="pb-2.5 border-b-[1px] border-greyborder group">
          <div className="flex flex-col gap-2 mb-[6px] max-w-[inherit]">
            <div className="min-w-[220px] w-[220px] overflow-hidden rounded-[1px]">
              <div className="w-[220px] h-[160px]">
                <Image
                  className="object-cover object-center"
                  src={tmpPhoto1.src}
                  layout="responsive"
                  width={220}
                  height={160}
                />
              </div>
            </div>
            <span className="block text-sm text-primary font-semibold group-hover:text-blue transition-all">
              Открытое письмо основателя FLATE.PRO для вас
            </span>
          </div>

          <div
            className="ellipsis"
            // style={{ minHeight: "36px", maxHeight: "36px", height: "36px" }}
          >
            <p className="text-grey text-xs block">
              О рынке Сочи и сложностях в работе агентов.
            </p>
          </div>

          <span className="text-grey text-exs block mt-1">29.06.2023</span>
        </a>
      </Link>
      <Link href={'/about'}>
        <a className="pb-2.5 border-b-[1px] border-greyborder group">
          <div className="flex flex-col gap-2 mb-[6px] max-w-[inherit]">
            <div className="min-w-[220px] w-[220px] overflow-hidden rounded-[1px]">
              <div className="w-[220px] h-[160px]">
                <Image
                  className="object-cover object-top"
                  src={tmpPhoto.src}
                  layout="responsive"
                  width={220}
                  height={160}
                />
              </div>
            </div>
            <span className="block text-sm text-primary font-semibold group-hover:text-blue transition-all">
              Мы пришли, чтобы сделать вас счастливее!
            </span>
          </div>

          <div
            className="ellipsis"
            // style={{ minHeight: "36px", maxHeight: "36px", height: "36px" }}
          >
            <p className="text-grey text-xs block">
              FLATE.PRO - решение ваших проблем поиска вторички.
            </p>
          </div>

          <span className="text-grey text-exs block mt-1">29.06.2023</span>
        </a>
      </Link>

      {/* {news &&
        news.map((item) => {
          return (
            <NewsItem
              key={item.id}
              id={item.id}
              item={item}
              date_published={item.date_published}
            />
          );
        })} */}
    </div>
  );
}
