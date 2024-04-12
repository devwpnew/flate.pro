import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import Container from "@modules/common/components/container/container";

import SearchButton from "@modules/search/components/searchButton";

import UserAddButton from "@modules/user/components/add/button/userAddButton";
import UserMessagesButton from "@modules/user/components/messages/button/userMessagesButton";
import UserProfileButton from "@modules/user/components/profile/button/profileButton";
import UserFavoriteButton from "@modules/user/components/favorites/button/userFavoriteButton";

import profileIcon from "public/icons/user-grey.svg";
import profileActiveIcon from "public/icons/user-blue.svg";

import favoriteIcon from "public/icons/heart-grey.svg";
import searchIcon from "public/icons/search-grey.svg";
import addIcon from "public/icons/add-grey.svg";
import messagesIcon from "public/icons/messages-grey.svg";

import getLayout from "helpers/getLayout";
import downlaod from "public/download-desk.jpg";
import qr from "public/qr-code.gif";
import google from "public/google-d.png";
import app from "public/app-d.png";

import heart from "public/icons/heart.svg";
import Preloader from "@modules/common/components/preloader/preloader";

import randomInteger from "helpers/randomInteger";
import FooterDeepLink from "./footerDeepLink";
import Logo from "../common/logo";

export default function Footer() {
  const { MOBILE, LAPTOP, LAPTOP_MOBILE, DESKTOP } = getLayout();

  const [isLoading, setLoading] = useState(true);
  const [sections, setSections] = useState(null);
  const router = useRouter();
  const currentSlug = router.query.section_slug;

  useEffect(() => {
    (async function fetchData() {
      setSections(
        await API.get.sections({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          filter: {
            active: true,
          },
        })
      );

      setLoading(false);
    })();
  }, []);

  return (
    <>
      <footer
        id="Footer"
        className={`${
          LAPTOP_MOBILE && "fixed bottom-0 left-0 z-50 w-full"
        } w-full`}
      >
        {LAPTOP_MOBILE && <FooterDeepLink />}

        {LAPTOP_MOBILE && (
          <div className="w-full bg-white">
            <div className="border-t-[1px] border-greyborder pt-2 pb-3 lg:hidden">
              <Container>
                <div className="flex items-center justify-between md:max-w-[350px] md:w-full md:mx-auto">
                  <div className="flex flex-col items-center h-[53px] w-[50px] justify-between pt-2">
                    {/* <UserFavoriteButton icon={favoriteIcon} /> */}

                    <Link href={"/"}>
                      <a className="flex items-center justify-center w-5 h-5 relative">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 66 66"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 23.7355L29.1094 10.9959L26.8906 7.66772L6.8906 21.0011C6.3342 21.372 6 21.9965 6 22.6652V49.3318C6 52.5144 7.26428 55.5667 9.51472 57.8171C11.7652 60.0675 14.8174 61.3318 18 61.3318H26.3333V57.3318H18C15.8783 57.3318 13.8434 56.489 12.3431 54.9887C10.8429 53.4884 10 51.4536 10 49.3318V23.7355Z"
                            fill="#A0A0A0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M56 23.7355L36.8906 10.9959L39.1094 7.66772L59.1094 21.0011C59.6658 21.372 60 21.9965 60 22.6652V49.3318C60 52.5144 58.7357 55.5667 56.4853 57.8171C54.2349 60.0675 51.1826 61.3318 48 61.3318H39.6667V57.3318H48C50.1218 57.3318 52.1566 56.489 53.6569 54.9887C55.1572 53.4884 56 51.4536 56 49.3318V23.7355Z"
                            fill="#A0A0A0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30.0669 5.5615C30.9377 4.98801 31.9575 4.68237 33.0002 4.68237C34.0429 4.68237 35.0627 4.98801 35.9335 5.5615L35.9389 5.56502L39.1096 7.66772L64.1096 24.3344C65.0287 24.9471 65.277 26.1888 64.6643 27.1079C64.0516 28.0269 62.8099 28.2753 61.8908 27.6626L36.8949 10.9986L36.8908 10.9959L33.7335 8.90215C33.7329 8.90171 33.7322 8.90127 33.7315 8.90083C33.5143 8.75831 33.2601 8.68237 33.0002 8.68237C32.7404 8.68237 32.4863 8.75827 32.2691 8.90071C32.2683 8.90119 32.2676 8.90167 32.2669 8.90215L29.1096 10.9959L29.1056 10.9986L4.10961 27.6626C3.19056 28.2753 1.94882 28.0269 1.33611 27.1079C0.723407 26.1888 0.971755 24.9471 1.89081 24.3344L26.8908 7.66772L26.8949 7.66503L30.0615 5.56503L30.0669 5.5615Z"
                            fill="#A0A0A0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M26.8724 39.8704C28.4977 38.2451 30.7021 37.332 33.0007 37.332C35.2992 37.332 37.5036 38.2451 39.1289 39.8704C40.7542 41.4958 41.6673 43.7002 41.6673 45.9987V59.332C41.6673 60.4366 40.7719 61.332 39.6673 61.332C38.5627 61.332 37.6673 60.4366 37.6673 59.332V45.9987C37.6673 44.761 37.1757 43.574 36.3005 42.6989C35.4253 41.8237 34.2383 41.332 33.0007 41.332C31.763 41.332 30.576 41.8237 29.7008 42.6989C28.8257 43.574 28.334 44.761 28.334 45.9987V59.332C28.334 60.4366 27.4386 61.332 26.334 61.332C25.2294 61.332 24.334 60.4366 24.334 59.332V45.9987C24.334 43.7002 25.2471 41.4958 26.8724 39.8704Z"
                            fill="#A0A0A0"
                          />
                        </svg>
                      </a>
                    </Link>

                    <span className="text-exs text-greymiddle">Главная</span>
                  </div>

                  <SearchButton icon={searchIcon} />

                  <UserAddButton icon={addIcon} />

                  <div className="flex flex-col items-center h-[53px] w-[50px] justify-between pt-2">
                    {/* <UserMessagesButton icon={messagesIcon} /> */}
                    <UserFavoriteButton icon={favoriteIcon} />
                    <Link href="/user/profile/favorites">
                      <span className="text-exs text-greymiddle">
                        Избранное
                      </span>
                    </Link>

                    {/* <span className="text-exs text-greymiddle">Сообщения</span> */}
                  </div>

                  <UserProfileButton
                    icon={profileIcon}
                    activeIcon={profileActiveIcon}
                  />
                </div>
              </Container>
            </div>
          </div>
        )}

        {DESKTOP && (
          <div className="bg-greyF3 py-5">
            <Container>
              <div className="grid grid-cols-4 gap-5">
                <div className="flex flex-col gap-5">
                  <Logo className="text-[28px] leading-[32px]" />

                  <span className="text-grey text-sm">
                    Сделано для Агентов с
                    <span
                      className="inline-block mx-1 inline-flex w-5 h-5 bg-red_200 align-top"
                      style={{
                        WebkitMaskImage: `url("${heart.src}")`,
                        maskImage: `url("${heart.src}")`,
                        WebkitMaskRepeat: `no-repeat`,
                        maskRepeat: `no-repeat`,
                        WebkitMaskPosition: `50% 50%`,
                        maskPosition: `50% 50%`,
                      }}
                    ></span>
                  </span>

                  <span className="text-grey text-sm">
                    FLATE.PRO - независимый сервис для объединения всех
                    предложений на одном ресурсе и их поиска в пару кликов.
                  </span>
                </div>

                <div className="flex flex-col gap-5 mt-[11px]">
                  <span className="text-primary font-bold text-sm">
                    Категории
                  </span>
                  <div className="flex flex-col gap-[10px] items-start">
                    {!isLoading ? (
                      sections.map(({ name, id, slug }, index) => {
                        return (
                          <Link
                            href={"/posts/" + slug}
                            id={id}
                            key={index + randomInteger()}
                          >
                            <a
                              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                            >
                              {name}
                            </a>
                          </Link>
                        );
                      })
                    ) : (
                      <Preloader />
                    )}
                  </div>
                </div>

                {/* <div className="flex flex-col gap-5 mt-[11px]">
                <span className="text-primary font-bold text-sm">
                  Социальные сети
                </span>
                <div className="flex flex-col gap-[10px] items-start">
                  <div
                    className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                  >
                    E-mail{" "}
                    <a href="mailto:help@flate.pro" className="text-blue">
                      help@flate.pro
                    </a>
                  </div>
                  <div
                    className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                  >
                    Telegram Чат
                  </div>
                  <div
                    className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                  >
                    Telegram Канал
                  </div>
                </div>
              </div> */}

                <div className="flex flex-col gap-5 mt-[11px]">
                  <span className="text-primary font-bold text-sm">
                    Поддержка
                  </span>
                  <div className="flex flex-col gap-[10px] items-start">
                    <Link href={"/about"}>
                      <a
                        className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                      >
                        О компании
                      </a>
                    </Link>
                    <Link href={"/contacts"}>
                      <a
                        className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                      >
                        Контакты
                      </a>
                    </Link>
                    <Link href={"/help"}>
                      <a
                        className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                      >
                        Помощь
                      </a>
                    </Link>
                    <Link href={"/documents"}>
                      <a
                        className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                      >
                        Юридические документы
                      </a>
                    </Link>
                    <Link href={"/rules"}>
                      <a
                        className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                      >
                        Правила использования
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-[25px]">
                  <Image
                    src={qr.src}
                    width={qr.width}
                    height={qr.height}
                    className="opacity-50"
                  />

                  {/* <img src="http://qrcoder.ru/code/?https%3A%2F%2Fflate.pro%2Fapp&4&0" width="132" height="132" border="0" title="QR код" className="opacity-50"/> */}

                  <div className="flex flex-col gap-[25px] cursor-pointer">
                    <a
                      href="https://play.google.com/store/apps/details?id=flate.pro"
                      target="_blank"
                    >
                      <Image
                        src={google.src}
                        width={google.width}
                        height={google.height}
                      />
                    </a>
                    <a
                      href="https://apps.apple.com/ru/app/flate/id6458738854"
                      target="_blank"
                    >
                      <Image
                        src={app.src}
                        width={app.width}
                        height={app.height}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        )}
      </footer>
    </>
  );
}
