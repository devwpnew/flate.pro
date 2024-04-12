import Image from "next/image";
import { motion } from "framer-motion";

import closeIcon from "public/icons/close-grey.svg";

export default function Close({onClick}) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick}>
      <Image
        src={closeIcon.src}
        width={closeIcon.width}
        height={closeIcon.height}
      />
    </motion.button>
  );
}
