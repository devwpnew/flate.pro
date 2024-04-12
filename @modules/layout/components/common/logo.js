import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import logo from "public/logo.svg";

export default function Logo({ className = "" }) {
  return (
    <Link href="/">
      <motion.a
        href="/"
        whileTap={{ scale: 0.95 }}
        className={`flex flex-col justify-center items-start text-3xl text-blue cursor-pointer ${className}`}
        style={{ width: logo.width, height: logo.height }}
      >
        <Image src={logo.src} width={logo.width} height={logo.height} />
      </motion.a>
    </Link>
  );
}
