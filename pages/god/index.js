import api from "pages/api/service/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Container from "@modules/common/components/container/container";
import AdminAuthForm from "@modules/common/components/admin/auth/adminAuthForm";

import useUser from "hooks/useUser";
import useFilterProps from "hooks/filter/useFilterProps";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import FilterFields from "@modules/posts/type/category/part/filterFields";
import FilterNew from "@modules/posts/type/category/part/filterNew";

export default function GodAdminIndex({ data }) {
  const router = useRouter();
  const user = useUser(data.user);

  return (
    <>
      <Container>
        {!user && (
          <>
            <AdminAuthForm data={data} />
          </>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  let data = {};

  data.tables = [];
  require("dotenv").config();

  const user = await api.auth.isUserAuthorized(req, res);

  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ipModified = ip == "::1" ? "127.0.0.1" : ip;

  data.domen = process.env.DOMEN;
  data.ip = ipModified;
  data.userAgent = req.headers["user-agent"];

  if (user) {
    data["user"] = user;
  }

  const props = {
    data: { ...data },
  };

  return { props };
}
