import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWindowWidth,
  setWindowWidth,
} from "store/global/user/userWindowWidth";
import useWindowDimensions from "hooks/useWindowDimensions";

import { setCity } from "store/global/user/userCity";

export default function GlobalStatesProvider({ children }) {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin.value);

  useEffect(() => {
    dispatch(setWindowWidth(width));
  }, []);

  useEffect(() => {
    if (user?.default_city) {
      const userDefaultCity = {
        name: user.default_city.name,
        id: user.default_city.id,
      };

      dispatch(setCity(userDefaultCity));
    }
  }, [user]);

  return <>{children}</>;
}
