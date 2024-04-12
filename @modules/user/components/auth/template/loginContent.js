import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "store/global/user/userType";

import Loader from "@modules/common/components/preloader/loader";
import Header from "@modules/layout/components/header/header";
import FooterMini from "@modules/layout/components/footer/footerMini";

import LoginForm from "./part/loginForm";
import LoginText from "./part/loginText";

import getLayout from "helpers/getLayout";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";

export default function LoginContent({ data }) {
  const { DESKTOP, MOBILE, VARIANTS } = getLayout();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.userAuthorized) {
      dispatch(setUser());
    }
  }, []);

  return (
    <motion.div
      initial="init"
      animate="show"
      exit="hide"
      variants={VARIANTS}
      className={!DESKTOP ? "bg-white w-full min-h-screen lg:pb-20" : ""}
    >
      <div className="h-screen relative">
        {MOBILE && <div className="absolute left-0 top-0 w-full"><MobilePageHeader href={"/"} title="Вход" /></div>}

        <div className="h-full overflow-hidden flex flex-col justify-center lg:justify-between">
          {DESKTOP && <Header hideTopBar={true} />}

          <Loader />

          <div className="hidden lg:block text-center">
            <span className="text-[32px] font-bold block">
              Платформа недвижимости для профессионалов
            </span>
          </div>

          <div className="container mx-auto px-[15px] lg:flex lg:justify-between lg:mt-[29px] lg:max-w-[929px]">
            <LoginForm data={data} />
            <LoginText />
          </div>

          {DESKTOP && <FooterMini />}
        </div>
      </div>
    </motion.div>
  );
}
