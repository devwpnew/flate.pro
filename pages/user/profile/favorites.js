import api from "pages/api/service/api";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import FavoritesTemplate from "@modules/user/components/favorites/template/favoritesTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import useUser from "hooks/useUser";

export default function Favorites({ data }) {
    const user = useUser(data.user, "/user/profile/auth");

    return (
        <>
            {user ? (
                <>
                    <FavoritesTemplate />
                </>
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
