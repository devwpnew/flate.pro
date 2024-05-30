import { useSelector } from "react-redux";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

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
            // original={`https://flate.pro/${user.user_avatar}`}
            // thumbnail={`https://flate.pro/${user.user_avatar}`}
            html={`<img src="https://flate.pro/${user.user_avatar}" />`}
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img
                ref={ref}
                onClick={(ev) => {
                  if (!onClick) {
                    open(ev);
                  }
                }}
                src={`https://flate.pro/${user.user_avatar}`}
                loading="lazy"
              />
            )}
          </Item>
        </Gallery>
      ) : (
        <div className={`${isAdmin ? "text-blue" : "text-white text-3xl"}`}>
          {createAvatar(name)}
          {/* <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_3167_4575)">
              <path
                d="M29.0209 21.9791C27.1693 20.1276 24.9654 18.7569 22.5608 17.9272C25.1362 16.1534 26.8281 13.1848 26.8281 9.82812C26.8281 4.40891 22.4192 0 17 0C11.5808 0 7.17188 4.40891 7.17188 9.82812C7.17188 13.1848 8.86384 16.1534 11.4393 17.9272C9.0347 18.7569 6.83081 20.1276 4.97921 21.9791C1.76833 25.1901 0 29.4591 0 34H2.65625C2.65625 26.0908 9.09082 19.6562 17 19.6562C24.9092 19.6562 31.3438 26.0908 31.3438 34H34C34 29.4591 32.2317 25.1901 29.0209 21.9791ZM17 17C13.0454 17 9.82812 13.7828 9.82812 9.82812C9.82812 5.8735 13.0454 2.65625 17 2.65625C20.9546 2.65625 24.1719 5.8735 24.1719 9.82812C24.1719 13.7828 20.9546 17 17 17Z"
                fill="#4BA5F8"
              />
            </g>
            <defs>
              <clipPath id="clip0_3167_4575">
                <rect width="34" height="34" fill="white" />
              </clipPath>
            </defs>
          </svg> */}
        </div>
      )}
    </div>
  );
}
