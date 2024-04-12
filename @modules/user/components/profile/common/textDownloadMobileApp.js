import Image from "next/image";
import googlePlayImage from "public/d-google.jpg";
import appStoreImage from "public/d-appstore.jpg";
import downloadImage from "public/d-app.jpg";
import getLayout from "helpers/getLayout";
import Link from "next/link";
export default function TextDownloadMobileApp() {
  const { MOBILE } = getLayout();
  const curYear = new Date().getFullYear();
  return (
    <>
      {MOBILE ? (
        <>
          <div className="mb-2.5">
            <span className="text-bold text-lg">Скачать приложение</span>
          </div>
          <div className="mb-4">
            <span className="text-sm">
              Установите мобильное приложение! Большая и актуальная база
              недвижимости вашего города, у вас в кармане.
            </span>
          </div>
          <a target="_blank" href="https://app.flate.pro">
            <div className="flex gap-1 mb-7 cursor-pointer">
              <Image
                src={appStoreImage.src}
                width={appStoreImage.width}
                height={appStoreImage.height}
              />
              <Image
                src={googlePlayImage.src}
                width={googlePlayImage.width}
                height={appStoreImage.height}
              />
            </div>
          </a>
          <div className="mb-4">
            <p className="text-sm">
              © 2009–{curYear}, ООО «Сравни.ру». При использовании материалов
              гиперссылка на flate.pro обязательна. ИНН 7710718303, ОГРН
              1087746642774. 109544, г. Москва, бульвар Энтузиастов, дом 2, 26
              этаж. <br />
              <br />
              Мы используем файлы cookie для того, чтобы предоставить
              пользователям больше возможностей при посещении сайта flate.pro.
              Подробнее об условиях использования.
            </p>
          </div>
        </>
      ) : (
        <Image
          src={downloadImage.src}
          width={downloadImage.width}
          height={downloadImage.height}
        />
      )}
    </>
  );
}
