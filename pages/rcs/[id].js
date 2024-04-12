import api from "pages/api/service/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import CategoryTemplate from "@modules/posts/type/category/template/categoryTemplate";

import useUser from "hooks/useUser";
import FourOhFour from "pages/404";
import SEO from "@modules/common/components/seo/seo";

export default function Rc({ data }) {
  const rcLink = data?.rcLink;
  const rcPage = rcLink && rcLink[0];
  const rcId = rcLink && rcLink[0].id;

  const user = useUser(data.user);

  // useEffect(() => {
  //   if (!rcId) {
  //     router.push("/");
  //   }
  // }, []);

  return !rcId ? (
    <FourOhFour></FourOhFour>
  ) : (
    <>
      <SEO
        title={rcPage.name}
        description={`Объявления в ${rcPage.name}`}
        descriptionFull={rcPage.description}
        url={"https://flate.pro/rc/" + rcPage.id}
      />
      <CategoryTemplate
        isRow={true}
        section={{ name: "rcId" }}
        rcLink={rcLink && rcLink[0]}
        rcId={rcId && rcId}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const window_host = process.env.DOMEN;
  const { req, res } = context;
  const { id } = context.query;
  const user = await api.auth.isUserAuthorized(req, res);

  const rcLink = await api.get.rcs({
    window_host: window_host,
    filter: { id: id, published: "1" },
    sort: {
      id: "asc",
    },
    limit: "all",
  });

  const data = {};

  if (user) {
    data["user"] = user;
  }

  if (rcLink) {
    data["rcLink"] = rcLink;
  } else {
    return {
      notFound: true,
    };
  }

  return { props: { data } };
}
