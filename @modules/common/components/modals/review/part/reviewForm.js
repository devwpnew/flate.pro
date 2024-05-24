import api from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";

import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import Textarea from "@modules/common/components/textarea/textarea";
import Button from "@modules/common/components/button/button";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";
import ReviewVoteItem from "./reviewVoteItem";

import one from "public/review/1.svg";
import two from "public/review/2.svg";
import three from "public/review/3.svg";
import four from "public/review/4.svg";
import five from "public/review/5.svg";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import { useSelector } from "react-redux";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";

export default function ReviewForm({ onClose }) {
  const user = useSelector((state) => state.userLogin.value);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVoteValue, setActiveVoteValue] = useState(null);

  const formRef = useRef();

  const voteArr = [
    { title: "Ужасно", value: 1, icon: one },
    { title: "Плохо", value: 2, icon: two },
    { title: "Нормально", value: 3, icon: three },
    { title: "Хорошо", value: 4, icon: four },
    { title: "Отлично", value: 5, icon: five },
  ];

  const submitHandler = (ev) => {
    ev.preventDefault();

    const isValid = validate();

    if (isValid) {
      sendForm();
    }
  };

  const validate = () => {
    setError(null);

    const formData = new FormData(formRef.current);

    for (const [key, value] of formData) {
      if (key === "text" && value === "") {
        setError(true);
        return false
      }
    }

    return true
  };

  const sendForm = async () => {
    setIsLoading(true);

    const formProps = {
      user_id: user.id,
      status: 1,
    };

    const formData = new FormData(formRef.current);

    for (const [key, value] of formData) {
      formProps[key] = value;
    }

    const res = await api.add.task({
      window_host: window.location.origin,
      ...formProps,
    });

    setIsLoading(false);

    if (res.itemId) {
      setSuccess(true);
    }
  };

  return (
    <>
      {success && (
        <DialogMessage
          isShow={success}
          onClose={onClose}
          title="Спасибо!"
          subtitle="Вы помогаете сделать сервис лучше!"
        />
      )}

      {/* {error && (
        <DialogMessage
          isShow={error}
          onClose={onClose}
          title="Ошибка!"
          subtitle="Пожалуйста заполните поля"
        />
      )} */}

      {!success && (
        <form
          onSubmit={submitHandler}
          onChange={validate}
          ref={formRef}
          className="relative"
        >
          <PreloaderWithBackdrop isShow={isLoading} />

          <div className="mb-5">
            <span className="text-lg">
              Какое у вас впечатление от FLATE.PRO?
            </span>

            <DialogCloseIcon
              onClick={onClose}
              className="absolute top-5 right-5"
            />
          </div>

          <div className="flex flex-row mb-5 justify-between">
            {voteArr.map((el) => (
              <ReviewVoteItem
                isActive={activeVoteValue ? activeVoteValue === el.value : true}
                icon={el.icon}
                title={el.title}
                value={el.value}
                name="vote"
                key={el.value}
                setIsItemActive={setActiveVoteValue}
              />
            ))}
          </div>

          <div className="mb-5">
            {error && <div className="text-red mb-0.5 text-sm">{error}</div>}

            <div className="text-lg mb-2.5">
              Расскажите, почему вы поставили такую оценку?
            </div>

            <TextareaRequired
              name={"text_why"}
              style={`bg-greylight ${
                error ? "border-red" : "border-greyC4"
              } py-2.5`}
              placeholder={"Оставить комментарий"}
            />
          </div>

          <div className="mb-5">
            <div className="text-lg mb-2.5">Есть идея?</div>

            <Textarea
              name={"text_idea"}
              style={"bg-greylight border-greyC4 py-2.5"}
              placeholder={"Что мы можем улучшить для вас?"}
            />
          </div>

          <div className="mb-5">
            <div className="text-lg mb-2.5">Как мы можем с вами связаться?</div>

            <Textarea
              name={"contact"}
              style={"bg-greylight border-greyC4 py-2.5"}
              placeholder={
                "Если это необходимо. Если нет, можете оставить поле пустым."
              }
            />
          </div>

          <div className="flex justify-end">
            <Button
              className={"bg-bluedeep w-auto py-2.5 px-7"}
              isDisabled={error}
              onClick={(ev) => error && ev.preventDefault()}
            >
              Отправить
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
