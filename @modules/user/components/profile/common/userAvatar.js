import { useSelector } from "react-redux";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";

function createAvatar(name) {
    if (name) {
        const avatarText = name.toUpperCase().slice(0, 1);
        return avatarText;
    }
    return name;
}

export default function UserAvatar({
    isAdmin,
    userName,
    userOwner,
    onClick,
    className,
}) {
    const user = userOwner
        ? userOwner
        : useSelector((state) => state.userLogin.value);
    const name = userName ? userName : user.user_name;

    return (
        <div
            className={`flex items-center justify-center rounded-full overflow-hidden cursor-pointer ${
                isAdmin ? "bg-white" : "bg-blue/15"
            } ${className ? className : "w-full h-full"}`}
            onClick={onClick}
        >
            {user && user.user_avatar ? (
                <Gallery>
                    <Item
                        original={`https://flate.pro/${user.user_avatar}`}
                        thumbnail={`https://flate.pro/${user.user_avatar}`}
                        width="1024"
                        height="768"
                    >
                        {({ ref, open }) => (
                            <div className="relative h-full w-full" ref={ref}>
                                <Image
                                    className="object-cover"
                                    onClick={(ev) => {
                                        if (!onClick) {
                                            open(ev);
                                        }
                                    }}
                                    src={`https://flate.pro/${user.user_avatar}`}
                                    alt="User Avatar"
                                    layout="fill"
                                />
                            </div>
                        )}
                    </Item>
                </Gallery>
            ) : (
                <div
                    className={`flex items-center justify-center ${
                        isAdmin ? "text-blue" : "text-white text-3xl"
                    }`}
                >
                    {createAvatar(name)}
                </div>
            )}
        </div>
    );
}
