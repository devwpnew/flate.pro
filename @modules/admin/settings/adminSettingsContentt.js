import api from "pages/api/service/api";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setFetchState } from "store/global/helpers/fetchTrigger";

import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";

import Checkbox from "@modules/common/components/checkbox/checkbox";
import Input from "@modules/common/components/input/input";
import Button from "@modules/common/components/button/button";
import Preloader from "@modules/common/components/preloader/preloader";

export default function AdminSettingsContent() {
  const router = useRouter();
  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({});

  const [form, setForm] = useState({});
  const [subsPriceShow, setSubsPriceShow] = useState(false);
  const [registerModeration, setRegisterModeration] = useState(false);

  const saveSettings = async () => {
    const formattedFields = await formateForm(form);

    await updateSettings(formattedFields);

    await getForm();
  };

  const updateSettings = async (fields) => {
    setIsLoading(true);

    // console.log('settingsObj', fields);

    const res = await api.update.settings(fields);

    // console.log('res', res);

    setIsLoading(false);
    

    dispatch(setFetchState(!fetchState));
  };

  const formateForm = async (form) => {
    let newFields = { ...form };

    for (const property in newFields) {
      if (newFields[property] === true) {
        newFields[property] = "Y";
      }

      if (newFields[property] === false) {
        newFields[property] = "N";
      }
    }

    return newFields;
  };

  const getForm = async () => {
    setIsLoading(true);
    
    const pMod = await api.get.setting("product_moderation");
    const rcsMod = await api.get.setting("rcs_moderation");
    const uSubs = await api.get.setting("user_subscriptions");
    const uSubsPrice = await api.get.setting("user_subscription_price");
    const regMod = await api.get.setting("register_moderation");

    const settingsObj = {};

    if (pMod) {
      settingsObj["product_moderation"] = pMod;
    }

    if (rcsMod) {
      settingsObj["rcs_moderation"] = rcsMod;
    }

    if (uSubs) {
      settingsObj["user_subscriptions"] = uSubs;
    }

    if (uSubsPrice) {
      settingsObj["user_subscription_price"] = uSubsPrice;
    }

    if(regMod){
      settingsObj["register_moderation"] = regMod;
    }

    
    setSettings(settingsObj);

    setSubsPriceShow(uSubs);
    
    setIsLoading(false);

    return true
  };

  useEffect(() => {
    (async function fetchSettings() {
      await getForm();
    })();
  }, []);

  // console.log(settings); 
  
  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Настройки</H1>
      </div>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10 mt-2.5">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-[200px]">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="flex gap-5">
              <div className="flex flex-col w-1/2">
                <div className="flex items-center justify-between gap-2.5 mb-5 w-[320px]">
                  <span className="font-bold text-sm">
                    Модерация объявлений:
                  </span>
                  <Checkbox
                    defaultValue={settings?.product_moderation === "Y"}
                    formFields={form}
                    formFieldName={"product_moderation"}
                    setFormFields={setForm}
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 mb-5 w-[320px]">
                  <span className="font-bold text-sm">Модерация ЖК:</span>
                  <Checkbox
                    defaultValue={settings?.rcs_moderation === "Y"}
                    formFields={form}
                    formFieldName={"rcs_moderation"}
                    setFormFields={setForm}
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 mb-5 w-[320px]">
                  <span className="font-bold text-sm">Подписки:</span>
                  <Checkbox
                    defaultValue={settings?.user_subscriptions === "Y"}
                    formFields={form}
                    formFieldName={"user_subscriptions"}
                    setFormFields={setForm}
                    callback={setSubsPriceShow}
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 mb-5 w-[320px]">
                  <span className="font-bold text-sm">Модерация регистрации:</span>
                  <Checkbox
                    defaultValue={settings?.register_moderation === "Y"}
                    formFields={form}
                    formFieldName={"register_moderation"}
                    setFormFields={setForm}
                    callback={setRegisterModeration}
                  />
                </div>
              </div>

              <div className="flex flex-col w-1/2">
                {subsPriceShow && (
                  <>
                    <div className="font-bold mb-2.5 text-sm">
                      Цена подписки руб.
                    </div>
                    <Input
                      type={"number"}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          user_subscription_price: e.target.value,
                        });
                      }}
                      style={"h-11 border-greyborder border mb-5"}
                      placeholder={"Цена подписки"}
                      defaultValue={settings?.user_subscription_price}
                      min={0}
                    />
                  </>
                )}

                <div className="font-bold mb-2.5 text-sm">Мастер пароль</div>
                <Input
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                  }}
                  style={"h-11 border-greyborder border"}
                  placeholder={"Мастер пароль"}
                />
              </div>
            </div>

            <div className="flex justify-end w-full mt-[10px]">
              <div className="w-[130px] h-[33px]" onClick={saveSettings}>
                <Button>Сохранить</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MotionContainer>
  );
}
