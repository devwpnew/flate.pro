import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import ItemsTemplate from "@modules/user/components/items/template/itemsTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import api from "pages/api/service/api";
import useUser from "hooks/useUser";

export default function ItemID({ data }) {
  const router = useRouter();
  const productId = router.query.id;

  const user = useUser(data.user, "/user/profile/auth");

  return (
    <>
      {user ? (
        <ItemsTemplate editTemplate={true} productId={productId} />
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
  const window_host = process.env.DOMEN;
  const { id } = context.query;

  const user = await api.auth.isUserAuthorized(req, res);

  const product = await api.get.product.list({
    window_host: window_host,
    filter: {
      id: id,
    },
    limit: 1,
  });
  
  // console.log(product);

  if (user.id !== product.user_id.id) {
    return {
      notFound: true,
    };
  }

  return { props: { data: { user } } };
}
