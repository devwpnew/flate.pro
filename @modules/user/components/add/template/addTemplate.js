import { motion } from "framer-motion";

import Container from "@modules/common/components/container/container";
import getLayout from "helpers/getLayout";
import AddHeader from "../part/addHeader";
import AddForm from "../part/addForm";
import MotionContainer from "@modules/common/components/container/motionContainer";

export default function AddTemplate({ user }) {
  const { DESKTOP, VARIANTS } = getLayout();

  return (
    <MotionContainer
      variants={VARIANTS}
      className={
        !DESKTOP
          ? "bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20"
          : ""
      }
    >
      <AddHeader />

      <Container>
        <AddForm user={user} />
      </Container>
    </MotionContainer>
  );
}
