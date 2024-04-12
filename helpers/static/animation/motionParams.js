import React from "react";

const dropdownParams = {
  initial: "init",
  animate: "show",
  exit: "hide",
  variants: {
    init: { scale: 0.95 },
    show: {
      scale: 1,
      transition: {
        duration: 0.1,
        type: "Inertia",
      },
    },
    hide: {
      transition: {
        duration: 0.1,
        type: "Inertia",
      },
    },
  },
};

const fadeParams = {
  initial: "init",
  animate: "show",
  exit: "hide",
  variants: {
    init: { opacity: 0 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "Inertia",
      },
    },
    hide: { opacity: 0 },
  },
};

const motionParams = {
  dropdownParams,
  fadeParams
};

export default motionParams;
