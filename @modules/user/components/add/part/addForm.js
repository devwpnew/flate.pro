import api from "pages/api/service/api";

import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import FieldSection from "./fields/fieldSection";
import FieldStatus from "./fields/fieldStatus";
import FieldAddress from "./fields/fieldAddress";
import FieldName from "./fields/fieldName";
import FieldPremium from "./fields/fieldPremium";
import FieldContacts from "./fields/fieldsContacts";
import FieldConnect from "./fields/fieldConnect";
import FieldAbout from "./fields/fieldAbout";
import FieldImages from "./fields/fieldImages";
import FieldFiles from "./fields/fieldFiles";
import FieldDescription from "./fields/fieldDescription";
import FieldPrice from "./fields/fieldPrice";
import Button from "@modules/common/components/button/button";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";

import AddFormSidebar from "./sidebar/addFormSidebar";
import AddFormModals from "./modals/addFormModals";

import validateAddForm from "./helpers/validateAddForm";

export default function addForm({ product }) {
  const router = useRouter();

  const user = useSelector((state) => state.userLogin.value);

  const isAdmin = user.user_group?.id === 1 || user.user_group?.id === 5;
  const productSectionId = product?.section_relation[0].id;
  const initialSectionId = productSectionId ? productSectionId : null;

  const [scrollToEl, setScrollToEl] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sectionId, setSectionId] = useState(initialSectionId);

  const formRef = useRef(null);

  const [isFormDataLoading, setIsFormDataLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [form, setForm] = useState({ section_relation: initialSectionId });

  const onSubmitForm = async (ev) => {
    ev.preventDefault();
    setScrollToEl(false);

    const test = {};
    formData.forEach((value, key) => {
      test[key] = value;
    });

    console.log(test);
    // console.log("sendedformdata", test);

    const isValid = validateAddForm(formData, sectionId, product);

    if (isValid?.check) {
      setIsLoading(true);

      let res = {};

      if (product) {
        // console.log("update");
        res = await api.update.product(formData);
        console.log("update res", res);
      } else {
        // console.log("create");
        res = await api.add.product(formData);
        console.log("create res", res);
      }

      if (res?.full?.itemId || res?.full?.data?.itemId) {
        setIsSuccess(true);
        onAddSuccess();
      } else {
        setIsError(true);
      }

      setIsLoading(false);
    } else {
      setIsError(true);

      if (isValid.errorFields) {
        let errorStr = "";

        const [id] = Object.entries(isValid.scrollToFields)[0];

        setScrollToEl(id);

        for (const key in isValid.errorFields) {
          if (isValid.errorFields[key]) {
            errorStr += isValid.errorFields[key] + "<br/>";
          }
        }
        setErrorText(errorStr);
      }
    }
  };

  const updateFormData = () => {
    const resultFormData = new FormData();
    const formData = new FormData(formRef.current);
    formData.forEach((value, key) => {
      switch (key) {
        case "property_product_phone":
          const phone = value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1");
          resultFormData.append("property_product_phone", phone);

          break;
        case "property_product_galery":
          const galleryFiles = form[key];
          const galleryFilesResult = [];

          if (
            galleryFiles &&
            galleryFiles.length > 0 &&
            galleryFiles[0].name !== ""
          ) {
            galleryFiles.map((file) => {
              galleryFilesResult.push(file);
            });

            resultFormData.delete("property_product_galery");

            galleryFilesResult.map((file) => {
              resultFormData.append("property_product_galery", file);
            });
          }

          break;
        default:
          resultFormData.append(key, value);
      }
    });

    for (const key in form) {
      if (product) {
        if (form[key] && key !== "property_product_galery") {
          resultFormData.append(key, form[key]);
        }
      } else {
        if (form[key] && key !== "property_product_galery") {
          resultFormData.append(key, form[key]);
        }
      }
    }

    if (!product) {
      resultFormData.append("user_id", user.id);
    } else {
      resultFormData.append("id", product.id);
      resultFormData.append("published", "0");
    }

    setFormData(resultFormData);
  };

  useEffect(() => {
    setIsFormDataLoading(true);
    updateFormData();
    setIsFormDataLoading(false);
  }, [form]);

  const onAddSuccess = () => {
    setTimeout(() => {
      if (!isAdmin) {
        if (product) {
          router.push("/user/profile/items");
        } else {
          router.push("/");
        }
      }
    }, 2500);
  };

  // useEffect(() => {
  //   if (formData) {
  //     const test = {};
  //     formData.forEach((value, key) => {
  //       test[key] = value;
  //     });
  //     console.log(test);
  //   }
  // }, [formData]);

  useEffect(() => {
    if (!scrollToEl) return;

    document.getElementById(scrollToEl)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [scrollToEl]);

  useEffect(() => {
    if (user.user_group.id === 6) {
      router.push("/");
    }
  }, [user]);

  // console.log(product);
  // console.log(product?.user_id);
  return (
    <>
      <div className="flex items-start relative mb-5">
        <PreloaderWithBackdrop isShow={isLoading} />

        <form
          className="flex-grow mr-5"
          onSubmit={onSubmitForm}
          onChange={updateFormData}
          encType="multipart/form-data"
          ref={formRef}
        >
          <div className="border-b border-greyborder pb-[30px] mb-[30px]">
            {!product && (
              <div id="section">
                <FieldSection
                  form={form}
                  setForm={setForm}
                  sectionId={sectionId}
                  setSectionId={setSectionId}
                />
              </div>
            )}

            {sectionId && (
              <>
                <FieldStatus
                  sectionId={sectionId}
                  form={form}
                  setForm={setForm}
                  product={product}
                />

                {sectionId === 7 || sectionId === 6 ? (
                  <div id="name">
                    <FieldName name={product?.name} />
                  </div>
                ) : (
                  ""
                )}

                {user?.user_group?.id === 5 && (
                  <FieldPremium
                    form={form}
                    setForm={setForm}
                    product={product}
                  />
                )}
              </>
            )}
          </div>

          {sectionId && (
            <>
              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="address"
              >
                <FieldAddress
                  user={user}
                  form={form}
                  setForm={setForm}
                  sectionId={sectionId}
                  product={product}
                />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="connect"
              >
                <FieldConnect product={product} />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="about"
              >
                <FieldAbout
                  sectionId={sectionId}
                  product={product}
                  form={form}
                  setForm={setForm}
                />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="gallery"
              >
                <FieldImages
                  setForm={setForm}
                  form={form}
                  sectionId={sectionId}
                  defaultImages={
                    product?.properties?.product_galery &&
                    JSON.parse(product?.properties?.product_galery)
                  }
                />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="files"
              >
                <FieldFiles product={product} />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="descr"
              >
                <FieldDescription
                  form={form}
                  setForm={setForm}
                  product={product}
                />
              </div>

              <div className="pb-[15px]" id="price">
                <FieldPrice
                  sectionId={sectionId}
                  setForm={setForm}
                  form={form}
                  formData={formData}
                  product={product}
                />
              </div>

              <div
                className="border-b border-greyborder pb-[30px] mb-[30px]"
                id="contacts"
              >
                <FieldContacts
                  product={product}
                  user={product?.user_id ? product?.user_id : user}
                />
              </div>

              <div className="flex gap-2.5">
                <>
                  <Button
                    className={"w-full h-auto p-3"}
                    isDisabled={isFormDataLoading}
                  >
                    {product ? "Сохранить" : "Опубликовать"}
                  </Button>
                  {/* <Button
                    type="white"
                    className={"w-full h-auto p-3"}
                    onClick={(ev) => {
                      ev.preventDefault();
                      router.push('/');
                    }}
                  >
                    Отмена
                  </Button> */}
                </>
              </div>
            </>
          )}
        </form>

        {!product && sectionId && (
          <AddFormSidebar formData={formData} sectionId={sectionId} />
        )}
      </div>

      <AddFormModals
        setIsSuccess={setIsSuccess}
        isSuccess={isSuccess}
        isError={isError}
        errorText={errorText}
        setIsError={setIsError}
        isReject={isReject}
        setIsReject={setIsReject}
        productId={product?.id}
      />
    </>
  );
}
