import api from "pages/api/service/api";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Dialog } from "@headlessui/react";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogAnimateWrapper from "@modules/common/components/dialog/dialogAnimateWrapper";

import Button from "@modules/common/components/button/button";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import SelectCheckBox from "@modules/common/components/select/checkBox/selectCheckBox";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

export default function ButtonReport({ product }) {
  const user = useSelector((state) => state.userLogin.value);

  const [reportMsg, setReportMsg] = useState("");

  const [selected, setSelected] = useState({ report: 0 });
  const [openReportModal, setReportModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const options = [
    {
      name: "Уже продано",
      id: "0",
    },
    {
      name: "Неверная цена",
      id: "1",
    },
    {
      name: "Неверное описание или фото",
      id: "2",
    },
    {
      name: "Не дозвониться",
      id: "3",
    },
    {
      name: "Другая причина",
      id: "4",
    },
  ];

  const sendReport = async () => {
    setIsLoading(true);
    const selectedReportOption = options.find((el) => el.id == selected.report);

    let text = selectedReportOption.name;

    if (reportMsg) {
      text = reportMsg;
    }

    const res = await api.add.report({
      window_host: window.location.origin,
      status: 1,
      product: product.id,
      user_id: user.id,
      text: text,
    });

    setIsLoading(false);

    if (res?.itemId) {
      setIsSuccess(true);
    }
  };

  return (
    <>
      <Button
        className="w-auto px-7 py-2"
        type={"red"}
        onClick={() => setReportModal(true)}
      >
        <span className="font-semibold">Пожаловаться</span>
      </Button>

      <Dialog open={openReportModal} onClose={() => setReportModal(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[460px] w-full rounded-[10px]">
            {isSuccess ? (
              <DialogMessage
                isShow={openReportModal}
                onClose={() => setReportModal(false)}
                title={"Спасибо!"}
                subtitle={"Сообщение отправлено"}
                isOffTimeout={false}
              />
            ) : (
              <DialogAnimateWrapper isShow={openReportModal}>
                <DialogTitle className={"text-center"}>
                  Жалоба на объявление
                </DialogTitle>
                <DialogCloseIcon onClick={() => setReportModal(false)} />

                {/* {reportNextStep && (
                  <div className="mb-7">
                    <TextareaRequired
                      areaStyle={"h-full py-2.5"}
                      placeholder={"Ваше сообщение"}
                      labelStyle="h-[94px]"
                      name="professional_confirmation"
                      required={true}
                    />
                  </div>
                )} */}

                {/* {!reportNextStep && (
                  <div className="mb-5">
                    <SelectCheckBox name={"report"} options={options} />
                  </div>
                )} */}

                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <PreloaderSpinner />
                  </div>
                ) : (
                  <>
                    <div className="mb-5">
                      <SelectCheckBox
                        name={"report"}
                        options={options}
                        filter={selected}
                        setFilter={setSelected}
                      />
                    </div>

                    {selected.report === "4" && (
                      <div className="mb-10">
                        <TextareaRequired
                          areaStyle={"h-full py-2.5"}
                          placeholder={"Ваше сообщение"}
                          labelStyle="h-[94px]"
                          value={reportMsg}
                          onChange={(ev) => {
                            setReportMsg(ev.target.value);
                          }}
                        />
                      </div>
                    )}

                    <Button className="w-auto px-7 py-1" onClick={sendReport}>
                      Отправить
                    </Button>
                  </>
                )}

                {/* <div className="flex justify-between pt-2.5 border-t border-greyborder">
                  {reportNextStep && (
                    <Button
                      className="w-auto px-7 py-1"
                      onClick={() => setReportNextStep(false)}
                    >
                      Назад
                    </Button>
                  )}

                  {reportNextStep ? (
                    <Button className="w-auto px-7 py-1" onClick={sendReport}>
                      Отправить
                    </Button>
                  ) : (
                    <Button
                      className="w-auto px-7 py-1 ml-auto"
                      onClick={() => setReportNextStep(true)}
                    >
                      Далее
                    </Button>
                  )}
                </div> */}
              </DialogAnimateWrapper>
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
