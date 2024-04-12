import { motion, AnimatePresence } from "framer-motion";

import motionParams from "helpers/static/animation/motionParams";

export default function Tooltip({ isShow, text, ...params }) {

  return (
    <AnimatePresence>
      {isShow && text && (
        <motion.span
          {...motionParams.dropdownParams}
          {...params}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
