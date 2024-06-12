import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import { useSelector } from "react-redux";
import useUser from "hooks/useUser";
import api from "./api/service/api";
import SEO from "@modules/common/components/seo/seo";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";
import Button from "@modules/common/components/button/button";
import { useRouter } from "next/router";

export default function Marketing({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const user = useUser(data.user, "/user/profile/auth");

  const router = useRouter();

  function openWaInBlank(e) {
    e.preventDefault();
    const href = `https://wa.me/79899966015`;

    const as = router.asPath;
    window.open(href, "_blank");
  }

  return (
    <>
      <SEO
        title={`Реклама на сайте – база объявлений FLATE.PRO`}
        description={`Реклама на сайте объявлений FLATE.PRO – площадке объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи. 
        Помощь – база объявлений FLATE.PRO`}
      />
      <MotionContainer>
        <Container>
          <FallbackDevelopment
            img={
              <svg
                className="inline-block"
                width="207"
                height="187"
                viewBox="0 0 207 187"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M143.073 104.382C143.74 106.001 144.008 107.757 143.854 109.501C143.701 111.246 143.131 112.928 142.191 114.406C141.252 115.884 139.971 117.114 138.456 117.993C136.942 118.873 135.239 119.375 133.489 119.459L73.7079 122.439L84.8694 149.379C85.6243 150.809 85.7901 152.477 85.3315 154.028C84.8729 155.578 83.8262 156.888 82.415 157.677L72.3054 161.826C71.5391 162.094 70.7255 162.2 69.9162 162.136C69.107 162.072 68.3199 161.84 67.6052 161.455C66.8905 161.071 66.2638 160.541 65.7651 159.901C65.2663 159.26 64.9065 158.523 64.7085 157.735L53.021 128.984L49.3979 130.504C47.8906 131.135 46.2733 131.462 44.6392 131.465C43.0051 131.469 41.3864 131.149 39.8764 130.524C38.3664 129.9 36.9949 128.983 35.8408 127.826C34.6868 126.669 33.7731 125.295 33.1522 123.783L25.9644 106.252C25.3321 104.741 25.0044 103.119 25 101.481C24.9957 99.8425 25.3149 98.2194 25.9393 96.7046C26.5636 95.1899 27.4809 93.8133 28.6384 92.6538C29.796 91.4944 31.171 90.5748 32.6847 89.948L51.4432 82.1758L99.9463 38.0555C101.238 36.845 102.807 35.9684 104.515 35.5021C106.223 35.0357 108.019 34.9936 109.747 35.3796C111.475 35.7655 113.082 36.5677 114.43 37.7164C115.777 38.8651 116.823 40.3256 117.478 41.9708L143.073 104.382ZM142.781 68.2092C143.219 69.2764 143.964 70.1899 144.921 70.8347C145.877 71.4795 147.004 71.8266 148.157 71.8324C148.939 71.8178 149.712 71.6593 150.436 71.3649L173.402 61.8395C174.834 61.256 175.976 60.1289 176.578 58.705C177.181 57.2811 177.194 55.6765 176.616 54.2427C176.328 53.5267 175.9 52.875 175.358 52.3252C174.816 51.7755 174.17 51.3386 173.459 51.0397C172.747 50.7409 171.983 50.586 171.211 50.5841C170.439 50.5822 169.674 50.7333 168.961 51.0286L145.937 60.5539C145.226 60.8482 144.58 61.2799 144.037 61.8242C143.493 62.3686 143.062 63.015 142.769 63.7262C142.476 64.4375 142.326 65.1996 142.328 65.9689C142.33 66.7382 142.484 67.4996 142.781 68.2092ZM175.448 82.6433L150.553 81.533C149.003 81.471 147.492 82.0272 146.353 83.0793C145.213 84.1314 144.538 85.5931 144.476 87.143C144.414 88.6928 144.97 90.2038 146.022 91.3436C147.074 92.4833 148.536 93.1585 150.086 93.2205L174.922 94.3308H175.214C176.764 94.3308 178.25 93.7151 179.346 92.6192C180.442 91.5233 181.058 90.0369 181.058 88.487C181.058 86.9372 180.442 85.4508 179.346 84.3549C178.25 83.259 176.764 82.6433 175.214 82.6433H175.448ZM134.191 54.2427C135.724 54.2362 137.193 53.6276 138.281 52.548L155.813 35.0167C156.913 33.9163 157.531 32.4239 157.531 30.8677C157.531 29.3115 156.913 27.819 155.813 26.7186C154.712 25.6182 153.22 25 151.663 25C150.107 25 148.615 25.6182 147.514 26.7186L129.983 44.2498C129.159 45.0672 128.597 46.1115 128.369 47.2496C128.14 48.3876 128.256 49.5679 128.701 50.6399C129.146 51.7119 129.901 52.6271 130.868 53.2687C131.835 53.9104 132.972 54.2494 134.132 54.2427H134.191Z"
                  fill="#A5D2FB"
                />
              </svg>
            }
            text={
              <>
                Если у вас классный продукт, который будет полезен сообществу -
                напишите нам в WhatsApp. Мы всегда открыты для сотрудничества.{" "}
                <br />
                <br />
                <Button
                  type={"green"}
                  className={"w-auto px-[15px] py-2 ml-1"}
                  onClick={openWaInBlank}
                >
                  Написать в WhatsApp
                </Button>
              </>
            }
          />
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
