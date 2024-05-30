import api from "pages/api/service/api";
import { motion } from "framer-motion";

import { useRef, useState } from "react";

import UserAvatar from "../common/userAvatar";
import UserName from "../common/userName";
import UserSubscribeExpiration from "../../subscribe/userSubscribeExpiration";
import UserActions from "./userActions";
import AdminActions from "../../../../admin/sidebar/parts/adminActions";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import { useDispatch } from "react-redux";
import { setLogedIn } from "store/global/user/userLogin";
import getLayout from "helpers/getLayout";
import Container from "@modules/common/components/container/container";
import BackButton from "@modules/common/components/button/backButton";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import MotionContainer from "@modules/common/components/container/motionContainer";
export default function UserInfo({ user, isAdmin }) {
    const dispatch = useDispatch();
    const { MOBILE, DESKTOP, VARIANTS } = getLayout();

    const [isLoadingUserAvatar, setIsLoadingUserAvatar] = useState(false);

    const fileInputRef = useRef();

    const changeUserAvatar = async (e) => {
        setIsLoadingUserAvatar(true);
        const formData = new FormData();
        formData.append("user_avatar", e.target.files[0]);
        formData.append("id", user.id);
        formData.append("window_host", window.location.origin);
        const test = await api.set.userAvatar(formData);

        if (test.itemId) {
            const updatedUser = await api.get.user({
                window_host: window.location.origin,
                filter: {
                    id: test.itemId,
                },
                sort: {
                    id: "asc",
                },
                limit: "all",
            });

            dispatch(setLogedIn(updatedUser[0]));

            setIsLoadingUserAvatar(false);

            return;
        }

        console.log("ERROR : Avatar not changed");
        setIsLoadingUserAvatar(false);
    };

    const loadPhotoHandler = (ev) => {
        ev.preventDefault();
        // console.log(fileInputRef);
        fileInputRef.current.click();
    };

    return (
        <>
            {MOBILE && <MobilePageHeader href={"/"} title="Личный кабинет" />}

            <MotionContainer>
                <Container>
                    <div className={`${isAdmin ? "" : ""} lg:px-0`}>
                        <div
                            className={`block pb-2.5 ${
                                isAdmin
                                    ? ""
                                    : "md:border-b border-greyborder md:mb-4"
                            }`}
                        >
                            <div
                                className={`flex justufy-between items-center gap-2.5 ${
                                    isAdmin ? "" : "mb-2.5"
                                }`}
                            >
                                <div className="flex flex-col pt-2.5 w-full">
                                    
									<div className="text-3xl mb-[15px]">
                                        {isLoadingUserAvatar ? (
                                            <PreloaderSpinner />
                                        ) : (
                                            <>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple={false}
                                                    name="user_avatar"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={changeUserAvatar}
                                                />
                                                <UserAvatar
                                                    className={"w-[90px] h-[90px] mx-auto"}
                                                    isAdmin={isAdmin}
                                                    userOwner={user}
                                                    name={user.user_name}
                                                    onClick={(ev) =>
                                                        loadPhotoHandler(ev)
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>

                                    <UserName
                                        name={user.user_name}
                                        isFeatured={true}
                                        isAdmin={isAdmin}
                                        className={"text-lg font-bold text-center"}
                                    />
                                    {isAdmin ? (
                                        ""
                                    ) : (
                                        <span className="text-grey text-sm text-center">
                                            {user?.user_agency}
                                        </span>
                                    )}

                                    {/* <UserSubscribeExpiration isAdmin={isAdmin} /> */}
                                </div>
                            </div>
                            {/* {user?.user_description && (
                <>
                  <span className="text-xs" style={{ color: "#999999" }}>
                    О себе
                  </span>
                  <span
                    className="text-semibold ellipsis ellipsis-clamp-2 text-sm"
                    style={{
                      minHeight: "55px",
                      maxHeight: "55px",
                      height: "55px",
                      lineHeight: "17px",
                    }}
                  >
                    {user?.user_description}
                  </span>
                </>
              )} */}
                        </div>

                        <div className="border-bborder-greyborder">
                            {isAdmin ? <AdminActions /> : <UserActions />}
                        </div>
                    </div>
                </Container>
            </MotionContainer>
        </>
    );
}
