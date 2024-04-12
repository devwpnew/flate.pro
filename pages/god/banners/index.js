import Container from '@modules/common/components/container/container';
import Preloader from '@modules/common/components/preloader/preloader';
import { printDateFormatted } from 'helpers/dateFunctions';
import useUser from 'hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from 'pages/api/service/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function BannersEditTestIndex({data}) {

    const [bannersList, setBannersList] = useState(false);

    const user = useUser(data.user, "/user/profile/auth");

    const router = useRouter()

    useEffect(() => {
      (async () => {
        if(user){
            if(user?.user_group?.id != 5){
                router.push('/')
            }
            const getBannersList = await api.get.banners();
            setBannersList(getBannersList ? getBannersList : 'false')
        }
      })()
    }, [user])

    return (
        <Container>
            {bannersList ? (
                Array.isArray(bannersList) && bannersList.length ? (
                    <table className={`w-full mt-10`}>
                        <thead>
                            <tr>
                                <th className='border border-slate-600'>Название</th>
                                <th className='border border-slate-600'>Активен</th>
                                <th className='border border-slate-600'>Дата (до)</th>
                                <th className='border border-slate-600'>Ссылка</th>
                                <th className='border border-slate-600'>Превью изображения</th>
                            </tr>
                        </thead>
                        <tbody>
                            { bannersList.map((item) => { return (
                                <Link key={item.id} href={`/god/banners/${item.id}`}>
                                    <tr className='cursor-pointer hover:bg-blue_500'>
                                        <th className='border border-slate-600'>{item?.name}</th>
                                        <th className='border border-slate-600'>{item.active ? 'Да' : 'Нет'}</th>
                                        <th className='border border-slate-600'>{item.date_active_to ? printDateFormatted(item.date_active_to, process.env.TIMEZONE) : ''}</th>
                                        <th className='border border-slate-600'>{item?.url}</th>
                                        <th className='border border-slate-600'>
                                            {item.image ? (
                                                <div className='flex justify-center'>
                                                    <img className='max-w-[200px] max-h-[200px]' src={`https://flate.pro/${item.image}`}></img>
                                                </div>
                                            ) : (
                                                <div>No images</div>
                                            )}
                                        </th>
                                    </tr>
                                </Link>
                            )})}
                        </tbody>
                    </table>
                ) : ( 
                    <>Нету</> 
                )
            ) : (
                <Preloader></Preloader>
            )}
        </Container>
    )
}

export async function getServerSideProps({ req, res }) {
    let data = {}

    require('dotenv').config()

    const getUser = await api.auth.isUserAuthorized(req, res);
    const user = (getUser) ? getUser : {};

    return { props: {data: { user } } };
}