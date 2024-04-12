import { motion } from "framer-motion";
import { useRouter } from "next/router";
import useWindowDimensions from "hooks/useWindowDimensions";

import getLayout from "helpers/getLayout";

export default function MotionContainer({
  children,
  variants,
  className = "",
}) {
  const router = useRouter();
  const { MOBILE, VARIANTS } = getLayout();
  const { height } = useWindowDimensions();

  // bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20

  return (
    <motion.div
      initial="init"
      animate="show"
      exit="hide"
      variants={variants ? variants : VARIANTS}
      // className={MOBILE ? "fixed top-0 left-0 z-50" : ""}
      // style={{
      //   height: MOBILE && router.asPath !== "/" && height + "px",
      // }}
    >
      {children}
    </motion.div>
  );
}
