import API from "pages/api/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import activeIcon from "public/icons/heart-blue-filled.svg";
import Tooltip from "@modules/common/components/tooltip/tooltip";


import { BsHeart } from "react-icons/bs";

import api from "pages/api/service/api";
import { useDispatch } from "react-redux";
import { setFavorites, getFavorites } from "store/global/user/userFavorites";

export default function UserFavoriteButton({ icon, width, height, title }) {
  // const href = "/user/favorites";
  const user = useSelector((state) => state.userLogin.value);
  const fav = useSelector((state) => state.userFavorites.value);
  const dispatch = useDispatch();
  const router = useRouter();

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   router.push(href);
  // };

  // const user = useSelector((state) => state.userLogin.value);

  const [favoritesList, setFavoritesList] = useState([]);
  const [isShowText, setIsShowText] = useState(false);

  // useEffect(() => {
  //   (async function fetchFavorites() {
  //     setFavoritesList(await API.get.favoritesById(user.id));
  //   })();
  // }, []);

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setIsShowText(false);
    } else {
      setIsShowText(true);
    }
  };

  // const [favoritesList, setFavoritesList] = useState(null);

  useEffect(() => {
    (async function fetchFavorites() {
      if (user) {
        setFavoritesList(await api.get.favoritesById(user.id));
      }
    })();
  }, [user]);

  useEffect(() => {
    if (favoritesList) {
      dispatch(setFavorites(favoritesList));
    }
  }, [favoritesList]);

  // console.log(fav, "fav");

  return (
    <LinkWrap
      onMouseOver={hoverHandler}
      onMouseLeave={hoverHandler}
      href="/user/profile/favorites"
      className="flex items-center justify-center w-5 h-5 relative"
    >
      {/* {router.asPath.split("/").includes("favorites") ? (
        <Image
          src={activeIcon.src}
          width={width ? width : activeIcon.width}
          height={height ? height : activeIcon.height}
        />
      ) : (
        <Image
          src={icon.src}
          width={width ? width : icon.width}
          height={height ? height : icon.height}
        />
      )} */}


      {router.asPath.split("/").includes("favorites") ? (
        <BsHeart className="text-blue" />
      ) : (
        <BsHeart />
      )}

      <div className="hidden">
        {favoritesList && favoritesList.length > 0 ? (
          <div
            className="absolute right-[-1px] top-[-1px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center"
            id="favCounter"
          >
            {favoritesList.length}
          </div>
        ) : (
          <div
            className="hidden absolute right-[-1px] top-[-1px] bg-red rounded-full w-3 h-3 text-white text-exs justify-center items-center"
            id="favCounter"
          ></div>
        )}
      </div>

      <Tooltip
        text={title}
        className="bg-grey absolute left-[-18px] bottom-[-20px] text-exs text-white rounded px-1"
        isShow={isShowText}
      />
    </LinkWrap>
  );
}
