import H1 from "@modules/common/components/heading/h1";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import Button from "@modules/common/components/button/button";

import UserProps from "@modules/user/components/profile/common/userProps";
import BackButton from "@modules/common/components/button/backButton";
import getLayout from "helpers/getLayout";

export default function adminproductEditContent({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();
  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Редактировать объявление</H1>
      </div>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10  mt-2.5">
        <div className="flex justify-end w-full">
          <div className="w-[130px] h-[33px]">
            <Button>Сохранить</Button>
          </div>
        </div>
      </div>
    </MotionContainer>
  );
}
