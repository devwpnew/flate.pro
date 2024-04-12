import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import AdminUsersAddTemplate from "@modules/admin/users/add/adminUsersAddTemplate";

import { isUserAuthorized } from "pages/api/user/auth";
import useUser from "hooks/useUser";
import { useEffect } from "react";
import api from "pages/api/service/api";

export default function Users({ data }) {
  const router = useRouter();

  const user = useUser(data.user, "/user/profile/auth");

  useEffect(() => {
    if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
      router.push("/user/profile/auth");
    }
  }, [router, user]);

  return (
    <>
      {data?.user ||
      (user && (user?.user_group?.id === 1 || user?.user_group.id === 5)) ? (
        <div className="min-h-[610px]">
          <AdminUsersAddTemplate user={user} />
        </div>
      ) : (
        <Container>
          <div className="flex flex-row items-center justify-center h-full">
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
