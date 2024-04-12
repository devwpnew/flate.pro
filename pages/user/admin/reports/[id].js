import AdminTasksTemplate from "@modules/admin/tasks/adminTasksTemplate";
import Container from "@modules/common/components/container/container";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Report({ data }) {
  const router = useRouter();

  const user = useUser(data.user, "/user/profile/auth");

  useEffect(() => {
    if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
      router.push("/user/profile/auth");
    }
  }, [router, user]);


  const taskId = router.query.id;
  const [task, setTask] = useState();

  useEffect(() => {
    (async function fetchTask() {
      const getTask = await api.get.tasks(
        {
          window_host: window.location.origin,
          filter: { id: taskId },
          limit: 1,
        },
        true
      );
      setTask(getTask);
    })();
  }, [taskId]);

  const setCurrentUserExec = async () => {
    if (task && !task.admin) {
      if (user.user_group?.id == 1 || user.user_group?.id == 5) {
        const setCurUserExec = await api.set.taskExecutor(task.id, user.id);
        // console.log("test", setCurUserExec);
      }
    }
  };

  return (
    <>
      {user && (user.user_group?.id === 1 || user.user_group?.id === 5) ? (
        <>
          <button
            className="text-sm text-white px-5 py-2 h-full rounded md:text-black font-normal hover:border-bluelight transition-colors bg-blue hover:bg-bluelight "
            onClick={setCurrentUserExec}
          >
            я делаю
          </button>
        </>
      ) : (
        <Container>
          <div className="flex flex-row items-center justify-center">
            <PreloaderSpinner />
          </div>
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;

  const user = await api.auth.isUserAuthorized(req, res);

  return { props: { data: { user } } };
}
