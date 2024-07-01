import API from "pages/api/service/api";
import axios from "axios";

import { phoneMask, phoneMaskV2 } from "lib/tools/mask";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Button from "@modules/common/components/button/button";
import Input from "@modules/common/components/input/input";
import Textarea from "@modules/common/components/textarea/textarea";

import MaskInput from "react-maskinput";

import Preloader from "@modules/common/components/preloader/preloader";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import InputRequired from "@modules/common/components/input/inputRequaired";

import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";

import galleryIcon from "public/icons/gallery-icon.svg";

import getLayout from "helpers/getLayout";
import SettingsSelectNewPhone from "../button/settingsSelectNewPhone";
import Tooltip from "@modules/common/components/tooltip/tooltip";

import SelectOrCreateAgency from "@modules/common/components/select/selectOrCreateAgency";

export default function SettingsForm({
    isAdmin,
    user,
    containerClassName,
    blockClassName,
    formRef,
}) {
    const { MOBILE } = getLayout();

    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const [isShowAgencyTooltip, setIsShowAgencyTooltip] = useState(false);
    const [isShowEmailTooltip, setIsShowEmailTooltip] = useState(false);

    const [phoneConfirmationOpen, setPhoneConfirmationOpen] = useState(false);

    const [isCanEmailSent, setIsCanEmailSent] = useState(!user.email_confirmed);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [userNewPhone, setUserNewPhone] = useState({});
    const [phoneStep, changePhoneStep] = useState("1");

    const [inputOTP, setOTPCode] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [cities, setCities] = useState(null);

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

    if (!formRef) {
        formRef = useRef();
    }

    useEffect(() => {
        if (isOpen == true) {
            setTimeout(() => {
                setIsOpen(false);
            }, 2500);
        }
    }, [isOpen]);

    const router = useRouter();

    const changeUserPhone = async () => {
        if (typeof userNewPhone.value == "undefined") {
            console.log("phone обязательный");
        }

        if (!(user && user.id)) {
            console.log("user id обязательный");
        }

        if (typeof inputOTP.value == "undefined") {
            console.log("код обязательный");
        }

        const smsAxios = await axios.post(
            `${window.location.origin}/api/user/checkSmsCode`,
            {
                userId: user && user.id,
                userInputOtp: inputOTP.value,
            }
        );

        if (smsAxios.data.response == "correct") {
            const res = await API.set.userPhone({
                user: user,
                phone: userNewPhone.value,
                window_host: window.location.origin,
            });

            if (res.itemId) {
                setShow(true);
            }
        }
    };

    const sendPhoneConfirmation = async () => {
        if (
            typeof userNewPhone == "undefined" ||
            userNewPhone.value.length < 20
        ) {
            console.log("phone обязательный");
        } else {
            const smsAxios = await axios.post(
                `${window.location.origin}/api/user/sendSmsCode`,
                {
                    phone: userNewPhone.value,
                    user_id: user.id,
                    window_host: window.location.origin,
                    type: "changePhone",
                }
            );
            if (!smsAxios.error) {
                changePhoneStep("2");
            }
        }
    };

    const sendEmailConfirm = async () => {
        const formData = new FormData(formRef.current);
        setEmailError(false);
        const res = await API.set.userEmail({
            window_host: window.location.origin,
            user: user,
            email: formData.get("email"),
        });

        if (!res?.error) {
            setEmailSent(true);
        } else {
            setEmailError(res.error);
        }
    };

    const saveUserSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(formRef.current);
        const data = {};

        for (const [key, value] of formData) {
            if (data[key] == "professional_confirmation" && value) {
                data[key] = value;
            } else {
                data[key] = value;
            }
        }

        data.agency_id = selectedAgencyId

        if(!data?.send_app_pushes_to_whatsapp) {
            data.send_app_pushes_to_whatsapp = "false"
        }

        const res = await API.update.user(data);

        if (res?.error) {
            setError(res.error);
        }

        setIsLoading(false);
        setIsOpen(true);

        if (!res?.error) {
            router.push("/");
        }
    };

    const emailChangeHandler = (ev) => {
        if (
            ev.target.value.length > 0 &&
            ev.target.value.includes("@") &&
            ev.target.value.includes(".")
        ) {
            setIsCanEmailSent(true);
        } else {
            setIsCanEmailSent(false);
        }
    };

    useEffect(() => {
        if (user) {
            if (
                user?.email?.length > 0 &&
                user?.email?.includes("@") &&
                user?.email?.includes(".")
            ) {
                setIsCanEmailSent(true);
            } else {
                setIsCanEmailSent(false);
            }
        }
    }, [user]);

    const onAgencyHelpHover = (event) => {
        if (event?.type === "mouseleave") {
            setIsShowAgencyTooltip(false);
        } else {
            setIsShowAgencyTooltip(true);
        }
    };

    const onEmailHelpHover = (event) => {
        if (event?.type === "mouseleave") {
            setIsShowEmailTooltip(false);
        } else {
            setIsShowEmailTooltip(true);
        }
    };





    const [selectedAgencyId, setSelectedAgencyId] = useState(null);

    useEffect(() => {
        if (user) {
            setSelectedAgencyId(user.agency_id);
        }
    }, [user]);


    const handleSelectAgency = (agencyId) => {
        setSelectedAgencyId(agencyId);
    };





    return (
        <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
            <form
                onSubmit={saveUserSubmit}
                ref={formRef}
                className={`relative gap-x-5 lg:grid lg:grid-cols-2 ${
                    containerClassName ? containerClassName : ""
                }`}
            >
                <PreloaderWithBackdrop isShow={isLoading} />
                <input type="hidden" name="id" value={user && user.id} />
                <div className={`mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <InputRequired
                        topTitle={"Имя"}
                        style={"w-full h-11"}
                        type={"text"}
                        name="user_name"
                        defaultValue={user && user.user_name}
                        placeholder={"Имя"}
                        required={true}
                    />
                </div>
                <div className={`mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <Input
                        topTitle={"Фамилия"}
                        style={"w-full h-11 border-greyborder"}
                        type={"text"}
                        name="user_last_name"
                        defaultValue={user && user.user_last_name}
                        placeholder={"Фамилия"}
                    />
                </div>
                <div
                    className={`relative mb-4 ${
                        blockClassName ? blockClassName : ""
                    }`}
                >
                    {/* <Input
                        topTitle={
                            <div
                                className="inline-flex gap-1 items-center cursor-pointer"
                                onMouseOver={onAgencyHelpHover}
                                onMouseLeave={onAgencyHelpHover}
                            >
                                Название агентства
                                <div className="w-4 h-4 bg-greyA0 rounded-full text-center text-white">
                                    ?
                                </div>
                            </div>
                        }
                        placeholder={"Название агентства"}
                        style={"w-full h-11 border-greyborder"}
                        type={"text"}
                        name="user_agency"
                        defaultValue={user && user.user_agency}
                    /> */}



                    <div>
                        <h1 className="text-xs mb-2">Выберите агентство или создайте новое</h1>
                        {/* {selectedAgencyId} */}
                        {/* {JSON.stringify(user)} */}
                        <SelectOrCreateAgency 
                            name="agency_id"
                            onSelectAgency={handleSelectAgency} 
                            initialAgencyId={selectedAgencyId} 
                        />
                    </div>

                

                    <Tooltip
                        text={
                            "Если вы работаете на себя, укажите “Частный брокер”"
                        }
                        className={`inline-table bg-greyA0 text-xs text-white rounded px-1 whitespace-nowrap absolute mx-auto -top-5 -right-6 z-10 text-center`}
                        isShow={isShowAgencyTooltip}
                        onMouseOver={onAgencyHelpHover}
                        onMouseLeave={onAgencyHelpHover}
                    />
                </div>
                <div className={`mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <div className="h-12">
                        {!isFetching ? (
                            <SelectNoAutocomplete
                                topTitle={"Город"}
                                options={cities}
                                name={"default_city"}
                                defaultValue={user?.default_city?.id}
                            />
                        ) : (
                            <div className="w-full h-full">
                                <Preloader />
                            </div>
                        )}
                    </div>
                </div>
                <div className={`mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <div className="h-12">
                        <Input
                            textLeft={"flate.pro/users/"}
                            topTitle={"Юзернейм"}
                            placeholder={(user && user.sef_code) || user.id}
                            style={"w-full h-11 border-greyborder"}
                            type={"text"}
                            name="sef_code"
                            // defaultValue={(user && user.sef_code) || user.id}
                        />
                    </div>
                    <p
                        className="text-xs leading-[14px] mt-1"
                        style={{ color: "#9ca3af" }}
                    >
                        Вы можете поделиться ссылкой на все свои объявления в
                        разделе “Мои объявления”
                    </p>
                </div>
                <div className={`mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <SettingsSelectNewPhone
                        user={user}
                        name={"phone"}
                        topTitle={"Номер телефона"}
                        style={"w-full h-11 border-greyborder"}
                    />
                    {/* <InputRequired
            topTitle={"Номер телефона"}
            style={"w-full h-11 border-greyborder"}
            type={"text"}
            name="phone"
            disabled={true}
            onChange={(e) => {
              e.target.value = e.target.value
                ? phoneMask(e.target.value)
                : e.target.value;
            }}
            defaultValue={user && user.phone}
            // passed={user && user.phone_confirmed}
          />
          <div
            className="text-xs text-blue cursor-pointer pl-[3px]"
            onClick={() => {
              setPhoneConfirmationOpen(true);
            }}
          >
            Сменить номер телефона
          </div> */}
                </div>
                <div
                    className={`relative mb-4 ${
                        blockClassName ? blockClassName : ""
                    }`}
                >
                    <Input
                        topTitle={
                            <div
                                className="inline-flex gap-1 items-center cursor-pointer relative"
                                onMouseOver={onEmailHelpHover}
                                onMouseLeave={onEmailHelpHover}
                            >
                                Электронный адрес
                                <div className="w-4 h-4 bg-greyA0 rounded-full text-center text-white">
                                    ?
                                </div>
                            </div>
                        }
                        onChange={emailChangeHandler}
                        style={"w-full h-11"}
                        type={"mail"}
                        name="email"
                        defaultValue={user && user.email}
                        passed={user && user.email_confirmed}
                    />

                    <Tooltip
                        text={
                            "Мы будем присылать вам только важные уведомления"
                        }
                        className={`inline-table bg-greyA0 text-xs text-white rounded px-1 whitespace-nowrap absolute mx-auto -top-6 -right-6 z-10 text-center`}
                        isShow={isShowEmailTooltip}
                        onMouseOver={onEmailHelpHover}
                        onMouseLeave={onEmailHelpHover}
                    />

                    {!isCanEmailSent && (
                        <div className="text-xs text-red cursor-pointer pl-[3px]">
                            Пожалуйста введите корректный e-mail адрес
                        </div>
                    )}

                    {isCanEmailSent && emailSent == false && (
                        <div
                            className="text-xs text-blue cursor-pointer pl-[3px]"
                            onClick={sendEmailConfirm}
                        >
                            Отправить письмо с подтверждением
                        </div>
                    )}
                    {emailError && (
                        <div className="text-xs text-red pl-[3px]">
                            {emailError}
                        </div>
                    )}
                    {emailSent == true && (
                        <div className="text-xs text-blue pl-[3px]">
                            Отправлено
                        </div>
                    )}
                </div>

               


                






                <div className={`col-span-2 mb-4 ${blockClassName ? blockClassName : ""}`}>
                    <Textarea
                        topTitle={"О себе"}
                        style={"w-full"}
                        areaStyle={"h-[120px]"}
                        defaultValue={user && user.user_description}
                        name="user_description"
                        placeholder={
                            "Например: Ведущий специалист отдела продаж."
                        }
                    />
                </div>

                




                <div>
                    <div className="mb-1 text-xs">Отправлять сообщения на WhatsApp</div>
                    <div>
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                name="send_app_pushes_to_whatsapp"
                                type="checkbox"
                                defaultChecked={user?.send_app_pushes_to_whatsapp}
                                // checked={user?.send_app_pushes_to_whatsapp}
                                defaultValue={true}
                            />
                            <span>WhatsApp</span>
                        </div>
                    </div>
                </div>




                {isAdmin ? (
                    <div
                        className={`mt-5 col-span-2 mb-4 ${
                            blockClassName ? blockClassName : ""
                        }`}
                    >
                        <TextareaRequired
                            topTitle={
                                "Подтверждение профессиональной деятельности"
                            }
                            areaStyle={"h-full col-span-2"}
                            placeholder={
                                "- Ссылка на: YouTube, Vkontakte\n- Ссылка на кабинет: Циан, Авито, Domclick \n- Ссылка на профиль на сайте Агентства Недвижимости"
                            }
                            labelStyle="h-[94px]"
                            name="professional_confirmation"
                            defaultValue={
                                user && user.professional_confirmation
                            }
                            required={true}
                        />

                        {/* <div className="mt-5">
                            <div className="font-bold mb-2.5 text-sm">
                              Присылать уведомления в WhatsApp?
                            </div>
                            <div>
                                <SelectNoAutocomplete
                                    style={
                                        "w-full h-[43px] border-greyborder border"
                                    }
                                    nullable={true}
                                    options={[
                                        {
                                            name: "Да",
                                            id: 1,
                                        },
                                        {
                                            name: "Нет",
                                            id: 0,
                                        },
                                    ]}
                                    name={"whatsapp_allowed"}
                                    defaultValue={"Нет"}
                                />
                            </div>
                        </div> */}

                        {/* <TextareaRequired
            topTitle={"Подтверждение профессиональной деятельности"}
            areaStyle={"h-full"}
            placeholder={"Вставьте все ссылки в это поле"}
            labelStyle="h-[94px]"
            name="professional_confirmation"
            defaultValue={user && user.professional_confirmation}
            required={true}
          />
          <p
            className="text-xs leading-[14px] mt-1"
            style={{ color: "#9ca3af" }}
          >
            Ссылка на: YouTube, Vkontakte <br />
            Ссылка на кабинет: Циан, Авито, Домклик <br />
            Ссылка на профиль на сайте Агентства недвижимости <br />
            Телефон коллеги, кто может подтвердить ваш статус агента. <br />
          </p> */}
                    </div>
                ) : (
                    ""
                )}
                {!router.asPath === "/user/profile/settings" && (
                    <div
                        className={`mb-10 ${
                            blockClassName ? blockClassName : ""
                        }`}
                    >
                        <div className="text-xs">Добавьте фото профиля</div>
                        <label className="flex justify-center text-sm text-white w-full h-full rounded md:text-black font-normal bg-blue  hover:underline underline-offset-2">
                            <div className="px-[13px] flex items-center justify-center gap-2.5">
                                <div>
                                    <Image
                                        src={galleryIcon.src}
                                        width={galleryIcon.width}
                                        height={galleryIcon.height}
                                    />
                                </div>
                                <div>Добавить фото</div>
                            </div>
                            <input
                                type="file"
                                multiple={false}
                                name="user_avatar"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
                <div className="flex items-end justify-end col-span-2">
                    <Button className={"p-2.5 w-auto h-auto"}>
                        Сохранить изменения
                    </Button>
                </div>
            </form>

            <Dialog
                open={phoneConfirmationOpen}
                onClose={() => setPhoneConfirmationOpen(false)}
            >
                <div className="fixed inset-0 bg-backdrop z-50">
                    <div className="h-screen flex justify-center items-center">
                        <Dialog.Panel
                            className={
                                "mx-[16px] md:mx-auto bg-white p-5 rounded-[10px] relative max-w-[660px] w-full"
                            }
                        >
                            <Dialog.Title
                                className={
                                    "text-3xl font-extrabold text-center mb-5 block"
                                }
                            >
                                Сменить номер телефона
                            </Dialog.Title>

                            <div className="flex flex-col	 items-center flex-wrap">
                                <div className="mb-5 text-center">
                                    {phoneStep == 1 &&
                                        "Введите новый номер телефона"}
                                    {phoneStep == 2 && (
                                        <>
                                            {`Сейчас на номер ${userNewPhone.value} поступит звонок.`}
                                            <br />
                                            {`Введите последние 4 цифры звонившего номера`}
                                        </>
                                    )}
                                </div>
                                {phoneStep == 1 && ( // Первый шаг
                                    <>
                                        <MaskInput
                                            // alwaysShowMask
                                            placeholder="+7 (000) 000-00-00"
                                            onValueChange={(masked) => {
                                                setUserNewPhone(masked);
                                            }}
                                            maskChar="_"
                                            defaultValue={
                                                userNewPhone.value
                                                    ? userNewPhone.value
                                                    : false
                                            }
                                            mask={"+7 (000) 000-00-00"}
                                            className="border-greyborder border rounded bg-white undefined h-11 outline-none px-2.5"
                                        />
                                        <Button
                                            className="mt-5 h-9 max-w-[250px]"
                                            onClick={() => {
                                                sendPhoneConfirmation();
                                            }}
                                        >
                                            Продолжить
                                        </Button>
                                    </>
                                )}
                                {phoneStep == 2 && ( // Второй шаг
                                    <>
                                        <MaskInput
                                            // alwaysShowMask
                                            placeholder="+7 (000) 000-00-00"
                                            onValueChange={(val) => {
                                                setOTPCode(val);
                                            }}
                                            maskChar="_"
                                            mask={"0000"}
                                            className="border-greyborder border rounded bg-white undefined h-11 outline-none px-2.5"
                                        />
                                        <Button
                                            className="mt-5 h-9 max-w-[250px]"
                                            onClick={() => {
                                                changeUserPhone();
                                            }}
                                        >
                                            Подтвердить
                                        </Button>
                                        <Button
                                            className="mt-5 h-9 max-w-[250px]"
                                            onClick={() => {
                                                changePhoneStep(1);
                                            }}
                                        >
                                            Назад
                                        </Button>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    setPhoneConfirmationOpen(
                                        !phoneConfirmationOpen
                                    )
                                }
                                className="absolute top-5 right-5"
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99946 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99946 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
                                        fill="#ABABAB"
                                    />
                                </svg>
                            </button>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogWrapper>
                    <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
                        <DialogMessage
                            isShow={isOpen}
                            onClose={() => setIsOpen(false)}
                            title={error ? "Ошибка" : "Успешно"}
                            subtitle={
                                error
                                    ? error
                                    : "Настройки профиля успешно изменены"
                            }
                        />
                    </Dialog.Panel>
                </DialogWrapper>
            </Dialog>
        </div>
    );
}
