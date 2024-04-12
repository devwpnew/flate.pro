import { AnimatePresence, motion } from "framer-motion";

import motionParams from "helpers/static/animation/motionParams";

export default function DialogAnimateWrapper({ children, className, isShow }) {
  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          {...motionParams.fadeParams}
          className={className ? className : "relative bg-white"}
        >
          {children}          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
