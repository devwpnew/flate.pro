import React from "react";
import H2 from "@modules/common/components/heading/h2";
import Link from "next/link";
import Banner from "@modules/common/components/banner/banner";
import BannerHeader from "@modules/layout/components/header/part/bannerHeader";
import BannerSidebar from "./part/bannerSidebar";
// import NewsContainer from "@modules/posts/type/news/components/template/newsContainer";
export default function Sidebar({
  children,
  title,
  hideFooter,
  containerClassName,
}) {
  // const curYear = new Date().getFullYear();
  return (
    <div
      className={`${containerClassName ? containerClassName : "hidden lg:block rounded min-w-[235px] w-[235px]"}`}
    >
      {title && (
        <div className="border-b border-greyborder w-full mb-[11px]">
          <H2 className={"pb-[4px]"} style={{ marginBottom: 0 }}>
            {title}
          </H2>
        </div>
      )}

      <aside
        className="lg:p-2 rounded bg-greylight border border-greyborder"
        style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)" }}
      >
        {children}
        {!hideFooter && (
          <div className="hidden lg:block pt-[20px]">
            {/* <p className="block my-5 text-grey text-sm">
              © 2011—{curYear} flate.pro — сделано в России. Жильё с гарантией.
            </p> */}
            {/* <Link href="/agree/">
              <a className="mb-1.5 underline text-grey block text-sm">
                Пользовательское соглашение
              </a>
            </Link>
            <Link href="/rules/">
              <a className="mb-1.5 underline text-grey block text-sm">
                Правила пользования
              </a>
            </Link>
            <Link href="/oferta/">
              <a className="mb-1.5 underline text-grey block text-sm">
                Оплачивая услуги на сайте, вы принимаете оферту
              </a>
            </Link> */}
            <Link href="/marketing/">
              <a className="lg:block text-primary text-sm mb-1">
                Реклама на сайте
              </a>
            </Link>
            <Link href="/help">
              <a className="lg:block text-primary text-sm ">Помощь</a>
            </Link>
          </div>
        )}

        <Banner Component={BannerSidebar} type={"sidebar-banner"} id={3} />
      </aside>
    </div>
  );
}
