import Logo from "@modules/layout/components/common/logo";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Head from "next/head";

export default function GuestPage() {
    const [isOpen, setIsOpen] = useState(false);

    const functions = [
        {
            img: "/hello/2.png",
            bgClassName: "bg-[#1479F5]/10",
            title: "Размещение и поиск объектов",
            text: "Пользоваться приложением могут только риелторы. Без фейков и клиентов.",
        },
        {
            img: "/hello/3.png",
            bgClassName: "bg-[#D44D4D]/10",
            title: "Создание подборок и отправка",
            text: "Собирайте по параметрам и скидывайте готовую подборку  клиенту",
        },
        {
            img: "/hello/4.png",
            bgClassName: "bg-[#14B367]/10",
            title: "Каталог ЖК",
            text: "С телефонами ОП, шахматками, презентациями и фиксацией клиента",
        },
        {
            img: "/hello/5.png",
            bgClassName: "bg-[#1479F5]/10",
            title: "Статистика цен",
            text: "По ЖК и районам. Ориентируйтесь в рынке в считаные секунды.",
        },
    ];

    const feedbacks = [
        {
            img: "/hello/13.png",
            text: "Мы используем для ведения всей базы нашего агентства. Всё в одном месте",
        },
        {
            img: "/hello/14.png",
            text: "Статистика цен мастхев! Позволяет быстро сориентировать клиента",
        },
        {
            img: "/hello/15.png",
            text: "Удивило количество предложений. Уже во время разговора с клиентом предлагаю десятки вариантов.",
        },
        {
            img: "/hello/16.png",
            text: "Создала подборки по частым запросам: с видом на море, предсдача и тд. и сразу скидываю клиентам.",
        },
        {
            img: "/hello/17.png",
            text: "Наконец-то удобно искать не только заезженные ЖК, а просто по нужным параметрам.",
        },
    ];

    return (
        <>
            <Head>
                <title>
                    Купить или продать недвижимость в городе Сочи – сайт
                    недвижимости FLATE.PRO
                </title>
                <meta
                    name="description"
                    content="Купить или продать недвижимость в городе Сочи – сайт недвижимости FLATE.PRO"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon.svg"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="60x60"
                    href="/favicon.svg"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon.svg"
                />
                <link rel="manifest" href="/manifest.json" />
            </Head>

            {/* modal */}
            <div>
                <Dialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="fixed z-10 inset-0 overflow-y-auto"
                >
                    <div className="flex items-end justify-center min-h-screen  p-10 text-center sm:block">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-center text-2xl font-extrabold leading-[100%] tracking-[-0.8px] text-black"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Скачать приложение
                                        </Dialog.Title>

                                        <div className="mt-2">
                                            <p className="text-center text-sm text-gray-500">
                                                Выберите платформу для
                                                скачивания приложения:
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white px-4 py-3 sm:px-6 sm:flex justify-center gap-2">
                                <Link
                                    href="https://apps.apple.com/ru/app/flate/id6458738854"
                                    target="_blank"
                                >
                                    <button className="bg-[#1479F5] text-white px-4 py-2 rounded-lg">
                                        App Store
                                    </button>
                                </Link>
                                <Link
                                    href="https://play.google.com/store/apps/details?id=flate.pro"
                                    target="_blank"
                                >
                                    <button className="bg-[#1479F5] text-white px-4 py-2 rounded-lg">
                                        Google Play
                                    </button>
                                </Link>
                                <Link
                                    href="https://app.flate.pro/huawei"
                                    target="_blank"
                                >
                                    <button className="bg-[#1479F5] text-white px-4 py-2 rounded-lg">
                                        Huawei
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>

            <section className="w-full mx-auto text-center bg-[#1479F5]/10 rounded-b-[30px] md:rounded-b-[100px]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex justify-center md:justify-between items-center py-5">
                        <Logo className="w-[200px] max-w-[200px] mt-5 mx-auto" />
{/* 
                        <div className="items-center gap-2 hidden md:flex">
                            <button
                                className="bg-[#1479F5] text-white px-5 py-3 rounded-xl"
                                onClick={() => setIsOpen(true)}
                            >
                                Скачать приложение
                            </button>
                            <Link href="/user/profile/auth">
                                <button className="text-[#1479F5] border border-[#1479F5] px-4 py-2 rounded-lg">
                                    Войти в браузере
                                </button>
                            </Link>
                        </div> */}
                    </div>

                    <div className="h-[20px] md:h-[30px]"></div>

                   

                    <h1 className="text-[32px] md:text-[64px] leading-[95%] tracking-[-1.3px] font-extrabold">
                        Онлайн-инструмент риелтора
                    </h1>

                    <div className="h-[20px] md:h-[30px]"></div>

                    <div className="flex flex-wrap justify-center gap-2">
                        <div className="bg-white rounded-full px-4 py-2">
                            Размещение и поиск объектов
                        </div>
                        <div className="bg-white rounded-full px-4 py-2">
                            Подборки
                        </div>
                        <div className="bg-white rounded-full px-4 py-2">
                            Статистика цен
                        </div>
                        <div className="bg-white rounded-full px-4 py-2">
                            Каталог ЖК
                        </div>
                        <div className="bg-white rounded-full px-4 py-2">
                            Шахматки
                        </div>
                    </div>

                    <div className="h-[20px] md:h-[30px]"></div>

                    <div className="flex items-center justify-center gap-2">
                        <button
                            className="bg-[#1479F5] text-white px-6 py-4 rounded-xl hidden md:block"
                            onClick={() => setIsOpen(true)}
                        >
                            Скачать приложение
                        </button>
                        <button
                            className="bg-[#1479F5] text-white px-6 py-4 rounded-xl md:hidden"
                            onClick={() => setIsOpen(true)}
                        >
                            Скачать
                        </button>
                        <Link href="/user/profile/auth">
                            <button className="text-[#1479F5] border border-[#1479F5] px-6 py-4 rounded-xl">
                                Войти в браузере
                            </button>
                        </Link>
                    </div>

                    <div className="h-[40px]"></div>

                    <div className="relative h-[450px] hidden md:flex">
                        <Image
                            src="/hello/1.png"
                            alt="hero"
                            className="w-full h-auto object-cover"
                            layout="fill"
                        />
                    </div>

                    <div className="relative md:hidden">
                        <Image
                            className="w-full h-full rounded-b-[30px] object-contain"
                            src="/hello/1.1.png"
                            alt="hero"
                            width={0}
                            height={0}
                            sizes="100vw"
                        />
                    </div>
                </div>
            </section>

            <div className="h-[60px] md:h-[140px]"></div>

            <section className="max-w-[1200px] px-[10px] md:px-0 mx-auto text-center">
                <h2 className="text-[32px] md:text-[64px] leading-[100%] tracking-[-1.3px] font-extrabold mb-[30px]">
                    Весь необходимый функционал для эффективной работы
                </h2>

                <p className="text-[16px] md:text-[24px] tracking-[-0.8px] mb-[60px] font-medium">
                    Ведите базу агентства, собирайте статистику и закрывайте
                    сделки
                </p>

                <div className="grid md:grid-cols-2 gap-[10px] md:gap-[30px]">
                    {functions.map((item, index) => (
                        <div
                            key={index}
                            className={`rounded-[30px] ${item.bgClassName}`}
                        >
                            
                            <Image
                                src={item.img}
                                alt={item.title}
                                width={500}
                                height={400}
                            />

                            <div className="px-10 pb-10">
                                <h3 className="text-[24px] md:text-[32px] leading-[100%] tracking-[-0.8px] font-extrabold mb-[15px]">
                                    {item.title}
                                </h3>
                                <p className="text-[16px] font-medium">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-[60px] md:h-[140px]"></div>

            <section className="w-full mx-auto text-center bg-[#1479F5]/10 rounded-[30px] md:rounded-[100px] py-[60px] md:py-[120px]">
                <div className="max-w-[1200px] px-[10px] md:px-0 mx-auto text-center">
                    <h2 className="text-[32px] md:text-[64px] leading-[95%] tracking-[-1.3px] font-extrabold mb-[40px]">
                        Больше функционала в мобильном приложении
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-[20px] mb-[20px]">
                        <p className="order-last md:order-first text-[24px] leading-[100%] tracking-[-0.8px] font-medium">
                            Доступно для всех платформ
                        </p>
                        <p className="text-[16px] leading-[100%] font-medium text-white bg-gradient-to-r from-[#00CF8A] to-[#1479F5] px-5 py-4 rounded-full">
                            бесплатно
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="https://apps.apple.com/ru/app/flate/id6458738854">
                            <button className="bg-[#1479F5] text-white px-6 py-4 rounded-2xl">
                                App Store
                            </button>
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=flate.pro">
                            <button className="bg-[#1479F5] text-white px-6 py-4 rounded-2xl">
                                Google Play
                            </button>
                        </Link>
                        <Link href="https://app.flate.pro/huawei">
                            <button className="bg-[#1479F5] text-white px-6 py-4 rounded-2xl">
                                Huawei
                            </button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-[10px] md:gap-6 mt-20">
                        <div className="rounded-3xl border border-[#1479F5] p-10">
                            <Image
                                src="/hello/6.png"
                                alt="browser"
                                width={230}
                                height={230}
                            />

                            <h3 className="text-[28px] leading-[100%] tracking-[-0.8px] font-bold mb-[30px]">
                                Браузер
                            </h3>

                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="bg-white px-4 py-2 rounded-full">
                                    Размещение
                                </div>
                                <div className="bg-white px-4 py-2 rounded-full">
                                    Поиск
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white p-10">
                            <Image
                                src="/hello/7.png"
                                alt="browser"
                                width={230}
                                height={230}
                            />

                            <h3 className="text-[28px] leading-[100%] tracking-[-0.8px] font-bold mb-[30px]">
                                Приложение
                            </h3>

                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="bg-[#1479F5]/10 px-4 py-2 rounded-full">
                                    Размещение
                                </div>
                                <div className="bg-[#1479F5]/10 px-4 py-2 rounded-full">
                                    Поиск
                                </div>
                                <div className="bg-[#1A1F25] text-white px-4 py-2 rounded-full">
                                    Подборки
                                </div>
                                <div className="bg-[#1A1F25] text-white px-4 py-2 rounded-full">
                                    Статистика цен
                                </div>
                                <div className="bg-[#1A1F25] text-white px-4 py-2 rounded-full">
                                    Каталог ЖК
                                </div>
                                <div className="bg-[#1A1F25] text-white px-4 py-2 rounded-full">
                                    Моё агентство
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-[60px] md:h-[140px]"></div>

            <section className="max-w-[1200px] px-[10px] md:px-0 mx-auto text-center">
                <h2 className="text-[32px] md:text-[64px] leading-[95%] tracking-[-1.3px] font-extrabold mb-[40px] md:mb-[80px]">
                    Чем полезен Flate
                </h2>

                <div className="grid md:grid-cols-3 gap-[10px] md:gap-[30px]">
                    <div className="rounded-3xl bg-[#1479F5]/10 p-10">
                        <Image
                            src="/hello/8.png"
                            alt="browser"
                            width={130}
                            height={130}
                        />
                        <h3 className="text-[28px] leading-[100%] tracking-[-0.8px] font-bold mb-[15px]">
                            Без фейков
                        </h3>
                        <p className="text-[16px] leading-[100%] tracking-[-0.8px] font-medium">
                            В сервисе только риелторы.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-[#1479F5]/10 p-10">
                        <Image
                            src="/hello/9.png"
                            alt="browser"
                            width={130}
                            height={130}
                        />
                        <h3 className="text-[28px] leading-[100%] tracking-[-0.8px] font-bold mb-[15px]">
                            Увеличивает продажи
                        </h3>
                        <p className="text-[16px] leading-[100%] tracking-[-0.8px] font-medium">
                            Удобный поиск - быстрая сделка.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-[#1479F5]/10 p-10">
                        <Image
                            src="/hello/10.png"
                            alt="browser"
                            width={130}
                            height={130}
                        />
                        <h3 className="text-[28px] leading-[100%] tracking-[-0.8px] font-bold mb-[15px]">
                            Экономит время
                        </h3>
                        <p className="text-[16px] leading-[100%] tracking-[-0.8px] font-medium">
                            Забудьте про чаты.
                        </p>
                    </div>
                </div>

                <div className="h-[10px] md:h-[30px]"></div>

                <div className="bg-[#14B367]/10 rounded-3xl grid md:grid-cols-2 gap-10">
                    <div className="pt-[40px] px-[20px] md:p-10 my-auto">
                        <h2 className="text-[36px] leading-[95%] tracking-[-1.3px] font-extrabold mb-[30px]">
                            Вступайте в закрытое сообщество коллег
                        </h2>

                        <div className="bg-white w-full md:w-fit rounded-[20px] md:rounded-full p-3 flex flex-col md:flex-row items-center gap-4 mb-5">
                            <div className="flex items-center h-[70px]">
                                <div>
                                    <Image
                                        src="/hello/13.png"
                                        alt="browser"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="ml-[-10px] border border-white rounded-full">
                                    <Image
                                        src="/hello/14.png"
                                        alt="browser"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="ml-[-10px] border border-white rounded-full">
                                    <Image
                                        src="/hello/15.png"
                                        alt="browser"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="ml-[-10px] border border-white rounded-full">
                                    <Image
                                        src="/hello/16.png"
                                        alt="browser"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="ml-[-10px] border border-white rounded-full">
                                    <Image
                                        src="/hello/17.png"
                                        alt="browser"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                            </div>

                            <p className="md:text-left">
                                Более 1000 риелторов уже пользуются сервисом
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                            <button
                                className="bg-[#1479F5] text-white px-6 py-4 rounded-xl w-full md:w-auto"
                                onClick={() => setIsOpen(true)}
                            >
                                Скачать приложение
                            </button>
                            <Link href="/user/profile/auth">
                                <button className="text-[#1479F5] border border-[#1479F5] px-6 py-4 rounded-xl w-full md:w-auto">
                                    Войти в браузере
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative min-h-[350px] md:min-h-[450px]">
                        <Image
                            src="/hello/11.1.png"
                            alt="browser"
                            className="object-contain"
                            width={0}
                            height={0}
                            layout="fill"
                        />
                    </div>
                </div>
            </section>

            <div className="h-[60px] md:h-[140px]"></div>

            <section className="w-full mx-auto text-center bg-[#1479F5]/10 rounded-t-[30px] md:rounded-t-[100px] pt-[40px] md:pt-[120px] pb-[50px]">
                <div className="max-w-[1200px] px-[10px] md:px-0 mx-auto text-center">
                    <h2 className="text-[32px] md:text-[64px] leading-[95%] tracking-[-1.3px] font-bold">
                        Как ещё можно использовать Flate?
                    </h2>

                    <div className="h-[20px] md:h-[30px]"></div>

                    <p className="text-[16px] md:text-[24px] leading-[100%] tracking-[-0.8px] font-medium">
                        Фидбек пользователей
                    </p>

                    <div className="h-[30px] md:h-[40px]"></div>

                    <div className="grid md:grid-cols-2 gap-[10px] md:gap-6">
                        {feedbacks.map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white p-3 rounded-2xl flex items-center gap-3 ${
                                    index === feedbacks.length - 1 &&
                                    feedbacks.length % 2 !== 0
                                        ? "md:col-span-2 md:justify-center md:max-w-[50%] md:mx-auto"
                                        : ""
                                }`}
                            >
                                <div className="w-[60px] h-[60px] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]">
                                    <Image
                                        src={item.img}
                                        alt="Отзыв"
                                        width={60}
                                        height={60}
                                        className="rounded-full"
                                    />
                                </div>
                                <p className="text-left">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="h-[60px] md:h-[80px]"></div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-3xl border bg-white p-10">
                            <Image
                                src="/hello/7.png"
                                alt="browser"
                                width={230}
                                height={230}
                            />

                            <h3 className="text-[24px] md:text-[28px] leading-[100%] tracking-[-0.8px] font-extrabold mb-[30px]">
                                Скачайте приложение с расширенным функционалом
                            </h3>

                            <button
                                className="bg-[#1479F5] text-white px-6 py-4 rounded-xl"
                                onClick={() => setIsOpen(true)}
                            >
                                Скачать
                            </button>
                        </div>
                        <div className="rounded-3xl border border-[#1479F5] p-10">
                            <Image
                                src="/hello/6.png"
                                alt="browser"
                                width={230}
                                height={230}
                            />

                            <h3 className="text-[24px] md:text-[28px] leading-[100%] tracking-[-0.8px] font-extrabold mb-[30px]">
                                Или оцените масштаб базы в десктопной версии
                            </h3>

                            <Link href="/user/profile/auth">
                                <button className="border border-[#1479F5] text-[#1479F5] px-6 py-4 rounded-xl">
                                    Войти
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="justify-between items-center py-5 mt-20 hidden md:flex">
                        <Logo className="w-[120px] max-w-[120px]" />

                        <div className="flex items-center gap-2">
                            <button
                                className="bg-[#1479F5] text-white px-5 py-3 rounded-xl"
                                onClick={() => setIsOpen(true)}
                            >
                                Скачать приложение
                            </button>
                            <Link href="/user/profile/auth">
                                <button className="text-[#1479F5] border border-[#1479F5] px-4 py-2 rounded-lg">
                                    Войти в браузере
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
