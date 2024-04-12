import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import getLayout from "helpers/getLayout";
import motionParams from "helpers/static/animation/motionParams";

export default function ButtonToTop() {
  const { userWindowWidth } = getLayout();

  const [isShow, setIsOnShow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 100) {
        setIsOnShow(false);
      } else {
        setIsOnShow(true);
      }
    });
  }, []);

  const slideToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <AnimatePresence>
        {isShow && (
          <motion.button
            {...motionParams.fadeParams}
            onClick={slideToTop}
            className="relative"
          >
            <div
              className="fixed bottom-[61px] right-0 z-50 bg-greyA0 hover:bg-blue transition-all rounded-md overflow-hidden"
              style={{
                right: 30,
              }}
            >
              <div className="w-[40px] h-[40px] flex flex-col justify-center items-center rounded-md cursor-pointer">
                <svg
                  width="16"
                  height="9"
                  viewBox="0 0 16 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.292692 8.70748C0.480596 8.89481 0.735147 9 1.00053 9C1.26591 9 1.52046 8.89481 1.70837 8.70748L8.00335 2.41516L14.2998 8.70748C14.4882 8.89172 14.7417 8.99421 15.0053 8.99268C15.2688 8.99116 15.5211 8.88574 15.7074 8.69934C15.8936 8.51294 15.9988 8.26061 16 7.99717C16.0012 7.73372 15.8983 7.48045 15.7138 7.29236L8.71118 0.292561C8.52329 0.105212 8.26874 0 8.00335 0C7.73796 0 7.4834 0.105212 7.29551 0.292561L0.292692 7.29236C0.10526 7.48018 0 7.73464 0 7.99993C0 8.26521 0.10526 8.51967 0.292692 8.70748Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
