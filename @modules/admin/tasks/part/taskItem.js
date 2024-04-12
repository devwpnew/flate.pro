import { Dialog } from "@headlessui/react";
import Button from "@modules/common/components/button/button";
import DialogAnimateWrapper from "@modules/common/components/dialog/dialogAnimateWrapper";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import H1 from "@modules/common/components/heading/h1";
import AdminToolsButton from "@modules/posts/type/product/components/item/part/admitToolsButton";
import { formateDate } from "helpers/formateDate";
import Link from "next/link";
import api from "pages/api/service/api";
import React, { useState } from "react";

export default function TaskItem({ task, color, sections, type }) {
  const userName = `${task?.user_id?.user_name}, ${task?.user_id?.user_agency}`;

  const [showTask, setShowTask] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const closeTask = async () => {
    if (!isSuccess) {
      const res = await api.update.tasks({
        id: task.id,
        status: 5,
      });

      // console.log(res, 'task res');

      if (res.data.itemId) {
        setIsSuccess(true);
      }
    }
  };

  const getSection = () => {
    const slugId =
      task?.product?.section_relation && task?.product?.section_relation[0];
    return sections.find((el) => el.id == slugId);
  };
  return (
    <>
      <div
        className={`p-2.5 border-l-${color} border-l-2 rounded rounded-l-none shadow-md mb-5 cursor-pointer hover:shadow-lg bg-greylight`}
      >
        <div className="mb-2">
          <span className="text-xs">
            {task.date_created && formateDate(task.date_edited)}{" "}
          </span>
          <br />
          Обращение от пользователя <br />
          <Link href={`/user/admin/users/${task?.user_id.id}`}>
            <a>{userName}</a>
          </Link>
        </div>
        <div className="text-sm text-grey">{task?.user_id.text}</div>
        <div className="flex gap-2.5">
          {type !== "closed" && (
            <Button
              isDisabled={isSuccess}
              onClick={closeTask}
              type={"green"}
              className={"w-auto px-1 mt-2"}
            >
              Принять
            </Button>
          )}

          <Button
            onClick={() => setShowTask(true)}
            className={"w-auto px-1 mt-2"}
          >
            Подробнее
          </Button>
        </div>
      </div>

      <Dialog open={showTask} onClose={() => setShowTask(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[500px] rounded-[10px] mx-[16px]">
            <DialogAnimateWrapper isShow={showTask}>
              <div className="text-center mb-5">
                <H1>
                  Обращение <br />
                  от{" "}
                  <Link href={`/user/admin/users/${task?.user_id.id}`}>
                    <a>{userName}</a>
                  </Link>
                </H1>
              </div>

              <div className="flex flex-col md:flex-row md:gap-[4px] md:justify-between flex-wrap text-sm leading-6 w-full mb-5">
                <div className="flex justify-between gap-2 w-full relative">
                  <span className="bg-white text-grey whitespace-nowrap">
                    Дата:
                  </span>
                  <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>
                  <span className="bg-white whitespace-nowrap">
                    {task.date_created && formateDate(task.date_created)}{" "}
                  </span>
                </div>

                {task.product && (
                  <div className="flex justify-between gap-2 items-center w-full relative">
                    <span className="bg-white text-grey whitespace-nowrap max-w-1/2 w-full block">
                      Объявление:
                    </span>

                    <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>

                    <Link
                      href={`/posts/${getSection()?.slug}/${
                        task?.product.slug
                      }`}
                    >
                      <a className="bg-white max-w-1/2 w-full block">
                        {task.product?.name}
                      </a>
                    </Link>

                    <AdminToolsButton
                      user={task.user_id}
                      product={task.product}
                      className="absolute -top-1 right-0 cursor-pointer z-1"
                    />
                  </div>
                )}

                {task.rating && (
                  <div className="flex justify-between gap-2 w-full relative">
                    <span className="bg-white text-grey whitespace-nowrap">
                      Оценка:
                    </span>
                    <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>
                    <span className="bg-white whitespace-nowrap">
                      {task.rating}
                    </span>
                  </div>
                )}

                {task.text && (
                  <div className="flex justify-between gap-2 relative w-full">
                    <span className="bg-white text-grey whitespace-nowrap">
                      Текст обращения:
                    </span>
                    <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>
                    <span className="bg-white">
                      {task.text}
                    </span>
                  </div>
                )}

                {task.text2 && (
                  <div className="flex justify-between gap-2 relative w-full">
                    <span className="bg-white text-grey whitespace-nowrap">
                      Что улучшить:
                    </span>
                    <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>
                    <span className="bg-white whitespace-nowrap">
                      {task.text2}
                    </span>
                  </div>
                )}

                {task.text3 && (
                  <div className="flex justify-between gap-2 relative w-full">
                    <span className="bg-white text-grey whitespace-nowrap">
                      Как связаться:
                    </span>
                    <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div>
                    <span className="bg-white whitespace-nowrap">
                      {task.text3}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                {type !== "closed" && (
                  <Button
                    isDisabled={isSuccess}
                    onClick={closeTask}
                    type={"green"}
                    className={"w-auto px-2.5 py-2 mt-2"}
                  >
                    Принять
                  </Button>
                )}

                <Button
                  onClick={() => setShowTask(false)}
                  className={"w-auto px-2.5 py-2 mt-2"}
                >
                  Закрыть
                </Button>
              </div>
            </DialogAnimateWrapper>
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
