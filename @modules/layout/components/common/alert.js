import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Container from "@modules/common/components/container/container";
import Close from "@modules/common/components/button/close";

import dangerIcon from "public/icons/danger-red.svg";

export default function Alert({ text, danger }) {
  let alertIcon = danger ? dangerIcon : "";
  const [height, setHeight] = useState(0);
  const [isClosed, setClosed] = useState(false);

  useEffect(() => {
    if (document.getElementById("alert")) {
      setHeight(document.getElementById("alert").offsetHeight);
    }
  }, []);

  return (
    <>
      {!isClosed && (
        <motion.div animate={{ marginBottom: `${height}px` }}>
          <div
            id="alert"
            className="bg-greylight fixed top-0 left-0 w-full z-20"
          >
            <Container>
              <div className="flex items-center justify-between py-2.5">
                {alertIcon && (
                  <Image
                    src={alertIcon.src}
                    width={alertIcon.width}
                    height={alertIcon.height}
                  />
                )}
                <span className="text-blue text-sm mx-5 block">{text}</span>
                <Close onClick={() => setClosed(true)} />
              </div>
            </Container>
          </div>
        </motion.div>
      )}
    </>
  );
}
