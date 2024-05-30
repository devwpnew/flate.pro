import { useSelector } from "react-redux";

import Image from "next/image";
import Button from "@modules/common/components/button/button";
import LinkWrap from "@modules/common/components/link/linkWrap";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";

import { BsPlus } from "react-icons/bs";

export default function UserAddButton({
    icon,
    width,
    height,
    button,
    buttonText,
}) {
    const user = useSelector((state) => state.userLogin.value);
    const [openUserModerationModal, setOpenUserModerationModal] =
        useState(false);

    return (
        <>
            {icon ? (
                <>
                    <div className="flex flex-col items-center gap-2">
                        {!button ? (
                            <>
                                {user?.user_group?.id === 6 ? (
                                    <button
                                        onClick={() =>
                                            setOpenUserModerationModal(true)
                                        }
                                        href="/user/profile/add"
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue"
                                    >
                                        <Image
                                            src={icon.src}
                                            width={icon.width}
                                            height={icon.height}
                                        />
                                    </button>
                                ) : (
                                    <LinkWrap
                                        href="/user/profile/add"
                                        className="flex items-center justify-center w-[23px] h-[23px] rounded-full bg-blue mt-[7px]"
                                    >
                                        {/* <Image
                      src={icon.src}
                      width={icon.width}
                      height={icon.height}
                    /> */}
                                        <BsPlus className="text-white text-[23px]" />
                                    </LinkWrap>
                                )}
                            </>
                        ) : (
                            <>
                                {user?.user_group?.id === 6 ? (
                                    <Button
                                        className={
                                            "bg-green group hover:bg-blue active:bg-bluedeep transition-all"
                                        }
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenUserModerationModal(true)
                                            }
                                            className="flex gap-2.5 items-center px-5"
                                        >
                                            {icon && (
                                                <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white">
                                                    <Image
                                                        src={icon.src}
                                                        width={
                                                            width
                                                                ? width
                                                                : icon.width
                                                        }
                                                        height={
                                                            height
                                                                ? height
                                                                : icon.height
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <span className="text-white block text-sm font-semibold whitespace-nowrap">
                                                {buttonText}
                                            </span>
                                        </button>
                                    </Button>
                                ) : (
                                    <Button
                                        className={
                                            "bg-green group hover:bg-blue active:bg-bluedeep transition-all"
                                        }
                                    >
                                        <LinkWrap
                                            href="/user/profile/add"
                                            className="flex gap-2.5 items-center px-5"
                                        >
                                            {icon && (
                                                <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white">
                                                    <Image
                                                        src={icon.src}
                                                        width={
                                                            width
                                                                ? width
                                                                : icon.width
                                                        }
                                                        height={
                                                            height
                                                                ? height
                                                                : icon.height
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <span className="text-white block text-sm font-semibold whitespace-nowrap">
                                                {buttonText}
                                            </span>
                                        </LinkWrap>
                                    </Button>
                                )}
                            </>
                        )}
                        <span className="text-exs text-greymiddle">
                            Разместить
                        </span>
                    </div>
                </>
            ) : (
                <>
                    {!button ? (
                        <>
                            {user?.user_group?.id === 6 ? (
                                <button
                                    onClick={() =>
                                        setOpenUserModerationModal(true)
                                    }
                                    href="/user/profile/add"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue"
                                >
                                    <Image
                                        src={icon.src}
                                        width={icon.width}
                                        height={icon.height}
                                    />
                                </button>
                            ) : (
                                <LinkWrap
                                    href="/user/profile/add"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue"
                                >
                                    <Image
                                        src={icon.src}
                                        width={icon.width}
                                        height={icon.height}
                                    />
                                </LinkWrap>
                            )}
                        </>
                    ) : (
                        <>
                            {user?.user_group?.id === 6 ? (
                                <Button
                                    className={
                                        "bg-green group hover:bg-blue active:bg-bluedeep transition-all"
                                    }
                                >
                                    <button
                                        onClick={() =>
                                            setOpenUserModerationModal(true)
                                        }
                                        className="flex gap-2.5 items-center px-5"
                                    >
                                        {icon && (
                                            <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white">
                                                <Image
                                                    src={icon.src}
                                                    width={
                                                        width
                                                            ? width
                                                            : icon.width
                                                    }
                                                    height={
                                                        height
                                                            ? height
                                                            : icon.height
                                                    }
                                                />
                                            </div>
                                        )}
                                        <span className="text-white block text-sm font-semibold whitespace-nowrap">
                                            {buttonText}
                                        </span>
                                    </button>
                                </Button>
                            ) : (
                                <Button
                                    className={
                                        "bg-white group hover:bg-greylight active:bg-greylight transition-all"
                                    }
                                >
                                    <LinkWrap
                                        href="/user/profile/add"
                                        className="flex gap-2.5 items-center"
                                    >
                                        {icon && (
                                            <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white">
                                                <Image
                                                    src={icon.src}
                                                    width={
                                                        width
                                                            ? width
                                                            : icon.width
                                                    }
                                                    height={
                                                        height
                                                            ? height
                                                            : icon.height
                                                    }
                                                />
                                            </div>
                                        )}
                                        <span className="rounded-[10px] px-4 py-2 bg-white text-blue border border-blue/10 whitespace-nowrap w-full">
                                            {buttonText}
                                        </span>
                                    </LinkWrap>
                                </Button>
                            )}
                        </>
                    )}
                </>
            )}

            <Dialog
                open={openUserModerationModal}
                onClose={() => setOpenUserModerationModal(false)}
            >
                <DialogWrapper>
                    <Dialog.Panel
                        className={`bg-white p-5 max-w-[550px] rounded-[10px] relative mx-[16px]`}
                    >
                        <DialogMessage
                            className={" "}
                            isShow={openUserModerationModal}
                            onClose={() => setOpenUserModerationModal(false)}
                            title={"Ваш аккаунт на модерации"}
                            subtitle={
                                "После одобрения, вам будут доступны все возможности и функции. Обычно это занимает не более часа."
                            }
                            isOffTimeout={true}
                        />
                    </Dialog.Panel>
                </DialogWrapper>
            </Dialog>
        </>
    );
}
