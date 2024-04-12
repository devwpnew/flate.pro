import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";
import api from "./api/service/api";
import { useSelector } from "react-redux";
import useUser from "hooks/useUser";
import Link from "next/link";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";
import LoginText from "@modules/user/components/auth/template/part/loginText";

// import regBanner from "public/reg-banner.jpg";
import appPreviewBanner from "public/appPreviewBanner.png";
import appstore from "public/appstore.png";
import googleplay from "public/googleplay.png";
import H2 from "@modules/common/components/heading/h2";
import Image from "next/image";

export default function Contacts({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const user = useUser(data.user);

  return (
    <>
      <SEO
        title={`Скачать приложение – база объявлений FLATE.PRO`}
        description={`Приложение базы объявлений FLATE.PRO: cкачать в AppStore или Google Play`}
      />
      <MotionContainer>
        <Container>
          <div className="flex help-start gap-4 md:mt-4 lg:mt-5">
            <div className="mx-auto">
              <div className="md:block order-1">
                <div className="text-center mt-[29px] mb-[10px] lg:mt-0">
                  <H2 className={"lg:font-bold sm:mb-0 text-wrap"}>
                    Скачайте Приложение
                  </H2>
                </div>
                <div className="max-w-[385px] mx-auto mb-[22px] text-center text-md">
                  <p>Вся база недвижимости у вас в кармане</p>
                </div>

                {/* <Link href={'/app'}> */}
                <div className="flex items-center justify-center flex-wrap gap-[18px] mb-[30px]">
                  <a
                    href="https://apps.apple.com/ru/app/flate/id6458738854"
                    target="_blank"
                  >
                    <Image
                      src={appstore.src}
                      width={appstore.width}
                      height={appstore.height}
                      className="cursor-pointer"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=flate.pro"
                    target="_blank"
                  >
                    <Image
                      src={googleplay.src}
                      width={googleplay.width}
                      height={googleplay.height}
                      className="cursor-pointer"
                    />
                  </a>
                </div>
                {/* </Link> */}

                <div className="lg:flex justify-center mb-20 max-w-[443px]">
                  <Image
                    src={appPreviewBanner.src}
                    width={appPreviewBanner.width}
                    height={appPreviewBanner.height}
                    className="mx-auto"
                  />
                  {/* <Image
                    src={regBanner.src}
                    width={regBanner.width}
                    height={regBanner.height}
                    className="mx-auto"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </MotionContainer>
    </>
  );
}
export async function getServerSideProps(context) {
  require("dotenv").config();
  const { section_slug } = context.query;

  let data = {};

  const { req, res } = context;
  const window_host = process.env.DOMEN;

  const user = await api.auth.isUserAuthorized(req, res);

  if (user) {
    data["user"] = user;
  }

  return { props: { data } };
}
