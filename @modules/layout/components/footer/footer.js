import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import Container from "@modules/common/components/container/container";

import SearchButton from "@modules/search/components/searchButton";



import { BsFillHouseDoorFill } from "react-icons/bs";
import { BsFillHeartFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { BsPlusCircleFill } from "react-icons/bs";





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
import downloadImage from 'public/download-desk.jpg';
import qrImage from 'public/qr-code.gif';
import googleImage from 'public/google-d.png';
import appImage from 'public/app-d.png';

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

                {LAPTOP_MOBILE && (
                    <div className="w-full bg-white">
                        <div className="border-t-[1px] border-greyborder pt-2 pb-3 lg:hidden">



                            <div className="grid grid-cols-5 gap-3 text-center pt-[3px]">
                                <Link href={"/"}>
                                    <div className={router.asPath === '/'? 'text-blue' : 'text-backdrop/50'}>
                                        <BsFillHouseDoorFill className="text-[18px] mx-auto mb-[3px]" />
                                        <p className="text-[.7rem]">Главная</p>
                                    </div>
                                </Link>
                                <div className={router.asPath.includes('/posts/flats') ? 'text-blue' : 'text-backdrop/40'}>
                                    <SearchButton className={`text-[18px] mx-auto mb-[3px]`} />
                                </div>
                                <Link href={"/user/profile/add"}>
                                    <div className={router.asPath === '/user/profile/add' ? 'text-blue' : 'text-backdrop/40'}>
                                        <BsPlusCircleFill className="text-[18px] mx-auto mb-[3px]" />
                                        <p className="text-[.7rem]">Разместить</p>
                                    </div>
                                </Link>
                                <Link href={"/user/profile/favorites"}>
                                    <div className={router.asPath === '/user/profile/favorites' ? 'text-blue' : 'text-backdrop/40'}>
                                        <BsFillHeartFill className="text-[16px] mx-auto mt-[2px] mb-[3px]" />
                                        <p className="text-[.7rem]">Избранное</p>
                                    </div>
                                </Link>
                                <div className={router.asPath === '/user/profile/items' ? 'text-blue' : 'text-backdrop/40'}>
                                    <UserProfileButton
                                        className={`text-[20px] mx-auto mb-[1px]`}
                                        icon={profileIcon}
                                        activeIcon={profileActiveIcon}
                                    />
                                </div>
                            </div>



                        </div>
                    </div>
                )}

                {DESKTOP && (
                    <div className="bg-greyF3 py-10">
                        <Container>
                            <div className="grid grid-cols-3 gap-5">
                                <div className="flex flex-col gap-5">
                                    <Logo className="text-[28px] leading-[32px]" />

                                    <span className="text-grey text-sm">
                                        Сделано для Агентов с
                                        <span
                                            className="mx-1 inline-flex w-5 h-5 bg-red_200 align-top"
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

                                    <span className="text-grey text-sm max-w-[300px]">
                                        FLATE.PRO - независимый сервис для
                                        объединения всех предложений на одном
                                        ресурсе и их поиска в пару кликов.
                                    </span>
                                </div>


							<div className="flex flex-row gap-28">

                                <div className="flex flex-col gap-5">
                                  
                                    <div className="flex flex-col gap-[10px] items-start">
                                        {!isLoading ? (
                                            sections.map(
                                                ({ name, id, slug }, index) => {
                                                    return (
                                                        <Link
                                                            href={
                                                                "/posts/" + slug
                                                            }
                                                            id={id}
                                                            key={
                                                                index +
                                                                randomInteger()
                                                            }
                                                        >
                                                            <a
                                                                className={`hover:text-blue cursor-pointer relative text-grey text-sm inline`}
                                                            >
                                                                {name}
                                                            </a>
                                                        </Link>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <Preloader />
                                        )}
                                    </div>
                                </div>

        

                                <div className="flex flex-col gap-5">
                                   
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
							</div>



                                <div className="flex items-start gap-[25px]">
                                    <div className="flex flex-col gap-[10px] items-start"></div>


										<div className="grid grid-cols-2 gap-5">
											<a
												href="https://apps.apple.com/ru/app/flate/id6458738854"
												target="_blank"
											>
												<div className="w-full px-5 py-3 rounded-[10px] bg-white flex">
													<img src="/apple.svg" alt="Apple" className="h-[20px] m-auto" />
												</div>
											</a>
											<a
												href="https://play.google.com/store/apps/details?id=flate.pro"
												target="_blank"
											>
												<div className="w-full px-5 py-3 rounded-[10px] bg-white flex">
													<img src="/google.svg" alt="Google" className="h-[18px] m-auto" />
												</div>
											</a>
											<div className="w-full px-2 py-2 rounded-[10px] bg-white">
												<img src="/apple-qr.svg" alt="Apple QR" />
											</div>
											<div className="w-full px-2 py-2 rounded-[10px] bg-white">
												<img src="/google-qr.svg" alt="Google QR" />
											</div>
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
