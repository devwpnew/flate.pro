import api from "pages/api/service/api";

import { useState, useEffect } from "react";

import Checkbox from "@modules/common/components/checkbox/checkbox";
import Input from "@modules/common/components/input/input";
import Button from "@modules/common/components/button/button";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import InputFile from "@modules/common/components/input/inputFile";
import { formateDate } from "helpers/formateDate";

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

  const formData = new FormData();

  for (const property in newFields) {
    formData.append(property, newFields[property]);
  }

  return formData;
};

export default function AdminBannerForm({ id, name }) {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({});
  const [banner, setBanner] = useState({});

  const saveBanner = async (ev) => {
    ev.preventDefault();

    const formattedFields = await formateForm(form);

    await updateBanner(formattedFields);

    await fetchBanner();
  };

  const updateBanner = async (fields) => {
    setIsLoading(true);
    const response = await api.update.banner(fields);
    setIsLoading(false);

    // console.log(response);

    if (response?.data.itemId) {
      setSuccess(true);
    } else {
      setIsError(true);
    }
  };

  const getForm = async () => {
    setIsLoading(true);

    const res = await api.get.banners({
      window_host: window.location.origin,
      filter: {
        id: id,
      },
      sort: {
        id: "asc",
      },
      limit: "all",
    });

    setIsLoading(false);

    return res;
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  async function fetchBanner() {
    const bannerArr = await getForm();
    const bannerForm = bannerArr[0];

    setBanner(bannerForm);
    setForm({ ...form, id: bannerForm.id });
  }

  return (
    <>
      <form onSubmit={(ev) => saveBanner(ev)} className="flex flex-col w-1/2">
        <div className="mb-5 w-[420px] flex-grow">
          {!isLoading ? (
            <>
              <div className="block">
                <div className="ml-auto text-xs">
                  До:{" "}
                  {banner?.date_active_to && formateDate(banner.date_active_to)}
                </div>
                <div className="font-bold text-sm mb-5 relative flex items-center justify-between gap-2.5">
                  <Checkbox
                    formFields={form}
                    setFormFields={setForm}
                    formFieldName={"active"}
                    defaultValue={banner.active}
                  />
                  <span className="">{name}:</span>

                  <div className="w-1/2">
                    <Input
                      style="py-2.5"
                      inputStyle="h-auto"
                      type="date"
                      name={"date_active_to"}
                      onChange={(e) => {
                        setForm({ ...form, date_active_to: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* <Input
                style={"py-2.5 mb-5"}
                name={"name"}
                placeholder={"Текст"}
                topTitle={"Текст"}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                }}
                defaultValue={banner?.name}
              /> */}

              {/* <Input
                style={"py-2.5 mb-5"}
                name={"button_name"}
                placeholder={"Второй текст"}
                topTitle={"Второй текст"}
                onChange={(e) => {
                  setForm({ ...form, button_name: e.target.value });
                }}
                defaultValue={banner?.button_name}
              /> */}

              <Input
                topTitle={"Ссылка"}
                style={"py-2.5 mb-5"}
                placeholder={"Ссылка"}
                name={"url"}
                onChange={(e) => {
                  setForm({ ...form, url: e.target.value });
                }}
                defaultValue={banner?.url}
              />

              <div className={`mb-5 block`}>
                <InputFile
                  defaultValue={banner?.image}
                  name="image"
                  form={form}
                  setForm={setForm}
                  onChange={(e) => {
                    setForm({ ...form, image: e.target.files });
                  }}
                  multiple={false}
                />
              </div>

              {/* <Input
                topTitle={"Размер"}
                style={"py-2.5 mb-5"}
                placeholder={"800х800"}
                onChange={(e) => {
                  setForm({ ...form, image_size: e.target.value });
                }}
                defaultValue={banner?.image_size}
              /> */}

              <div className="flex justify-end w-full mt-[10px]">
                <div className="w-[130px]">
                  <Button className={"py-2"} onClick={(ev) => saveBanner(ev)}>
                    Сохранить
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <PreloaderSpinner />
            </div>
          )}
        </div>
      </form>

      <Dialog open={isSuccess} onClose={() => setSuccess(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title="Успешно"
              subtitle={"Баннер успешно изменен"}
              isShow={isSuccess}
              onClose={() => setSuccess(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
      <Dialog open={isError} onClose={() => setIsError(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title="Ошибка"
              subtitle={"Произошла ошибка, попробуйте снова"}
              isShow={isError}
              onClose={() => setIsError(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
