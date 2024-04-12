import { motion, AnimatePresence } from "framer-motion";

export default function RightSlideWrapper({ children, state }) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, x: "+100%" }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              type: "Inertia",
            },
          }}
          exit={{ opacity: 0, x: "+100%" }}
          className="bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
