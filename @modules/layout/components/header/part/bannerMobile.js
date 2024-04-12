import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import Close from "@modules/common/components/button/close";
import Container from "@modules/common/components/container/container";

import bannerImg from "public/adaptive-icon.png";
import Button from "@modules/common/components/button/button";

export default function BannerMobile({ isClosed, setClosed, type }) {
  const activeCity = useSelector((state) => state.userCity.value);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (document.getElementById(type)) {
      setHeight(document.getElementById(type).offsetHeight);
    }
  }, []);

  const onCloseHandler = () => {
    setClosed(true);
    setCookie(`banner-${type}`, "closed", { maxAge: 86_400 });
  };

  return (
    !isClosed && (
      <motion.div>
        {
          <div
            id={type}
            className="sticky top-0 left-0 w-full z-20"
            style={{ background: "#f2f1f6" }}
          >
            <Container>
              <div className="flex flex-row items-center gap-2 py-2 border-b border-greyborder">
                <img
                  className="rounded-[10px] overflow-hidden"
                  src={bannerImg.src}
                  width={60}
                  height={60}
                />

                <div className="block">
                  <span className="block text-sm font-bold">FLATE</span>
                  <span className="block text-sm" style={{ color: "#5C5B57" }}>
                    Вся вторичка у вас в кармане
                  </span>
                </div>
                
                <Button
                  onClick={() => {
                    window.location.href = "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=flate.pro";
                  }}
                  className="max-w-[100px] ml-auto rounded-[10px]"
                  style={{ background: "#0f76ea" }}
                >
                  <span className="text-xs">ОТКРЫТЬ</span>
                </Button>

                <div className="absolute left-3.5 top-4.5">
                  <Close onClick={onCloseHandler} />
                </div>
              </div>
            </Container>
          </div>
        }
      </motion.div>
    )
  );
}
