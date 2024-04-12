import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import H1 from "@modules/common/components/heading/h1";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import Container from "@modules/common/components/container/container";
import H2 from "@modules/common/components/heading/h2";
import Input from "@modules/common/components/input/input";
import axios from "axios";
import Textarea from "@modules/common/components/textarea/textarea";

import galleryIcon from "public/icons/gallery-icon.svg";
import getLayout from "helpers/getLayout";
import Button from "@modules/common/components/button/button";
import api from "pages/api/service/api";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import { formateDate } from "helpers/formateDate";
import SelectCheckBox from "@modules/common/components/select/checkBox/selectCheckBox";

export default function EditItemTemplate({ newsId }) {
  const router = useRouter();
  const isBanner = router.query.banner;
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  const user = useSelector((state) => state.userLogin.value);
  const [news, setNews] = useState(null);
  const formRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  // const [fieldsArray, setFieldsArray] = useState(null);
  const [fields, setFields] = useState({});

  useEffect(() => {
    (async function fetchNews() {
      if (newsId != "add") {
        const getNews = await api.get.news({
          window_host: window.location.origin,
          filter: { id: newsId },
          limit: 1,
        });
        setNews(getNews);
      }
    })();

    // async function fetchColumns() {
    //     const getFieldsArray = await axios.post(
    //         window.location.origin + "/api/admin_api/getCreateFields",
    //         {
    //             version: "userAdmin",
    //             table: "news",
    //         }
    //     );
    //     setFieldsArray(getFieldsArray.data);
    // }
    // fetchColumns();
    if (news) {
      if (news.comission) {
        changeFields(false, "comission", news.comission);
        setComission(news.comission);
      }
      if (news.properties) {
        if (news.properties.news_galery) {
          if (typeof news.properties.news_galery == "string") {
            news.properties.news_galery =
              news.properties.news_galery.split(",");
          }
        }
      }
    }
  }, []);

  const changePreviewImage = async (event) => {
    const files = event.target.files;
    const filesResult = [];
    for (let i in files) {
      const file = files[i];
      if (typeof file == "object") {
        filesResult.push(file);
      }
    }
    setPreviewImage(filesResult);
  };

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

    console.log(currentFields);

    setFields(currentFields);
  };

  const sendForm = async (e) => {
    e.preventDefault();

    let formData = new FormData(formRef.current);
    for (var key in fields) {
      if (formData.get(key)) {
        formData.set(key, fields[key]);
      } else {
        formData.append(key, fields[key]);
      }
    }

    const action = formRef.current.getAttribute("name");

    if (isBanner) {
      formData.append("variant", "1");
    } else {
      formData.append("variant", "2");
    }

    if (action == "editAd" && news && user) {
      formData.append("id", news.id);
      const res = await api.update.news(formData, true);
      router.back();
    } else if (action == "addAd") {
      const res = await api.add.news(formData, true);
      router.back();
    }
  };

  const deleteNewsItem = async (e) => {
    e.preventDefault();
    const res = await api.remove.news({ id: newsId });
    if (res) {
      alert(
        `${isBanner ? "Баннер успешно удален" : "Новость успешно удалена"}`
      );
      router.back();
    }
  };

  console.log(fields);

  return (
    <div className="w-full">
      {news || newsId == "add" ? (
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
            {news ? (
              <H1>Редактировать {news.name}</H1>
            ) : (
              <H1>Добавить {isBanner ? "баннер" : "новость"}</H1>
            )}
          </div>
          <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
            <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
              <div className="flex flex-col gap-5 mb-[35px]">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Дата создания</span>
                  <span className="text-grey text-sm">
                    {new Date(
                      news && news.date_created ? news.date_created : new Date()
                    ).toLocaleDateString(process.env.Timezone)}
                  </span>
                </div>
                {news && news.date_edited && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      Последний раз редактировалось
                    </span>
                    {news.last_edited_by ? (
                      <Link
                        href={`/user/admin/users/${news.last_edited_by.id}`}
                      >
                        <a
                          className="text-blue cursor-pointer hover:underline underline-offset-2"
                          href={`/user/admin/users/${news.last_edited_by.id}`}
                        >
                          <div>ID: {`${news.last_edited_by.id} `}</div>
                          <div>
                            {news.last_edited_by.name
                              ? news.last_edited_by.name
                              : news.last_edited_by.phone}
                          </div>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                    <span className="text-grey text-sm">
                      {news.date_edited && formateDate(news.date_edited)}
                    </span>
                  </div>
                )}
                {news && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Опубликовано</span>
                    <span className="text-grey text-sm">
                      {news.published ? "Да" : "Нет"}
                    </span>
                  </div>
                )}
              </div>
              {news && (
                <div
                  className="flex flex-col gap-5 hover:underline"
                  onClick={deleteNewsItem}
                >
                  <span className="font-semibold text-sm cursor-pointer hover:underline">
                    Удалить {isBanner ? "баннер" : "новость"}
                  </span>
                </div>
              )}
            </div>
            <div className="w-full px-5">
              <form
                onSubmit={sendForm}
                encType="multipart/form-data"
                ref={formRef}
                name={news ? "editAd" : "addAd"}
              >
                <div className="block w-full">
                  <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                    <div className="font-bold mb-2.5 text-sm">Название</div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"name"}
                        defaultValue={news && news.name}
                        required={true}
                        minLength={3}
                        placeholder={"Название объявления"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">
                      Символьный код
                    </div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"slug"}
                        defaultValue={news && news.slug}
                        required={true}
                        minLength={3}
                        placeholder={"Символьный код"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold text-sm my-2.5">Текст</div>
                    <div className="mb-5">
                      <Textarea
                        name="text"
                        onChange={changeFields}
                        defaultValue={news && news.text}
                        placeholder={"Полный текст новости"}
                      />
                    </div>

                    <div className="font-bold text-sm my-2.5">
                      Текст предпросмотра
                    </div>
                    <div className="mb-5">
                      <Textarea
                        name="preview_text"
                        onChange={changeFields}
                        defaultValue={news && news.preview_text}
                        placeholder={"Текст для предпросмотра новости"}
                      />
                    </div>

                    <div className="font-bold text-sm my-2.5">
                      Текст детально
                    </div>
                    <div className="mb-5">
                      <Textarea
                        isResize={true}
                        name="detail_text"
                        onChange={changeFields}
                        defaultValue={news && news.detail_text}
                        placeholder={"Текст детального описания новости"}
                        className="h-[500px] w-full"
                      />
                    </div>

                    <div className="font-bold text-sm my-2.5">Ссылка</div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name="href"
                        onChange={changeFields}
                        defaultValue={news && news?.href}
                        placeholder={"Ссылка"}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">Meta Title</div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"meta_title"}
                        defaultValue={news && news.meta_title}
                        required={true}
                        minLength={3}
                        placeholder={"Meta Title"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">
                      Meta Description
                    </div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"meta_description"}
                        defaultValue={news && news.meta_description}
                        required={true}
                        minLength={3}
                        placeholder={"Meta Description"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">Опубликовано</div>
                    <div className="mb-5">
                      {/* <input
                        type="checkbox"
                        name="published"
                        defaultChecked={news && news.published}
                        onChange={changeFields}
                      /> */}

                      <SelectCheckBox
                        name={"published"}
                        options={[
                          { name: "Да", id: "1" },
                          { name: "Нет", id: "0" },
                        ]}
                        defaultValue={news?.published ? "1" : "0"}
                        filter={fields}
                        setFilter={setFields}
                      />
                    </div>
                  </div>
                  <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                    <div className="lg:max-w-[300px]">
                      <div className="mb-7">
                        <H2>
                          Превью изображений
                          <span className="text-red"> *</span>
                        </H2>
                        <div className="h-11 mb-1.5">
                          <label className="flex justify-center text-sm text-white w-full h-full rounded md:text-black font-normal bg-blue  hover:underline underline-offset-2">
                            <div className="px-[13px] flex items-center justify-center gap-2.5">
                              <div>
                                <img
                                  src={galleryIcon.src}
                                  width={galleryIcon.width}
                                  height={galleryIcon.height}
                                />
                              </div>
                              <div>Добавить фото</div>
                            </div>
                            <input
                              type="file"
                              onChange={changePreviewImage}
                              multiple={false}
                              name="preview_image"
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    {previewImage && (
                      <div className="flex flex-wrap items-start gap-2.5">
                        {previewImage.map((image) => {
                          return (
                            <img
                              key={image.name}
                              className="max-w-[200px] max-h-[200px]"
                              src={URL.createObjectURL(image)}
                            />
                          );
                        })}
                      </div>
                    )}
                    {!previewImage && news && news.preview_image && (
                      <div className="flex flex-wrap items-start gap-2.5">
                        <img
                          src={"https://flate.pro/" + news.preview_image}
                          layout="fill"
                          className="max-w-[200px] max-h-[200px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {!MOBILE && (
                  <div className="flex justify-end w-full mt-[10px]">
                    <div className="w-[130px] h-[33px]">
                      <Button>Сохранить</Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </Container>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <PreloaderSpinner />
        </div>
      )}
    </div>
  );
}
