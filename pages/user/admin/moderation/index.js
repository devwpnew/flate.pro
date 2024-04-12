import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";

import AdminModerationTemplate from "@modules/admin/moderation/adminModerationTemplate";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";

export default function Moderation({ data }) {
  const router = useRouter();

  const user = useUser(data.user, "/user/profile/auth");

  useEffect(() => {
    if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
      router.push("/user/profile/auth");
    }
  }, [router, user]);

  return (
    <>
      {data.user ||
      (user && (user.user_group?.id === 1 || user.user_group?.id === 5)) ? (
        <div className="min-h-[610px]">
          <AdminModerationTemplate
            user={user ? user : data.user}
            isModeration={true}
          />
        </div>
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
