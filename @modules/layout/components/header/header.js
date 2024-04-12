import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";
import Logo from "../common/logo";

import MenuNoIcons from "@modules/menu/components/menuNoIcons";

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
      {DESKTOP && (
        <Banner Component={BannerHeader} type={"header-banner"} id={4} />
      )}

      {MOBILE && navigator.userAgent.match(/Android/i) && (
        <Banner
          isStatic={true}
          Component={BannerMobile}
          type={"mobile-banner"}
          id={6}
        />
      )}

      {MOBILE && !isIndexPage ? (
        ""
      ) : (
        <header id="Header" className="sticky top-0 left-0 z-50 w-full">
          <div className="w-full bg-white">
            {!hideTopBar && (
              <div className="py-[2px]">
                <Container>
                  <div className="flex justify-end lg:justify-between">
                    <div className="hidden lg:block">
                      <LocationButton
                        icon={null}
                        arrowIcon={arrowPrimaryIcon}
                      />
                    </div>

                    <div className="py-[6px] flex gap-5 justify-end items-center mr-[20px] lg:mr-0">
                      {/* {user && (
                        <UserSubscribeExpiration user={user} isHeader={true} />
                      )} */}

                      <MobileAppButtons />
                      {/* <ThemeButton icon={themeIcon} /> */}
                    </div>
                  </div>
                </Container>
              </div>
            )}

            <div className="bg-greylight lg:bg-transparent border-solid border lg:border-t border-greyborder py-[5.5px]">
              <Container>
                <div className="flex justify-between items-center">
                  <div className="flex w-full items-start justify-start lg:justify-between lg:items-center">
                    <div className="flex items-center">
                      <Logo />

                      {DESKTOP && <MenuNoIcons />}
                    </div>

                    <div className="flex items-center hidden lg:block">
                      <div className="flex items-center gap-2.5">
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

                        <div className="h-10 hidden lg:block">
                          <UserAddButton
                            button
                            buttonText={"Разместить объявление"}
                            icon={null}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {!DESKTOP && (
                    <div className="text-blue">
                      <LocationButton
                        icon={locationIconBlue}
                        arrowIcon={arrowBlueIcon}
                      />
                    </div>
                  )}
                </div>
              </Container>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
