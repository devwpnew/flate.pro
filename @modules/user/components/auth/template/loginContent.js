import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "store/global/user/userType";

import Loader from "@modules/common/components/preloader/loader";
import Header from "@modules/layout/components/header/header";
import FooterMini from "@modules/layout/components/footer/footerMini";

import LoginForm from "./part/loginForm";
import LoginText from "./part/loginText";

import { FaApple } from "react-icons/fa";
import { BsGooglePlay } from "react-icons/bs";

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
                {MOBILE && (
                    <div className="absolute left-0 top-0 w-full">
                        <MobilePageHeader href={"/"} title="Вход" />
                    </div>
                )}

                <div className="overflow-hidden flex flex-col justify-center lg:justify-between">
                    {DESKTOP && <Header hideTopBar={true} />}

                    <Loader />

                    {/* <div className="hidden lg:block text-center">
            <span className="text-[32px] font-bold block">
              Платформа недвижимости для профессионалов
            </span>
          </div> */}

                    <div className="text-center mt-10 mb-7">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            Скачайте Приложение
                        </h1>
                        <div className="flex gap-5 px-[20px] md:px-0">
                            <div className="w-full">
                                <p className="text-[14px] md:text-[20px] mb-3">
                                    Вся база недвижимости у вас в кармане
                                </p>

                                <div className="flex justify-center items-center gap-3 text-backdrop">
                                    <FaApple className="text-[40px]" />
                                    <BsGooglePlay className="text-[30px]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5">
                        <div className="bg-gradient-to-r from-[#1479F5] to-[#00CF8A] 
						 text-white rounded-2xl container mx-auto lg:flex lg:justify-between items-center lg:max-w-[1020px]">
                          

							<LoginForm data={data} />

						    <div className="flex flex-col md:flex-row justify-center xl:justify-end items-center gap-5 px-[20px] md:px-0">
                                <div className="md:max-w-[250px] py-3">
                                    <div className="text-[14px] md:text-[19px] mb-3 max-w-[300px] md:max-w-[200px]md:max-w-auto text-center md:text-left">
                                        Больше функций в мобильном приложении:

										<div className="flex gap-1.5 flex-wrap text-sm my-4 justify-center md:justify-start">
											<div className="bg-white/15 py-[4px] px-3  rounded-full">шахматки</div>
											<div className="bg-white/15 py-[4px] px-3  rounded-full">каталог ЖК</div>
											<div className="bg-white/15 py-[4px] px-3  rounded-full">аналитика цен</div>
											<div className="bg-white/15 py-[4px] px-3  rounded-full">подборки</div>
										</div>
                                    </div>

                                    <div className="flex gap-3 justify-center md:justify-start">
                                        <a
                                            href={"https://app.flate.pro"}
                                            target={"_blank"}
                                        >
                                            <button className="text-[14px] px-5 py-3 bg-white text-blue rounded-[10px]">
                                                Скачать
                                            </button>
                                        </a>
                                        <div className="hidden md:flex gap-2 text-backdrop items-center">
                                            <FaApple className="text-[30px]" />
                                            <BsGooglePlay className="text-[24px]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-[20px] md:pt-0 md:mr-[50px] md:mt-[30px] mt-auto order-last">
                                    <img
                                        src="/iphone.png"
                                        className="ml-auto mt-auto max-w-[200px] md:max-w-[300px]"
                                    />
                                </div>
                            </div>



                        </div>
                    </div>

                    {DESKTOP && <FooterMini />}
                </div>
            </div>
        </motion.div>
    );
}
