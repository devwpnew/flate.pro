import Button from '@modules/common/components/button/button';
import Container from '@modules/common/components/container/container';
import Preloader from '@modules/common/components/preloader/preloader';
import useUser from 'hooks/useUser';
import { useRouter } from 'next/router';
import api from 'pages/api/service/api';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function BannersEditTestById(data) {

    const [currentBanner, setCurBanner] = useState(false)
    const [previewImage, setPreviewImage] = useState(false)

    const user = useUser(data.user, "/user/profile/auth");


    const router = useRouter()
    const bannerId = router?.query?.id

    useEffect(() => {
      (async () => {
        if(user){
            if(user?.user_group?.id != 5){
                // console.log('not a super')
                router.push('/')
            }
            const getBanner = await api.get.bannerById(bannerId)
            setCurBanner(getBanner)
        }
      })()
    }, [user])

    async function sendEdit (e) {
        e.preventDefault();
        let formData = new FormData(e.target);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ' - ' + pair[1]); 
        // }

        const res = await api.update.banner(formData);

        // console.log('res', res)
    }

    return (
        <Container>
            {currentBanner ? (
                <form onSubmit={sendEdit} encType="multipart/form-data" >
                    {/* {console.log(currentBanner)} */}
                    <input type='hidden' name='id' value={currentBanner.id} />
                    <h1 className='mt-5 text-primary text-2xl lg:text-[32px] font-bold'>{currentBanner.name}</h1>

                    <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                        <label htmlFor="active" className="flex items-center mb-2.5 text-sm cursor-pointer">
                            <div className='mr-2'>Включен</div>
                            <input
                                id="active"
                                type="checkbox"
                                name="active"
                                defaultChecked={currentBanner.active ? true : false}
                                className="bg-white border-greymiddle border w-[12px] h-[12px] flex flex-row justify-center items-center cursor-pointer"
                            />
                        </label>
                    
                        <label htmlFor="date_active_to" className="flex items-center mb-2.5 text-sm cursor-pointer">
                            <div className='mr-2'>Дата (до)</div>
                            <input className='border' type='date' id='date_active_to' name='date_active_to' />
                        </label>

                        <label htmlFor="image" className="flex items-center mb-2.5 text-sm cursor-pointer">
                            <div className='mr-2'>Изображение</div>
                            <input type='file' id='image' name='image' multiple={false} accept="image/*" onChange={(e) => {
                                // console.log(e.target);
                                setPreviewImage(e.target.files[0]);
                            }} />
                        </label>

                        {previewImage ? (
                            // console.log('previewImage', previewImage)
                            <img className="max-w-[200px] max-h-[200px]" src={URL.createObjectURL(previewImage)} />
                        ) : (<></>)}

                        <label htmlFor="button_name" className="flex items-center mb-2.5 text-sm cursor-pointer">
                            <div className='mr-2'>Текст на кнопке</div>
                            <input className='border' type='text' name='button_name' id='button_name' />
                        </label>

                        <label htmlFor="url" className="flex items-center mb-2.5 text-sm cursor-pointer">
                            <div className='mr-2'>Url</div>
                            <input className='border' type='text' name='url' id='url' />
                        </label>
                    </div>
                    <div className="flex justify-end w-full mt-[10px]">
                        <div className="w-[130px] h-[33px]">
                            <Button>Сохранить</Button>
                        </div>
                    </div>
                </form>
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