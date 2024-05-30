import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";
import Logo from "../common/logo";
import Link from "next/link";

import MenuNoIcons from "@modules/menu/components/menuNoIcons";
import SearchShort from "@modules/search/components/searchShort";

import LocationButton from "@modules/location/components/button/button";
import locationIconBlue from "public/icons/map-mark-blue.svg";
import arrowBlueIcon from "public/icons/arrow-blue.svg";
import arrowPrimaryIcon from "public/icons/arrow-primary.svg";

import UserAddButton from "@modules/user/components/add/button/userAddButton";

import Enter from "./enter";
import Entered from "./entered";

import getLayout from "helpers/getLayout";
import MobileAppButtons from "./part/mobileAppButtons";

import Banner from "@modules/common/components/banner/banner";

import BannerHeader from "./part/bannerHeader";
import BannerMobile from "./part/bannerMobile";

import useIsPageLoaded from "hooks/useIsPageLoaded";
import Preloader from "@modules/common/components/preloader/preloader";
import { useEffect, useState } from "react";

export default function Header({ hideTopBar, ssrUser }) {
    const selectedUser = useSelector((state) => state.userLogin.value);
    const [user, setUser] = useState(ssrUser);
    const isPageLoading = useIsPageLoaded();

    const router = useRouter();

    const { DESKTOP, MOBILE } = getLayout();

    let isIndexPage = false;
    if (router.pathname === "/") {
        isIndexPage = true;
    }

    useEffect(() => {
        if (!user || JSON.stringify(user) === "{}") {
            setUser(selectedUser);
        }
    }, [selectedUser]);

    return (
        <>
            {/* {DESKTOP && (
        <Banner Component={BannerHeader} type={"header-banner"} id={4} />
      )}

      {MOBILE && navigator.userAgent.match(/Android/i) && (
        <Banner
          isStatic={true}
          Component={BannerMobile}
          type={"mobile-banner"}
          id={6}
        />
      )} */}

            {MOBILE && !isIndexPage ? (
                ""
            ) : (
                <header
                    id="Header"
                    className="sticky top-0 left-0 z-50 w-full border-b border-grey/5"
                >
                    <div className="w-full bg-white">
                        {!hideTopBar && (
                            <div className="hidden">
                                <Container>
                                    <div className="flex justify-end lg:justify-between">
                                        {/* <div className="hidden lg:block my-auto">
                                        <LocationButton
                                            icon={null}
                                            arrowIcon={arrowPrimaryIcon}
                                        />
                                        </div> */}

                                                            {/* {user && (
                                            <UserSubscribeExpiration user={user} isHeader={true} />
                                        )} */}

                                        {/* {DESKTOP && <MenuNoIcons />} */}

                                        {DESKTOP && (
                                            <div className="flex gap-5 text-backdrop/40 text-sm items-center">
                                                <MobileAppButtons />
                                                <Link href="/about">
                                                    О&nbsp;сервисе
                                                </Link>
                                                <Link href="/help">Помощь</Link>
                                                <Link href="/contacts">
                                                    Контакты
                                                </Link>
                                            </div>
                                        )}

                                        {/* <MobileAppButtons /> */}
                                        {/* <ThemeButton icon={themeIcon} /> */}
                                    </div>
                                </Container>
                            </div>
                        )}

                        <div className="bg-white lg:bg-transparent py-[10px] w-full">
                            <Container>
                                <div className="flex items-center w-full">
                                    <div className="flex w-full items-center">

                                        <div className="flex items-center gap-[10px] md:gap-[30px] w-full">
                                            <div>
												<Logo className="w-[120px] max-w-[120px]" />
                                            </div>

                                            <div className="hidden lg:flex my-auto">
                                                <LocationButton
                                                    icon={null}
                                                    arrowIcon={arrowPrimaryIcon}
                                                />
                                            </div>

                                            <div className="w-full">
												<SearchShort className="w-full" />
                                            </div>
                                        </div>

                                        <div className="md:px-[30px]">{DESKTOP && <MenuNoIcons />}</div>

                                        <div className="items-center hidden lg:block">
                                            <div className="flex items-center gap-[30px]">
                                                <div className="h-10 hidden lg:block">
                                                    <UserAddButton
                                                        button
                                                        buttonText={
                                                            "Разместить"
                                                        }
                                                        icon={null}
                                                    />
                                                </div>

                                                {/* <MobileAppButtons /> */}

                                                {user ? (
                                                    !isPageLoading ? (
                                                        <Entered />
                                                    ) : (
                                                        <div className="w-[200px] h-[41px]">
                                                            <Preloader />
                                                        </div>
                                                    )
                                                ) : !isPageLoading ? (
                                                    <Enter />
                                                ) : (
                                                    <div className="w-[65px] h-[41px]">
                                                        <Preloader />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* {!DESKTOP && (
                    <div className="text-blue">
                      <LocationButton
                        //icon={locationIconBlue}
                        icon={null}
                        arrowIcon={arrowBlueIcon}
                      />
                    </div>
                  )} */}
                                </div>
                            </Container>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
}
