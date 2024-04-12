import API from "pages/api/service/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import Image from "next/image";

import Button from "@modules/common/components/button/button";
import Input from "@modules/common/components/input/input";
import Textarea from "@modules/common/components/textarea/textarea";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";

import useravatar from "public/icons/user-avatar.svg";
import Preloader from "@modules/common/components/preloader/preloader";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";

import validate from "helpers/validate/validate";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import Link from "next/link";

export default function RegistrationForm({
  userId,
  setIsRegistrationModalShow,
}) {
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [cities, setCities] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);

  const formRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    (async function fetchData() {
      setIsFetching(true);
      setCities(
        await API.get.cities({
          window_host: window.location.origin,
          select: ["id", "name"],
        })
      );
      setIsFetching(false);
    })();
  }, []);

  useEffect(() => {
    if (avatar && avatar[0]) {
      setAvatarSrc(URL.createObjectURL(avatar[0]));
    }
  }, [avatar]);

  const formSubmitHandler = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    setErrors(false);

    const formData = new FormData(formRef.current);

    const { errors, fieldsWithError } = validate(formData, [
      "id",
      "professional_confirmation",
      // "user_agency",
      "user_name",
    ]);

    setErrors(errors);

    if (!formData.get("id")) {
      setErrors("Произошла ошибка при регистрации, попробуйте снова.");
    }

    const updResponse = await API.update.user(formData); /* send message here */

    if (updResponse?.status) {
      const registerModerationIsOn = await API.get.setting('register_moderation')

      if (registerModerationIsOn == 'Y' && updResponse?.data?.itemId) {
        const sendEmail = await API.sendEmailNotification.newUser(updResponse?.data?.itemId, false, window && window?.location?.origin)

        setIsLoading(false);
        if(!sendEmail?.error) {
          setSuccess(true);
        }
      }
    } else {
      setIsLoading(false);
    }
  };

  const loadPhotoHandler = (ev) => {
    ev.preventDefault();
    fileInputRef.current.click();
  };

  const onSuccess = () => {
    setIsRegistrationModalShow(false);

    router.push({
      pathname: "/user/profile/settings",
      query: { visit: "1" },
    });

    router.reload();
  };

  return (
    <>
      {success ? (
        <div className="px-[15px] mt-10">
          <DialogMessage
            title="Спасибо за регистрацию!"
            subtitle={
              "После модерации, вам будут доступны все возможности и функции. Обычно это занимает не более часа."
            }
            isShow={success}
            onClose={() => onSuccess()}
            hideCloseIcon={true}
          />
        </div>
      ) : (
        <form
          onSubmit={formSubmitHandler}
          ref={formRef}
          className="max-w-[511px] w-full mx-auto bg-greylight px-10 pt-5 pb-10 relative flex flex-col justify-center"
        >
          {isLoading && <PreloaderWithBackdrop isShow={isLoading} />}

          <span className="text-3xl mb-5 font-semibold text-center">
            Для регистрации заполните все обязательные поля
          </span>

          {/* USER */}

          <input type="hidden" name="id" value={userId} />

          {/* LOAD AVATAR */}

          <div className="flex flex-col items-center gap-2.5 mb-[28px]">
            <div className="rounded-full overflow-hidden w-[120px] h-[120px] bg-bluelighter">
              {avatarSrc ? (
                <img
                  className="h-full object-contain object-center"
                  src={avatarSrc}
                  width={useravatar.width}
                  height={useravatar.height}
                />
              ) : (
                <img
                  className="h-full object-contain object-center"
                  src={useravatar.src}
                  width={useravatar.width}
                  height={useravatar.height}
                />
              )}
            </div>

            <Button
              onClick={(ev) => loadPhotoHandler(ev)}
              type={"white"}
              className={`h-[25px] w-[111px]`}
            >
              <span className="text-xs">Загрузить фото</span>
            </Button>

            <input
              ref={fileInputRef}
              onChange={(ev) => setAvatar(ev.target.files)}
              type="file"
              multiple={false}
              name="user_avatar"
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* FIELDS */}

          <div className="flex flex-col gap-[20px]">
            <Input
              topTitle="Имя"
              labelStyle="h-[42px]"
              required={true}
              name="user_name"
            />

            <Input
              topTitle="Фамилия"
              labelStyle="h-[42px]"
              name="user_last_name"
            />

            <Input
              placeholder={
                "Если вы работаете на себя, укажите “Частный брокер”"
              }
              topTitle="Название агентства"
              name="user_agency"
              labelStyle="h-[42px]"
              // required={true}
            />

            <div className="h-[42px]">
              {!isFetching ? (
                <SelectNoAutocomplete
                  options={cities}
                  topTitle="Город"
                  name={"default_city"}
                />
              ) : (
                <div className="w-full h-full">
                  <Preloader />
                </div>
              )}
            </div>

            <Textarea
              areaStyle={"h-full"}
              placeholder={"Например: Ведущий специалист отдела продаж"}
              topTitle="О себе"
              name="user_description"
            />

            <div>
              <p
                className="text-xs leading-[14px] mb-5"
                style={{ color: "#9ca3af" }}
              >
                {/* - Ссылка на: YouTube, Vkontakte <br/>
                - Ссылка на кабинет: Циан, Авито, Domclick <br/>
                - Ссылка на профиль на сайте Агентства Недвижимости <br/> */}
                <Link href="/">
                  <a className="text-bluelight hover:text-blue transition-all">
                    FLATE.PRO
                  </a>
                </Link>{" "}
                - ресурс только для агентов, нам важно сохранить его уникальным.
                Пожалуйста, пришлите как можно больше информации о себе, чтобы
                мы могли точно знать, что вы являетесь агентом.
              </p>
              <Textarea
                areaStyle={"h-full"}
                placeholder={"- Ссылка на: YouTube, Vkontakte\n- Ссылка на кабинет: Циан, Авито, Domclick \n- Ссылка на профиль на сайте Агентства Недвижимости"}
                topTitle="Подтверждение профессиональной деятельности"
                labelStyle="h-[94px] mb-[4px]"
                required={true}
                name="professional_confirmation"
              />
            </div>

            <div className="h-[42px]">
              <Button>
                <span className="font-bold">Сохранить</span>
              </Button>
            </div>
          </div>

          <span className="text-blue">{errors && errors}</span>
        </form>
      )}
    </>
  );
}
