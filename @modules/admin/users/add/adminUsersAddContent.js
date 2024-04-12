import axios from "axios";
import api from "pages/api/service/api";

import H1 from "@modules/common/components/heading/h1";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import MaskInput from "react-maskinput/lib";
import Button from "@modules/common/components/button/button";
import Input from "@modules/common/components/input/input";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Textarea from "@modules/common/components/textarea/textarea";

import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function AdminUsersAddContent({ user }) {
  const userCurrent = useSelector((state) => state.userLogin.value);

  const [error, setError] = useState(false);

  const [fieldsArray, setFieldsArray] = useState(null);
  const [fields, setFields] = useState({});

  const [userGroup, setUserGroup] = useState(null);
  const [userPhone, setUserPhone] = useState(false);

  const formRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    (async function fetchColumns() {
      const getFieldsArray = await axios.post(
        window.location.origin + "/api/admin_api/getCreateFields",
        {
          version: "userAdmin",
          table: "users",
        }
      );
      setFieldsArray(getFieldsArray.data);
    })();
  }, []);

  function printOptions(columnName, type) {
    if (!columnName) {
      return false;
    }

    const field = fieldsArray[type ? type : "columns"][columnName];

    let fieldDesc, options;

    if (field.options) {
      if (typeof field.options == "string") {
        field.options = JSON.parse(field.options);
      }
      options = field.options.values;
    } else {
      fieldDesc = field.descObj;
      options = fieldDesc.result_options;
    }
    const firstValue = options[0];
    if (typeof firstValue == "object") {
      return options;
    } else {
      let resultOptions = [];
      options.forEach((option, index) => {
        resultOptions.push({ id: index, name: option });
      });
      return resultOptions;
    }
  }

  const changeFields = (event, forceName = false, forceValue = false) => {
    let currentFields = fields;

    if (forceName && forceValue) {
      currentFields[forceName] = forceValue;
    } else if (typeof event == "function") {
      const callbackEvent = event();
      if (callbackEvent) {
        if (callbackEvent.name && callbackEvent.value != null) {
          currentFields[callbackEvent.name] = callbackEvent.value;
        }
      }
    } else if (event) {
      if (event.target) {
        if (event.target.files) {
          currentFields[event.target.name] = event.target.files;
        } else if (event.target.value) {
          currentFields[event.target.name] = event.target.value;
        }
      }
    }

    setFields(currentFields);
  };

  const sendForm = async (e) => {
    e.preventDefault();

    let formData = new FormData(formRef.current);
    for (var key in fields) {
      formData.append(key, fields[key]);
    }
    formData.append("user_id", user);
    formData.append("phone", userPhone);

    const res = await api.add.user(formData, true);
    if (res?.itemId) {
      router.push("/user/admin/users/");
    } else {
      // console.log("res", res);
      setError(res?.error);
    }
    // }
  };

  useEffect(() => {
    if (fieldsArray?.columns?.user_group) {
      let list = printOptions("user_group");

      if (userCurrent.user_group.id !== 5) {
        list = list.filter((item) => item.id == 3);
      }

      setUserGroup(list);
    }
  }, [fieldsArray]);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Добавить пользователя</H1>
      </div>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10  mt-2.5">
        <form
          ref={formRef}
          onSubmit={sendForm}
          encType="multipart/form-data"
          className="lg:flex lg:flex-wrap gap-x-5"
        >
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Имя</div>
              <Input
                style={"w-full h-11"}
                type={"text"}
                name="user_name"
                onChange={changeFields}
                placeholder={"Имя"}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Фамилия</div>
              <Input
                style={"w-full h-11 border-greyborder"}
                type={"text"}
                placeholder={"Фамилия"}
                name="user_last_name"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Название агентства</div>
              <Input
                style={"w-full h-11 border-greyborder"}
                type={"text"}
                placeholder={"Название агентства"}
                name="user_agency"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Описание</div>
              <Textarea
                areaStyle={"h-full"}
                placeholder={"Описание"}
                name="user_description"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">
                Подтверждение профессиональной деятельности
              </div>
              <Textarea
                areaStyle={"h-full"}
                placeholder={
                  "- Ссылка на: YouTube, Vkontakte\n- Ссылка на кабинет: Циан, Авито, Domclick \n- Ссылка на профиль на сайте Агентства Недвижимости"
                }
                labelStyle="h-[94px] mb-[4px]"
                name="professional_confirmation"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Номер телефона</div>
              <MaskInput
                placeholder="+7 (000) 000-00-00"
                maskChar="_"
                className="w-full h-11 outline-none px-2.5 border-greyborder border rounded bg-white py-2"
                mask={"+7 (000) 000-00-00"}
                name="phone"
                onChange={(e) => {
                  setUserPhone(e.target.value);
                }}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Электронный адрес</div>
              <Input
                style={"w-full h-11"}
                type={"mail"}
                placeholder={"mail@mail.ru"}
                name="email"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-10 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">О себе</div>
              <Textarea
                style={"w-full h-full"}
                placeholder={""}
                name="user_description"
                onChange={changeFields}
              />
            </Container>
          </div>
          <div className="mb-4 lg:max-w-[48.9%] lg:w-full">
            <Container>
              <div className="text-xs">Роль</div>
              <SelectNoAutocomplete
                style={"w-full h-11 border-greyborder border border-solid"}
                name={"user_group"}
                addCallback={changeFields}
                options={userGroup}
              />
            </Container>
          </div>
          <div className="flex justify-end w-full">
            <div className="w-[130px] h-[33px]">
              <Button>Сохранить</Button>
            </div>
          </div>
        </form>
      </div>
      <Dialog open={typeof error == "string"} onClose={() => setError(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title="Ошибка"
              subtitle={error}
              isShow={typeof error == "string"}
              onClose={() => setError(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </MotionContainer>
  );
}
