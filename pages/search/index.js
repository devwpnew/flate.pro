import API from "pages/api/service/api";

import CategoryTemplate from "@modules/posts/type/category/template/categoryTemplate";

import useUser from "hooks/useUser";

export default function Search(data) {
  const user = useUser(data.user);

  return (
    <>
      <CategoryTemplate section={{name:'Поиск'}} isRow={true} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;

  const user = await API.auth.isUserAuthorized(req, res);

  return { props: { data: { user } } };
}
