import Image from "next/image";
import { motion } from "framer-motion";

export default function ThemeButton({ icon, width, height }) {
  return (
    <motion.a
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-5 h-5"
    >
      <Image src={icon.src} width={width ? width : icon.width}
        height={height ? height :icon.height} />
    </motion.a>
  );
}
