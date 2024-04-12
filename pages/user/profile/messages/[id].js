import api from "pages/api/service/api";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import MessagesTemplate from "@modules/user/components/messages/template/messagesTemplate";

import useUser from "hooks/useUser";

export default function Chat({ data }) {
  const router = useRouter();
  const [dialogue, setDialogue] = useState(null);

  const user = useUser(data.user, "/user/profile/auth");

  useEffect(() => {
    if (router.query.id == "help") {
      setDialogue("help");
    } else {
      setDialogue(router.query.id);
    }
  }, [router.query.id]);

  // console.log(data, "data");

  return (
    <>
      {user && dialogue ? (
        <MessagesTemplate dialogue={dialogue} chatTemplate={true} />
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <PreloaderSpinner />
        </div>
      )}
    </>
  );
}
export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;
  const { id } = context.query;
  const window_host = process.env.DOMEN;

  const user = await api.auth.isUserAuthorized(req, res);

  let dialogItem = false;

  if(id != 'help') {
    const getDialogue = await api.get.dialogue({
      window_host: window_host,
      filter: { id: id },
      limit: 1,
    });
  
    dialogItem = getDialogue;
  
    const formUser = dialogItem?.from_user?.id;
    const toUser = dialogItem?.to_user?.id;
  
    if (user.id !== formUser && user.id !== toUser) {
      return {
        notFound: true,
      };
    }
  }

  return { props: { data: { user, dialogItem } } };
}