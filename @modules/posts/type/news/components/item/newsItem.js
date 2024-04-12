import React from "react";
import Image from "next/image";
import thumb from "public/detail/news-1.jpg";
import { formateDate } from "helpers/formateDate";

export default function NewsItem({ name, date_published, item }) {
  return (
    <div className="pb-2.5 border-b-[1px] border-greyborder">
      <div className="flex flex-col gap-2 mb-[6px] max-w-[inherit]">
        <div className="min-w-[220px] w-[220px] overflow-hidden rounded-[1px]">
          <div className="w-[220px] h-[160px]">
            <Image
              src={
                item.preview_image
                  ? `https://flate.pro/${item.preview_image}`
                  : thumb.src
              }
              layout="responsive"
              width={220}
              height={160}
            />
          </div>
        </div>
        <span className="block text-sm text-primary font-semibold">
          {item.name}
        </span>
      </div>

      <div
        className="ellipsis"
        // style={{ minHeight: "36px", maxHeight: "36px", height: "36px" }}
      >
        <p className="text-grey text-xs block">{item.preview_text}</p>
      </div>

      <span className="text-grey text-exs block mt-1">
        {item.date_published && formateDate(item.date_published)}
      </span>
    </div>
  );
}
