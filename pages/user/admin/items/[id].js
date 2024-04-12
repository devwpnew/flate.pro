import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import AdminProductEditTemplate from "@modules/admin/products/edit/adminProductEditTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import { isUserAuthorized } from "pages/api/user/auth";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";

export default function User({ data }) {
  const router = useRouter();
  const productId = router.query.id;

  const user = useUser(data.user, "/user/profile/auth");

  useEffect(() => {
    if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
      router.push("/user/profile/auth");
    }
  }, [router, user]);

  return (
    <>
      {user && (user.user_group?.id === 1 || user.user_group?.id === 5) ? (
        <div className="min-h-[610px]"><AdminProductEditTemplate productId={productId} user={user} /></div>
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
