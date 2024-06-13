import db from "lib/postgresql/db"
import api from "pages/api/service/api";

export default function Export({user, list}) {
    return <>
        <code>{JSON.stringify(list, null, 2)}</code>
    </>
}

export async function getServerSideProps({ req, res }) {

    const user = await api.auth.isUserAuthorized(req, res);

    console.log({user})

    const list = false //await db.any()

    // console.log({list})

    return {
        props: {
            user,
            list
        }
    }
}