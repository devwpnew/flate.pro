import API from "pages/api/service/api";
import { useRouter } from "next/router";

export default function Text({ response }) {
    return (
        <>
            <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
            <pre style={{ fontFamily: 'monospace', fontSize: '14px', color: '#333' }}>
                {JSON.stringify(response, null, 2)}
            </pre>
        </div>
        </>
    );
}

export async function getServerSideProps(context) {
    let response;

    try {
        response = await API.get.rcs({
            filter: {
                city_link: "5",
                payment_type: [6],
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
