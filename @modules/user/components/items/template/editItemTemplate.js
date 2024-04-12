import API from "pages/api/service/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SettingsForm from "../../settings/part/settingsForm";
import H1 from "@modules/common/components/heading/h1";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import UserAvatar from "../../profile/common/userAvatar";
import { useRouter } from "next/router";
import AddForm from "../../add/part/addForm";
import Container from "@modules/common/components/container/container";
import axios from "axios";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import api from "pages/api/service/api";
import Preloader from "@modules/common/components/preloader/preloader";
import Checkbox from "@modules/common/components/checkbox/checkbox";
import Button from "@modules/common/components/button/button";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import { formateDate } from "helpers/formateDate";
export default function EditItemTemplate({ productId }) {
  const user = useSelector((state) => state.userLogin.value);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [fieldsArray, setFieldsArray] = useState(null);
  const [changeProdPub, setChangeProdPub] = useState(1);
  const [prodPubVal, setProdPubVal] = useState(1);
  const [prodDataLoading, setProdDataLoading] = useState(true);
  const [deleteState, setDeleteState] = useState(false);

  const getOptions = (fieldCode) => {
    if (fieldsArray) {
      if (fieldsArray.columns && fieldsArray.columns[fieldCode]) {
        return fieldsArray.columns[fieldCode].resultOptions;
      }
    }
  };

  const changeProdPubVal = (event) => {
    if (typeof event == "function") {
      const callbackEvent = event();
      if (callbackEvent) {
        if (callbackEvent.value != null) {
          setProdPubVal(callbackEvent.value);
        }
      }
    }
  };

  const saveProdPub = async () => {
    setProdDataLoading(true);
    const req = await api.update.product({
      id: productId,
      published: prodPubVal,
    });
    if (req.data && req.data.itemId) {
      product.published = prodPubVal;
      const getProduct = await API.get.product.list({
        window_host: window.location.origin,
        filter: { id: productId },
        limit: 1,
      });
      setProduct(getProduct);
      setProdDataLoading(false);
      setChangeProdPub(1);
    }
  };

  const submitDelete = async () => {
    const removeReq = await API.remove.product(productId);

    if (removeReq.success) {
      router.push("/user/admin/items/");
    }
  };

  const submitBlock = async () => {
    const banReq = await api.update.product({ id: productId, published: 4 });

    if (banReq.full.data.itemId) {
      router.push("/user/admin/items/");
    }
  };

  const submitToArchive = async () => {
    const toArchiveReq = await api.update.product({
      id: productId,
      published: 2,
    });

    if (toArchiveReq.full.data.itemId) {
      router.push("/user/admin/items/");
    }
  };

  const submitToActive = async () => {
    const toArchiveReq = await api.set.publishProduct(productId)
    console.log('toArchiveReq', toArchiveReq)
  };

  useEffect(() => {
    (async function fetchProduct() {
      const getProduct = await API.get.product.list({
        window_host: window.location.origin,
        filter: { id: productId },
        limit: 1,
      });
      setProduct(getProduct);
      const getFieldsArray = await axios.post(
        window.location.origin + "/api/admin_api/getCreateFields",
        {
          version: "userAdmin",
          table: "product",
        }
      );
      setFieldsArray(getFieldsArray.data);
      setProdDataLoading(false);
    })();
  }, []);

  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectError, setRejectError] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const rejectProduct = async (e) => {
    setRejectLoading(true);

    if (rejectReason) {
      const res = await api.set.sendEditProduct(productId, rejectReason);

      // console.log(res);

      if (res.itemId) {
        setRejectSuccess(true);
      } else {
        setRejectError(true);
      }
    }

    setRejectLoading(false);
  };

  return (
    <>
      <div className="w-full">
        {product ? (
          <Container>
            <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
              <H1>Редактировать {product.name}</H1>
            </div>
            <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
              {user &&
                (user.user_group?.id === 1 || user.user_group?.id === 5) && (
                  <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder pr-4">
                    <div className="flex flex-row items-center gap-2.5 border-b border-greyborder w-full pb-5 mb-5">
                      <div className="w-[70px] h-[70px] text-[30px]">
                        <UserAvatar
                          userOwner={product.user_id}
                          userName={product.user_id.user_name}
                        />
                      </div>
                      <div className="flex flex-col gap-[3px]">
                        <span className="text-xs">
                          {product.user_id.user_name}
                        </span>
                        <span className="text-xs">ID {product.user_id.id}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 mb-[35px]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Категория</span>
                        <span className="text-grey text-sm">
                          {product.section_relation[0] != undefined &&
                            product.section_relation[0].name}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          Дата создания
                        </span>
                        <span className="text-grey text-sm">
                          {product.date_created &&
                            formateDate(product.date_created)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          Последний раз редактировалось
                        </span>
                        <span className="text-grey text-sm">
                          {product.date_edited
                            ? formateDate(product.date_edited)
                            : ""}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          Дата публикации
                        </span>
                        <span className="text-grey text-sm">
                          {product.date_published
                            ? formateDate(product.date_published)
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 w-full">
                      {deleteState == true ? (
                        <>
                          <span className="font-semibold text-sm">
                            Вы уверены что хотите удалить это объявление ?
                          </span>
                          <div className="flex gap-5">
                            <Button
                              type="red"
                              onClick={() => submitDelete()}
                              className={"w-auto px-2.5 py-1"}
                            >
                              Да, удалить
                            </Button>
                            <Button
                              onClick={() => setDeleteState(false)}
                              className={"w-auto px-2.5 py-1"}
                            >
                              Отмена
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            className={"w-auto px-2.5 py-1"}
                            onClick={() => setDeleteState(true)}
                          >
                            Удалить объявление
                          </Button>
                        </>
                      )}

                      <Button
                        className={"px-2.5 py-1"}
                        onClick={() => setRejectDialog(true)}
                      >
                        Отклонить
                      </Button>

                      <Button
                        className={"px-2.5 py-1"}
                        onClick={() => submitToArchive(true)}
                      >
                        Отправить в архив
                      </Button>

                      <Button
                        className={"px-2.5 py-1"}
                        onClick={() => submitBlock()}
                      >
                        Заблокировать
                      </Button>

                      <Button
                        className={"px-2.5 py-1"}
                        type={"green"}
                        onClick={() => submitToActive()}
                      >
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                )}

              <div className="w-full px-5">
                {/* <SettingsForm
              user={user[0]}
              containerClassName={"lg:grid grid-cols-2"}
              blockClassName={"lg:max-w-full w-full"}
            /> */}
                <AddForm product={product} user={user} />
              </div>
            </div>
          </Container>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <PreloaderSpinner />
          </div>
        )}
      </div>

      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)}>
        <DialogWrapper>
          <Dialog.Panel
            className={
              "mx-[16px] md:mx-auto bg-white px-5 pb-5 pt-5 rounded-[10px] relative max-w-[480px] w-full"
            }
          >
            {rejectLoading ? (
              <div className="flex justify-center">
                <PreloaderSpinner />
              </div>
            ) : (
              <>
                {rejectError && (
                  <DialogMessage
                    isShow={rejectError}
                    onClose={() => setRejectDialog(false)}
                    title={"Произошла ошибка"}
                    subtitle={"Проверьте правильность ввода"}
                  />
                )}

                {rejectSuccess && (
                  <DialogMessage
                    isShow={rejectSuccess}
                    onClose={() => setRejectDialog(false)}
                    title={"Успешно"}
                    subtitle={"Объявление отклонено"}
                  />
                )}

                {!rejectError && !rejectSuccess && (
                  <>
                    <div className="text-center">
                      <DialogTitle>Укажите причину</DialogTitle>
                    </div>

                    <TextareaRequired
                      style="mb-5 py-2.5"
                      value={rejectReason}
                      onChange={(ev) => setRejectReason(ev.target.value)}
                      placeholder="Причина"
                      title="Причина"
                    />

                    <div className="flex justify-end">
                      <Button
                        className={"w-auto px-2.5 py-2"}
                        onClick={rejectProduct}
                      >
                        Отправить
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
