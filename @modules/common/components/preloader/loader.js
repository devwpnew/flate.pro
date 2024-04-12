import Router from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);
  return (
    <div className="relative z-[99999]">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial="init"
            animate="show"
            exit="hide"
            variants={{
              init: { opacity: 0 },
              show: {
                opacity: 1,
                x: 0,
                transition: {
                  type: "Inertia",
                },
              },
              hide: { opacity: 0 },
            }}
          >
            <div className={"loader-wrapper"}>
              <div className={"loader"}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Loader;
