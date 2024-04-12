import { useEffect, useState } from "react";
import API from "pages/api/service/api";

import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";

import Link from "next/link";
import TablePreloader from "@modules/common/components/preloader/tablePreloader";
import Button from "@modules/common/components/button/button";

import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogAnimateWrapper from "@modules/common/components/dialog/dialogAnimateWrapper";
import Textarea from "@modules/common/components/textarea/textarea";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import Table from "@modules/common/components/admin/table/table";
import { formateDate } from "helpers/formateDate";

export default function AdminNewsContent({ user }) {
  const [data, setData] = useState(null);

  const [isShowTextToSendDialog, setIsShowTextToSendDialog] = useState(false);
  const [textToSend, setTextToSend] = useState("");
  const [newsPreviewText, setNewsPreviewText] = useState("");
  const [newsId, setNewsId] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [newsListLoading, setNewsListLoading] = useState(true);
  const [newsList, setNewsList] = useState(null);

  useEffect(() => {
    (async function fetchNews() {
      setNewsListLoading(true);
      
      let res = await API.get.news({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        limit: "all",
      });
      
      const data = [];

      if (!res) {
        res = [];
      }

      res.map((item) => {
        const newsObject = {
          ID: (
            <Link href={`/user/admin/news/${item.id}${item.variant == 1 ? "?banner=1" : "" }`}>
              <a>{item.id}</a>
            </Link>
          ),
          Название: (
            <Link href={`/user/admin/news/${item.id}${item.variant == 1 ? "?banner=1" : "" }`}>
              <a>{item.name}</a>
            </Link>
          ),
          "Дата создания": (
            <>
              {item.date_created && formateDate(item.date_created)}{" "}
              г
            </>
          ),
          "Дата редактирования": (
            <>
              {item.date_edited && formateDate(item.date_edited) + " г"}
            </>
          ),
          Описание: <span>{item?.text}</span>,
          Разослать: (
            <>
              <Button
                type={"white"}
                onClick={() => {
                  setNewsId(item.id);
                  setNewsPreviewText(item?.preview_text);
                  setIsShowTextToSendDialog(true);
                }}
              >
                <div className="flex justify-center p-1">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6479 7.94819L0.862529 0.662651C0.611178 0.548511 0.311256 0.616509 0.136404 0.832647C-0.0396635 1.04878 -0.0457348 1.35599 0.121832 1.5782L5.31278 8.49946L0.121832 15.4207C-0.0457348 15.6429 -0.0396635 15.9513 0.135189 16.1663C0.252972 16.3132 0.429039 16.3921 0.607535 16.3921C0.693747 16.3921 0.779959 16.3739 0.861314 16.3363L16.6466 9.05073C16.8628 8.95116 17 8.73624 17 8.49946C17 8.26268 16.8628 8.04776 16.6479 7.94819Z"
                      fill="#2563EB"
                    ></path>
                  </svg>
                </div>
              </Button>
            </>
          ),
        };

        data.push(newsObject);
      });

      setData(data);

      setNewsListLoading(false);
    })();
  }, []);

  const sendNotification = async (newsId, previewText, textToSend) => {
    setNewsListLoading(true);

    const res = await API.add.newsNotification(
      newsId,
      textToSend ? textToSend : previewText,
      window.location.origin
    );

    if (res.Notification.itemId) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }

    setNewsListLoading(false);
  };

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder relative">
        <H1>Новости</H1>
      </div>

      <div className="table-container">
        <Table data={data} isLoading={newsListLoading} />
      </div>

      {/* setTextToSend */}

      <Dialog
        open={isShowTextToSendDialog}
        onClose={() => setIsShowTextToSendDialog(false)}
      >
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogAnimateWrapper isShow={isShowTextToSendDialog}>
              <DialogTitle className={"text-center"}>
                Ваше сообщение
              </DialogTitle>

              <div className="mb-5">
                <p className="text-lg text-center">
                  Оставьте пустым, если желаете отправить превью новости
                </p>
              </div>

              <Textarea
                style="py-2.5"
                value={textToSend}
                onChange={(ev) => setTextToSend(ev.target.value)}
                placeholder={"Ваше сообщение"}
              />

              <DialogCloseIcon
                onClick={() => setIsShowTextToSendDialog(false)}
              />

              <div className="flex justify-center mt-5">
                <Button
                  onClick={() => {
                    setIsShowTextToSendDialog(false);

                    sendNotification(newsId, newsPreviewText, textToSend);
                  }}
                  className={"w-auto px-5 py-2.5"}
                >
                  Отправить
                </Button>
              </div>
            </DialogAnimateWrapper>
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isSuccess} onClose={() => setIsSuccess(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title={"Успешно"}
              subtitle={"Уведомление было отправлено"}
              isShow={isSuccess}
              onClose={() => setIsSuccess(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
      <Dialog open={isError} onClose={() => setIsError(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title={"Ошибка"}
              subtitle={"Произошла ошибка, попробуйте позже"}
              isShow={isSuccess}
              onClose={() => setIsError(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </MotionContainer>
  );
}
