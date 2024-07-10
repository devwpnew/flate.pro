import API from "pages/api/service/api";
import { useRouter } from "next/router";

export default function Text({ response }) {
    return (
        <>
            <pre>{JSON.stringify(response)}</pre>
        </>
    );
}

export async function getServerSideProps(context) {
    let response;

    try {
        response = await API.get.rcs({
            filter: {
                city_link: "5",
                payment_type: [1],
                published: "1",
            },
            limit: 20,
            page: 1,
            sort: { rating: "DESC" },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        response = null; // или вы можете передать пустой объект: {}
    }

    return {
        props: {
            response: response || null, // Убедитесь, что response не undefined
        },
    };
}
