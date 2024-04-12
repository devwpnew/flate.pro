import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";

export default function MenuNoIconsItem({ name, id, slug, href, featured }) {
  const router = useRouter();
  const currentSlug = router.query.section_slug;

  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeftPos, setLineLeftPos] = useState(0);

  const containerEl = useRef(null);
  const element = useRef(null);

  // useEffect(() => {
  //   setLineWidth(containerEl.current.offsetWidth);
  //   setLineLeftPos((lineWidth - element.current.offsetWidth) / 2);
  // }, [containerEl, element, lineWidth]);

  useEffect(() => {
    if (slug === currentSlug) {
      setLineWidth(containerEl.current.offsetWidth);
      setLineLeftPos(
        (containerEl.current.offsetWidth - element.current.offsetWidth) / 2
      );
    }
  }, [currentSlug, containerEl, element]);

  // currentSlug

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave" && slug !== currentSlug) {
      setLineWidth(0);
      setLineLeftPos(0);
    } else {
      setLineWidth(containerEl.current.offsetWidth);
      setLineLeftPos(
        (containerEl.current.offsetWidth - element.current.offsetWidth) / 2
      );
    }
  };

  const lineClassName = `absolute bottom-[-18px] h-[2px] transition-all ${
    slug && slug == currentSlug ? "bg-blue" : "group-hover:bg-blue"
  } group-active:bg-blue`;

  const textClassName = `relative flex justify-center h-full cursor-pointer items-center text-sm text-center ${
    slug && slug == currentSlug
      ? "text-blue"
      : featured
      ? "text-blue font-semibold"
      : "text-primary"
  } group-hover:text-blue`;

  const itemClassName = `group list-none py-[8px] px-[15px] rounded-[4px] cursor-pointer transition-all ${
    featured ? " bg-bluefeatured" : "mr-[12px]"
  } hover:bg-greyF3 active:text-blue active:bg-bluefocus`;

  return (
    <>
      <Link href={href ? href : "/posts/" + slug} id={id}>
        <a>
          <li
            onMouseOver={hoverHandler}
            onMouseLeave={hoverHandler}
            ref={containerEl}
            className={itemClassName}
          >
            <span ref={element} className={textClassName}>
              {name}
              <span
                style={{ width: lineWidth, left: `-${lineLeftPos}px` }}
                className={lineClassName}
              ></span>
            </span>
          </li>
        </a>
      </Link>
    </>
  );
}
