import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Preloader from "@modules/common/components/preloader/preloader";
import Tooltip from "../tooltip/tooltip";
import favoriteIconGrey from "public/icons/heart-grey.svg";
import favoriteIconRed from "public/icons/heart-red.svg";
import randomInteger from "helpers/randomInteger";
import ButtonWithIcon from "./buttonWithIcon";
import { useDispatch } from "react-redux";
import { setFavorites } from "store/global/user/userFavorites";

export default function ButtonFavorite({
  productId,
  type,
  className = "",
  width,
  height,
  children,
  childrenAdded,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin.value);
  const favoritesList = useSelector((state) => state.userFavorites.value);

  const [isShowTooltip, setShowTooltip] = useState(false);

  const [isInFavorites, setIsInFavorites] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const [isFavoritesList, setIsFavoritesList] = useState(true);
  // const [favoritesList, setFavoritesList] = useState(null);

  // useEffect(() => {
  // (async function fetchFavorites() {
  // setIsFavoritesList(false);
  // setFavoritesList(await API.get.favoritesById(user.id));
  // console.log(favoritesList, 'favoritesList', productId);
  // if (favoritesList) {
  //   dispatch(setFavorites([...favoritesList, { id: productId }]));
  // }

  // setIsFavoritesList(true);
  // })();
  // }, [fetchTrigger]);

  useEffect(() => {
    (function isInFavoritesCheck() {
      if (isFavoritesList && favoritesList) {
        isInFavCheck();
      } else {
        setIsInFavorites(false);
      }
    })();
  }, [isFavoritesList, favoritesList]);

  const isInFavCheck = async () => {
    const idsArray = [];
    if (Array.isArray(favoritesList)) {
      favoritesList.map((e) => {
          idsArray.push(typeof e == 'object' ? e.id : e);
      });
    }
    const check = idsArray.includes(productId);
    setIsInFavorites(check);
  };

  const addRemoveFavorite = async () => {
    if (user) {
      setIsFavoritesList(false);

      if (isInFavorites) {
        await API.remove.favoritesById(user.id, productId);
        const list = favoritesList.filter((p) => p.id !== productId);
        dispatch(setFavorites(list));
      } else {
        await API.add.favoritesById(user.id, productId);
        const list = [
          ...(favoritesList ? favoritesList : []),
          { id: productId },
        ];
        dispatch(setFavorites(list));
      }

      setFetchTrigger((val) => !val);
      setIsFavoritesList(true);
    }else {
      router.push('/user/profile/auth')
    }
  };

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
    }
  };

  if (type === "button") {
    return (
      <>
        {isFavoritesList ? (
          <ButtonWithIcon
            type={isInFavorites ? "blue" : "white"}
            className={className}
            onClick={addRemoveFavorite}
            icon={isInFavorites ? IconRed() : Icon()}
          >
            {isInFavorites ? childrenAdded : children}
          </ButtonWithIcon>
        ) : (
          <div className="h-[31px] w-full">
            <Preloader />
          </div>
        )}
      </>
    );
  }

  // console.log(fetchTrigger, 'fetchTrigger', productId);
  // console.log(favoritesList, "favoritesList");
  return (
    <>
      {isFavoritesList ? (
        <div
          className={`${className} bg-white w-[30px] h-[30px] rounded-[50%] flex items-center justify-center transition-all cursor-pointer ${
            isInFavorites ? "scale-100" : "scale-0"
          } group-hover:scale-100 transition-all ${
            isInFavorites
              ? "opacity-50 group-hover:opacity-100 transition-all"
              : "opacity-1"
          }`}
          onClick={addRemoveFavorite}
          onMouseOver={hoverHandler}
          onMouseLeave={hoverHandler}
        >
          <Tooltip
            text={isInFavorites ? "Убрать из избранного" : "В избранное"}
            className={`bg-grey absolute left-[${
              isInFavorites ? "-35px" : "-25px"
            }] top-[-23px] text-xs text-white rounded px-1 whitespace-nowrap`}
            isShow={isShowTooltip}
          />
          <Image
            src={isInFavorites ? favoriteIconRed.src : favoriteIconGrey.src}
            width={width ? width : 18}
            height={height ? height : 18}
          />
        </div>
      ) : (
        <div
          className={
            className +
            "relative z-10 w-[30px] h-[30px] rounded-[50%] overflow-hidden"
          }
        >
          <Preloader />
        </div>
      )}
    </>
  );
}

export function Icon() {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.58869 2.10235L6.9998 2.69634L7.41094 2.10237C8.03041 1.20744 9.02038 0.63623 10.1287 0.63623C11.9669 0.63623 13.5 2.21191 13.5 4.20896C13.5 4.99232 13.1257 5.89771 12.49 6.85236C11.861 7.79703 11.0134 8.73489 10.1516 9.57147C9.29199 10.406 8.43042 11.1282 7.78274 11.6424C7.45927 11.8991 7.19008 12.1033 7.00235 12.2428C6.99987 12.2446 6.99739 12.2465 6.99493 12.2483C6.99366 12.2474 6.99239 12.2465 6.99111 12.2456C6.80371 12.1107 6.53488 11.913 6.21181 11.6633C5.56487 11.1635 4.70435 10.4585 3.84583 9.63593C2.98526 8.81137 2.13897 7.88022 1.51098 6.92905C0.877876 5.97012 0.5 5.04079 0.5 4.20893C0.5 2.91543 0.897266 2.03921 1.47897 1.48437C2.06568 0.924768 2.89866 0.63623 3.87088 0.63623C4.97955 0.63623 5.96932 1.20743 6.58869 2.10235Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  );
}

export function IconRed() {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.58869 2.10235L6.9998 2.69634L7.41094 2.10237C8.03041 1.20744 9.02038 0.63623 10.1287 0.63623C11.9669 0.63623 13.5 2.21191 13.5 4.20896C13.5 4.99232 13.1257 5.89771 12.49 6.85236C11.861 7.79703 11.0134 8.73489 10.1516 9.57147C9.29199 10.406 8.43042 11.1282 7.78274 11.6424C7.45927 11.8991 7.19008 12.1033 7.00235 12.2428C6.99987 12.2446 6.99739 12.2465 6.99493 12.2483C6.99366 12.2474 6.99239 12.2465 6.99111 12.2456C6.80371 12.1107 6.53488 11.913 6.21181 11.6633C5.56487 11.1635 4.70435 10.4585 3.84583 9.63593C2.98526 8.81137 2.13897 7.88022 1.51098 6.92905C0.877876 5.97012 0.5 5.04079 0.5 4.20893C0.5 2.91543 0.897266 2.03921 1.47897 1.48437C2.06568 0.924768 2.89866 0.63623 3.87088 0.63623C4.97955 0.63623 5.96932 1.20743 6.58869 2.10235Z"
        fill="white"
        stroke="red"
        fillOpacity="0.5"
      />
    </svg>
  );
}
