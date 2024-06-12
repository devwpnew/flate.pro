import Container from "@modules/common/components/container/container";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";
import H1 from "@modules/common/components/heading/h1";

import { FaApple } from "react-icons/fa";
import { BsGooglePlay } from "react-icons/bs";

export default function SelectionsContent() {
    return (
        <Container>
            {/* <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
                <H1>Подборки</H1>
            </div> */}

            <div className="mt-10 mb-7">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Подборки уже доступные в приложении
                </h1>
                <div className="flex gap-5 px-[20px] md:px-0">
                    <div className="w-full">
                        <p className="text-[14px] md:text-[20px] mb-3">
                            Вся база недвижимости у вас в кармане на iOS и
                            Android
                        </p>

                        <a href={"https://app.flate.pro"} target={"_blank"}>
                            <div className="flex items-center gap-3 text-backdrop">
                                <FaApple className="text-[40px]" />
                                <BsGooglePlay className="text-[30px]" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    );
}
