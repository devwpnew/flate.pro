import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";

import tmp from "public/tmpImage.jpg";
import useUser from "hooks/useUser";
import { useSelector } from "react-redux";
import api from "./api/service/api";
import { useRouter } from "next/router";
import aboutImg from "public/about.jpeg";
export default function About({ data }) {
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
                title={`О компании FLATE.PRO | Ваш надежный партнер в сфере недвижимости Сочи`}
                description={`Узнайте больше о FLATE.PRO, ведущей платформе недвижимости в Сочи. Мы предлагаем широкий спектр услуг по покупке, продаже и аренде недвижимости. Звоните - +79226960990.`}
            />
            <MotionContainer>
                <Container>
                    <div className="pt-3 pb-2.5 text-center">
                        <H1>О компании</H1>
                    </div>
                    <div className="mt-5 flex flex-wrap lg:flex-nowrap items-start gap-5">
                        <div className="max-w-[700px] text-sm">
                            <p className="mb-3">
                            	Многие думают, что жизнь агента проста и весела -
	                            созвонился с клиентом → встретил в аэропорту →
	                            привез на объект → получил комиссию. И все это за
	                            один день.
                            </p>
                            
                            <p className="mb-3">
                            	Мы с вами знаем, что это не так, за поверхностной
	                            работой - огромный труд, который не виден. Тысячи
	                            часов в год, на рутину и отработку возражений,
	                            жесточайшая конкуренция, это все про рынок
	                            недвижимости. Рынок, где выживает сильнейший.
	                            Огромная текучка не взялась из ниоткуда, это прямой
	                            результат неэффективных действий. Действий, тратя
	                            время на которые вы отодвигаете себя от результата,
	                            хотя на поверхности лежит убеждение, что вы
	                            работаете, а значит делаете все правильно. Работа
	                            должна быть тяжела, ведь деньги достаются только
	                            тем, кто усердно работает. Это не всегда так! Зачем
	                            страдать, если можно не страдать? С большой долей
	                            вероятности, вы знаете человека, которому достался
	                            клиент, комиссия от которого составила несколько
	                            миллионов и это было легко и непринужденно, все были
	                            счастливы. Я лично, знаю таких ребят и не одного и
	                            не двух, их много.
                            </p>
                            
                            <p className="mb-3">
                            	Создавая FLATE, мы хотели, чтобы вы сами ощутили,
	                            как оказывается все может быть просто: зашел →
	                            увидел → предложил → продал. Но FLATE не сделает
	                            продажу за вас, это нужно понимать. Он освободит для
	                            вас время - самый ценный ресурс в наше время. Это
	                            время вы можете потратить на привлечение новых
	                            клиентов, улучшение своих навыков продаж или на
	                            себя. Мы создали его для этого и именно так он
	                            устроен.
                            </p>
                            
                            <p className="mb-3">
                            	У нас есть план на год вперед, улучшать и
	                            дорабатывать проект. То, что есть сейчас - это
	                            только 30% от задуманного, со временем, вы сами все
	                            увидите. Главное то, что это уже работает и приносит
	                            пользу. Нам нужны вы - наши пользователи! Это было
	                            сделано для вас!
                            </p>
                           
                            <i className="font-bold">
                                С уважением. Олег, один из основателей
                                FLATE.PRO Мы открыты для идей и сотрудничества.
                                Вы всегда можете написать нам на почту
                            </i>{" "}
                            <a
                                className="text-blue hover:text-bluelight"
                                href="mailto:help@flate.pro"
                            >
                                help@flate.pro
                            </a>{" "}
                            или в{" "}
                            <button
                                className="text-blue hover:text-bluelight"
                                onClick={openWaInBlank}
                            >
                                WhatsApp
                            </button>
                            .
                        </div>
                        {/* <img src={aboutImg.src} className="max-w-[487px]" /> */}
                    </div>

                    {/* <div className="flex flex-wrap gap-5 mt-10 w-full">
            <img src={tmp.src} className="w-[386px]" />
            <img src={tmp.src} className="w-[386px]" />
            <img src={tmp.src} className="w-[386px]" />
          </div> */}
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
