import Container from "@modules/common/components/container/container";
import ProfileTemplate from "@modules/user/components/profile/template/profileTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import useUser from "hooks/useUser";
import api from "pages/api/service/api";

export default function Profile({ data }) {
  const user = useUser(data.user, "/user/profile/auth");

  // console.log("user", user);

  return (
    <>
      {user ? (
        <ProfileTemplate user={user} />
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
