import { useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Container from "@modules/common/components/container/container";
import LoginContent from "./loginContent";

import slideArrowBack from "public/icons/slide-arrow-left.svg";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import getLayout from "helpers/getLayout";

export default function LoginTemplate({ data }) {
  const router = useRouter();
  const { MOBILE } = getLayout();

  return (
    <>
      {/* <div className="hidden md:block pb-3 pt-5 mb-5 lg:hidden">
        <Container>
          <span className="text-3xl font-bold border-b border-greyborder block text-center">
            Личный кабинет
          </span>
        </Container>
      </div> */}
      <LoginContent data={data} />
    </>
  );
}
