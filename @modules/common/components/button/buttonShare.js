import { useEffect, useRef, useState } from "react";

import Button from "./button";
import ButtonWithIcon from "./buttonWithIcon";
import OutsideAlerter from "hooks/useOutsideAlerter";
import useWindowDimensions from "hooks/useWindowDimensions";
import { BsShare } from "react-icons/bs";

async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand("copy", true, text);
    }
}

export default function ButtonShare({
    children,
    shareButtonLink,
    className,
    iconW,
    iconH,
    ...other
}) {
    const { width } = useWindowDimensions();

    const [containerWidth, setContainerWidth] = useState(false);
    const containerRef = useRef();

    const [copyInput, setShowCopyInput] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(shareButtonLink ? shareButtonLink : window.location)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                    setShowCopyInput(false);
                }, 1000);
            })
            .catch((err) => {
                // console.log(err);
            });
    };

    useEffect(() => {
        if (width < containerRef?.current?.offsetWidth) {
            setContainerWidth(width / 1.5);
        } else {
            setContainerWidth(containerRef?.current?.offsetWidth);
        }
    }, [containerRef, copyInput]);

    // console.log(containerWidth);

    return (
        <OutsideAlerter action={() => setShowCopyInput(false)}>
            <div className="relative">
                <ButtonWithIcon
                    className={
                        className ? className : "whitespace-nowrap py-2.5 px-4"
                    }
                    icon={<BsShare />}
                    iconW={iconW}
                    iconH={iconH}
                    onClick={() => setShowCopyInput((val) => !val)}
                    {...other}
                >
                    {isCopied ? "Ссылка скопирована!" : children}
                </ButtonWithIcon>

                {copyInput && (
                    <div
                        className={`absolute ${
                            width < 700 ? "right-0" : "left-0"
                        } top-11 z-20 bg-greyF3 p-[5px] rounded-lg flex items-center`}
                        ref={containerRef}
                        style={{ width: containerWidth }}
                    >
                        <div
                            className="bg-white p-[5px] rounded mr-2.5 text-xs whitespace-nowrap overflow-ellipsis overflow-hidden"
                            style={{ color: "#777777" }}
                        >
                            {shareButtonLink
                                ? shareButtonLink
                                : window.location.href}
                        </div>
                        <Button
                            className={"w-auto px-2.5 py-1"}
                            onClick={handleCopyClick}
                        >
                            Копировать
                        </Button>
                    </div>
                )}
            </div>
        </OutsideAlerter>
    );
}

export function Icon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.78389 8.4815L9.22339 11.0685M9.21689 3.9315L4.78389 6.5185M12.8504 2.95C12.8504 4.02696 11.9773 4.9 10.9004 4.9C9.82344 4.9 8.95039 4.02696 8.95039 2.95C8.95039 1.87304 9.82344 1 10.9004 1C11.9773 1 12.8504 1.87304 12.8504 2.95ZM5.05039 7.5C5.05039 8.57695 4.17735 9.45 3.10039 9.45C2.02344 9.45 1.15039 8.57695 1.15039 7.5C1.15039 6.42304 2.02344 5.55 3.10039 5.55C4.17735 5.55 5.05039 6.42304 5.05039 7.5ZM12.8504 12.05C12.8504 13.127 11.9773 14 10.9004 14C9.82344 14 8.95039 13.127 8.95039 12.05C8.95039 10.973 9.82344 10.1 10.9004 10.1C11.9773 10.1 12.8504 10.973 12.8504 12.05Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
