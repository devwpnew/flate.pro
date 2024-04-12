import { motion } from "framer-motion";
import H1 from "@modules/common/components/heading/h1";

import Container from "@modules/common/components/container/container";
import HelpContent from "./helpContent";

import getLayout from "helpers/getLayout";
import MotionContainer from "@modules/common/components/container/motionContainer";

export default function HelpTemplate({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  return (
    <MotionContainer
      variants={VARIANTS}
      className={
        !DESKTOP
          ? "bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20"
          : ""
      }
    >
      {MOBILE ? (
        <HelpContent user={user} />
      ) : (
        <Container>
          <div className="flex help-start gap-4 md:mt-4 lg:mt-5">
            <div className="flex flex-col w-full">
              <H1 additionalClass="text-center mb-[60px]">Помощь</H1>

              <HelpContent user={user} />
            </div>
          </div>
        </Container>
      )}
    </MotionContainer>
  );
}
