import { AnimatePresence, motion } from "framer-motion";

import PreloaderSpinner from "./preloaderSpinner";

export default function PreloaderWithBackdrop({ isShow }) {
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1 },
  };

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          {...fadeInOut}
          className="w-full h-full absolute left-0 top-0 flex flex-col justify-center items-center backdrop-blur-[1.5px] z-20 rounded"
        >
          <PreloaderSpinner />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
