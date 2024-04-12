import H1 from "@modules/common/components/heading/h1";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import BackButton from "@modules/common/components/button/backButton";
import SearchResultEmpty from "@modules/search/components/part/searchResultEmpty";

import getLayout from "helpers/getLayout";
import { useEffect, useState } from "react";
import api from "pages/api/service/api";
import Link from "next/link";
import { prindivateFormatted } from "helpers/dateFunctions";
import TaskItem from "./part/taskItem";
import ReportItem from "./part/reportItem";
import Preloader from "@modules/common/components/preloader/preloader";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import { formateDate } from "helpers/formateDate";

export default function AdminTasksContent({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  const [tasksByStatus, setTasksByStatus] = useState(null);

  const [isLoading, setIsLoading] = useState(null);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const sections = await api.get.sections({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        filter: {
          active: true,
        },
      });

      setSections(sections);

      const getTasksRed = await api.get.tasks({
        filter: { status: 1 },
        sort: {
          date_created: "asc",
        },
      }); // red
      const getTasksYellow = await api.get.tasks({
        filter: { status: 2 },
        sort: {
          date_created: "asc",
        },
      }); // yellow
      const getTasksPurple = await api.get.tasks({
        filter: { status: 3 },
        sort: {
          date_created: "asc",
        },
      }); // purple
      const getTasksBlue = await api.get.tasks({
        filter: { status: 4 },
        sort: {
          date_created: "asc",
        },
      }); // blue
      const getTasksClosed = await api.get.tasks({
        filter: { status: 5 },
        limit: 2,
        sort: {
          date_created: "asc",
        },
      }); // closed

      const getReportsRed = await api.get.reports({
        filter: { status: 1 },
        sort: {
          date_created: "asc",
        },
      }); // red
      const getReportsYellow = await api.get.reports({
        filter: { status: 2 },
        sort: {
          date_created: "asc",
        },
      }); // yellow
      const getReportsPurple = await api.get.reports({
        filter: { status: 3 },
        sort: {
          date_created: "asc",
        },
      }); // purple
      const getReportsBlue = await api.get.reports({
        filter: { status: 4 },
        sort: {
          date_created: "asc",
        },
      }); // blue
      const getReportsClosed = await api.get.reports({
        filter: { status: 5 },
        limit: 3,
        sort: {
          date_created: "asc",
        },
      }); // closed

      setTasksByStatus({
        red: getTasksRed.concat(getReportsRed),
        yellow: getTasksYellow.concat(getReportsYellow),
        purple: getTasksPurple.concat(getReportsPurple),
        blue: getTasksBlue.concat(getReportsBlue),
        closed: getTasksClosed.concat(getReportsClosed),
      });

      setIsLoading(false);
    })();
  }, []);
  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Обратная связь</H1>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-2.5 mb-5">
        <div className="px-2.5 pt-[12px] rounded shadow-md bg-greylight">
          <div className="text-lg flex items-center gap-2.5 mb-2.5 font-bold">
            <div className="bg-red rounded-full w-2.5 h-2.5"></div>
            Срочные задачи
          </div>

          <div className="text-xl text-red">{tasksByStatus?.red.length}</div>
        </div>

        {/* <div className="px-2.5 pt-[12px] rounded shadow-md bg-greylight">
          <div className="text-lg flex items-center gap-2.5 mb-2.5 font-bold">
            <div className="bg-blue rounded-full w-2.5 h-2.5"></div>
            Другие задачи
          </div>

          <div className="text-xl text-blue">
            {tasksByStatus?.yellow.length}
          </div>
        </div> */}

        <div className="px-2.5 pt-[12px] rounded shadow-md bg-greylight">
          <div className="text-lg flex items-center gap-2.5 mb-2.5 font-bold">
            <div className="bg-green rounded-full w-2.5 h-2.5"></div>
            Закрытые задачи
          </div>

          <div className="text-xl text-green">
            {tasksByStatus?.closed.length} {tasksByStatus?.closed.length === 5 && " >"}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <PreloaderSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mt-2.5">
          <div id="red" className="h-[468px] overflow-y-scroll">
            {tasksByStatus?.red && tasksByStatus?.red.length
              ? tasksByStatus?.red.map((task) => {
                  return (
                    <TaskItem task={task} color={"red"} sections={sections} />
                  );
                })
              : "Задачи отсутствуют"}
          </div>
          {/* <div id="blue">
            {tasksByStatus?.blue && tasksByStatus?.blue.length > 0 ?
              tasksByStatus?.blue.map((task) => {
                return (
                  <TaskItem task={task} color={"yellow"} sections={sections} />
                );
              }) : "Задачи отсутствуют"}
          </div> */}
          <div id="closed" className="h-[468px] overflow-y-scroll">
            {tasksByStatus?.closed && tasksByStatus?.closed.length > 0
              ? tasksByStatus?.closed.map((task) => {
                  return (
                    <TaskItem
                      task={task}
                      color={"green"}
                      sections={sections}
                      type={"closed"}
                    />
                  );
                })
              : "Задачи отсутствуют"}
          </div>
          <div id="yellow" className="h-[468px]">
            {tasksByStatus?.yellow &&
              tasksByStatus?.yellow.map((task) => {
                return (
                  <TaskItem task={task} color={"yellow"} sections={sections} />
                );
              })}
          </div>
          <div id="purple" className="h-[468px]">
            {tasksByStatus?.purple &&
              tasksByStatus?.purple.map((task) => {
                return (
                  <TaskItem task={task} color={"purple"} sections={sections} />
                );
              })}
          </div>

          {/* <div>
          {tasks &&
            tasks.map((task) => {
              return <TaskItem task={task} />;
            })}
        </div>

        <div>
          <>
            {reports &&
              sections &&
              reports.map((report) => {
                const slugId =
                  report?.product?.section_relation &&
                  report?.product?.section_relation[0];
                const section = sections.find((el) => el.id == slugId);

                return <ReportItem report={report} section={section} />;
              })}
          </>
        </div> */}
        </div>
      )}
    </MotionContainer>
  );
}

const printTask = (task, color) => {
  return (
    <Link key={task.id} href={`/user/admin/tasks/${task.id}`}>
      <div
        className={`cursor-pointer border border-${color} border-solid px-2 py-2 mt-5`}
      >
        <div className="hover-underline text-blue">
          Обращение в Тех. поддержку{" "}
          {task.date_created && formateDate(task.date_created)} от пользователя
          ID: {task.user_id.id}
        </div>
        <div className={`text-${color}`}>
          Исполнитель:{" "}
          {task.admin
            ? `${task.admin.user_name} ID:${task.admin.id}`
            : "Никто ещё не взялся"}
        </div>
      </div>
    </Link>
  );
};
