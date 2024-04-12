import Image from "next/image";
import { useRouter } from "next/router";

import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import BackButton from "@modules/common/components/button/backButton";

import questionIcon from "public/icons/question-primary.svg";

import getLayout from "helpers/getLayout";
import faqData from "helpers/static/faq/faqData";
import { useRef, useState } from "react";
import QuestionsContent from "./questionsContent";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogAnimateWrapper from "@modules/common/components/dialog/dialogAnimateWrapper";
import Textarea from "@modules/common/components/textarea/textarea";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import api from "pages/api/service/api";
import SuccessModal from "@modules/common/components/modals/successModal";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
export default function HelpContent({ user }) {
  const [questions, setQuestions] = useState(null);

  const router = useRouter();
  const data = faqData();
  const formRef = useRef();
  const { MOBILE } = getLayout();

  const [isSuccess, setSuccess] = useState(false);
  const [askDialog, setAskDialog] = useState(false);

  const askSupport = () => {
    if (user) {
      setAskDialog(true);
    } else {
      router.push("/user/profile/auth");
    }
  };

  const sendForm = async (ev) => {
    // setIsLoading(true);

    ev.preventDefault()

    const formProps = {
      user_id: user.id,
      status: 1,
    };

    if (user) {
      formProps["text3"] = user.phone;
    }

    const formData = new FormData(formRef.current);

    for (const [key, value] of formData) {
      if (value) {
        formProps[key] = value;
      }
    }

    const res = await api.add.task({
      window_host: window.location.origin,
      ...formProps,
    });

    // setIsLoading(false);
    // console.log(res);
    if (res.itemId) {
      setSuccess(true);
    }
  };


  function openWaInBlank(e) {
    e.preventDefault();
    const href = `https://wa.me/79899966015`;

    const as = router.asPath;
    window.open(href, "_blank");
  }


  return (
    <>
      {MOBILE && <MobilePageHeader href={"/user/profile"} title="Помощь" />}

      <Container>
        <div className="mb-[80px]">
          {!questions ? (
            <>
              <div className="flex flex-col gap-x-[50px] lg:gap-x-0 gap-y-[80px] md:flex-row md:flex-wrap">
                {data.map((faqItem) => {
                  return (
                    <div className="mb-3 lg:w-1/3" key={faqItem.title}>
                      <div className="flex items-start gap-[6px]">
                        <div className="flex flex-col items-center min-w-[18px] mt-[2px]">
                          <Image
                            src={questionIcon.src}
                            width={18}
                            height={18}
                          />
                        </div>
                        <div className="flex flex-col gap-2.5">
                          <div className="text-base font-bold block mb-[2px]">
                            {faqItem.title}
                          </div>
                          {faqItem.items.map((child) => {
                            return (
                              <div
                                key={child.item.textTitle}
                                className="text-base cursor-pointer hover:text-blue transition-all"
                                onClick={() =>
                                  setQuestions(child.item.textContent)
                                }
                              >
                                {child.item.textTitle}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <QuestionsContent
              questions={questions}
              setQuestions={setQuestions}
            />
          )}
        </div>
        <div className="p-5 rounded max-w-[690px] mx-auto text-center shadow-design">
          <div className="font-bold text-xl mb-5">Служба поддержки</div>

          <div className="text-base mb-5">
            Если вы не нашли решение, напишите в службу поддержки — мы ответим в
            течение суток (постараемся быстрее).
          </div>

          {/* <Button className={"w-auto px-[15px] py-2"} onClick={askSupport}>
            Написать в чат
          </Button> */}

          <Button type={'green'} className={"w-auto px-[15px] py-2 ml-1"} onClick={openWaInBlank}>
            Написать в WA
          </Button>
        </div>
      </Container>

      <Dialog open={askDialog} onClose={() => setAskDialog(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] w-full rounded-[10px]">
            {isSuccess ? (
              <DialogMessage
                title="Успешно"
                subtitle={"Ваш вопрос отправлен. Мы скоро на него ответим."}
                isShow={isSuccess}
                onClose={() => setAskDialog(false)}
              />
            ) : (
              <>
                <DialogAnimateWrapper isShow={askDialog}>
                  <DialogTitle className={"text-center"}>
                    Ваше сообщение
                  </DialogTitle>

                  <form ref={formRef}>
                    <div className="mb-5">
                      <div className="text-lg mb-2.5">Комментарий</div>

                      <Textarea
                        name={"text"}
                        style={`bg-greylight py-2.5`}
                        placeholder={"Комментарий"}
                      />
                    </div>

                    {!user && (
                      <div className="mb-5">
                        <div className="text-lg mb-2.5">
                          Как мы можем с вами связаться?
                        </div>

                        <Textarea
                          name={"text3"}
                          style={"bg-greylight border-greyC4 py-2.5"}
                          placeholder={"Как мы можем с вами связаться?"}
                        />
                      </div>
                    )}

                    <DialogCloseIcon onClick={() => setAskDialog(false)} />

                    <div className="flex justify-center mt-5">
                      <Button
                        onClick={(ev) => {
                          sendForm(ev);
                        }}
                        className={"w-auto px-5 py-2.5"}
                      >
                        Отправить
                      </Button>
                    </div>
                  </form>
                </DialogAnimateWrapper>
              </>
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
