import { useSelector } from "react-redux";

export default function getLayout() {
  const userWindowWidth = useSelector((state) => state.userWindowWidth.value);
  
  let MOBILE = false;
  let DESKTOP = false;
  let LAPTOP = false;
  let LAPTOP_MOBILE = false;

  let VARIANTS = false;

  const MOB_VARIANTS = {
    init: { opacity: 0, x: "-100%" },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "Inertia",
      },
    },
    hide: { display: 'none' },
  };
  const DESK_VARIANTS = {
      init: { opacity: 0 },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          type: "Inertia",
        },
      },
      hide: { display: 'none' },
  };

  const desktopSize = 1230;
  const laptopSize = 768;

  if (userWindowWidth >= desktopSize) {
    DESKTOP = true;
    VARIANTS = DESK_VARIANTS;
  }

  if (userWindowWidth < desktopSize) {
    LAPTOP_MOBILE = true;
    VARIANTS = MOB_VARIANTS;
  }

  if (userWindowWidth >= laptopSize && userWindowWidth <= desktopSize) {
    LAPTOP = true;
    VARIANTS = MOB_VARIANTS;
  }

  if (userWindowWidth < laptopSize) {
    MOBILE = true;
    VARIANTS = MOB_VARIANTS;
  }
  return {
    userWindowWidth,
    MOBILE,
    LAPTOP,
    LAPTOP_MOBILE,
    DESKTOP,
    VARIANTS,
    MOB_VARIANTS,
    DESK_VARIANTS,
  };
}
