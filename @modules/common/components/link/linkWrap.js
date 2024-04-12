import Link from "next/link";
import { motion } from "framer-motion";

export default function LinkWrap({ children, href, className = "", style, onClick, ...params }) {
  return (
    <Link href={href}>
      <motion.a
        // whileTap={{ scale: 0.95 }}
        className={className}
        style={style}
        onClick={onClick}
        {...params}
      >
        {children}
      </motion.a>
    </Link>
  );
}
