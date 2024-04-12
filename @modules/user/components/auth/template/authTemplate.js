import { motion } from "framer-motion";

import LinkWrap from "@modules/common/components/link/linkWrap";
import Container from "@modules/common/components/container/container";
import LocationButton from "@modules/location/components/button/button";
import TextAbout from "@modules/user/components/profile/common/textAbout";

import mapIcon from "public/icons/map-grey-solid.svg";

import getLayout from "helpers/getLayout";
import MotionContainer from "@modules/common/components/container/motionContainer";
export default function AuthTemplate() {
  const { DESKTOP, VARIANTS } = getLayout();
  return (
    <MotionContainer
      variants={VARIANTS}
      className={
        !DESKTOP
          ? "bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20 md:relative"
          : ""
      }
    >
      <>
        <div className="md:hidden border-greyborder border-y-[1px] border-solid bg-greylight pt-3 pb-4 text-center mb-2.5">
          <span>Личный кабинет</span>
        </div>

        <div className="hidden md:block">
          <Container>
            <span className="block text-3xl font-bold pb-3 pt-5 border-t border-b border-greyborder mb-5">
              Личный кабинет
            </span>
          </Container>
        </div>

        <Container>
          <div className="md:w-full md:max-w-[290px] md:mx-auto md:text-center md:mb-10">
            <div className="mb-2.5">
              <span className="md:text-sm">Войдите для доступа ко всем функциям сервиса</span>
            </div>

            <LinkWrap href={"./auth/login"}>
              <button className="border border-greyborder text-center py-2 mb-4 w-full">
                <span>Войти или зарегистрироваться</span>
              </button>
            </LinkWrap>
          </div>
        </Container>

        <div className="py-4 border border-greyborder mb-3.5 md:hidden">
          <Container>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={mapIcon.src}
                  width={mapIcon.width}
                  height={mapIcon.height}
                />
                Город
              </div>
              <div className="text-grey">
                <LocationButton arrowIcon={null} arrowIconRight />
              </div>
            </div>
          </Container>
        </div>
        <Container>
          <TextAbout />
        </Container>
      </>
    </MotionContainer>
  );
}
