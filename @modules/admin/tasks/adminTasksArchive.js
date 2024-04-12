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

export default function AdminTasksArchive({ user }) {
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

      const getTasksClosed = await api.get.tasks({
        filter: { status: 5 },
        limit: "all",
        sort: {
          date_created: "asc",
        },
      }); // closed

      const getReportsClosed = await api.get.reports({
        filter: { status: 5 },
        limit: "all",
        sort: {
          date_created: "asc",
        },
      }); // closed

      setTasksByStatus({
        closed: getTasksClosed.concat(getReportsClosed),
      });

      setIsLoading(false);
    })();
  }, []);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Архив задач - {tasksByStatus?.closed.length}</H1>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <PreloaderSpinner />
        </div>
      ) : (
        <div className="mt-2.5">
          <div id="closed" className="grid grid-cols-4 gap-2">
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
