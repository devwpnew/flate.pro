import Logo from "@modules/layout/components/common/logo";

export default function GuestPage() {
    return (
        <>


        <section className="max-w-7xl mx-auto text-center bg-blue-100">

            <div className="flex justify-between items-center py-5">

                <Logo className="w-[120px] max-w-[120px]" />

                <div className="flex items-center gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Скачать приложение</button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg">Войти в браузере</button>
                </div>

            </div>
            
        </section>


        <div className="h-[100px]"></div>
        

        <section className="max-w-7xl mx-auto text-center">

            <div className="flex flex-wrap justify-center gap-3">
                <div>Размещение и поиск объектов</div>
                <div>Подборки</div>
                <div>Статистика цен</div>
                <div>Каталог ЖК</div>
                <div>Шахматки</div>
            </div>

            <h1>Бесплатный онлайн-инструмент риелтора</h1>

            <div className="flex items-center justify-center gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Весь функционал в приложении</button>
                <button className="bg-primary text-white px-4 py-2 rounded-lg">Войти в браузере</button>
            </div>
            
        </section>
        
        

        <div className="h-[100px]"></div>
        
        
        
        <section className="max-w-7xl mx-auto text-center">

            <h2>Весь необходимый функционал для эффективной работы</h2>

            <p>Ведите базу агентства, собирайте статистику и закрывайте сделки </p>
            
        </section>


        <div className="h-[100px]"></div>
        
        
        
        <section className="max-w-7xl mx-auto text-center">

            <h2>Больше функционала в мобильном приложении</h2>

            <p>
                Доступно для всех платформ
                <span className="text-primary">бесплатно</span>
            </p>

            <div className="flex flex-wrap justify-center gap-3">
                <div>App Store</div>
                <div>Google Play</div>
                <div>Huawei</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <h3>Браузер</h3>

                    <div className="flex flex-wrap justify-center gap-3">
                        <div>Размещение</div>
                        <div>Поиск</div>
                    </div>

                </div>
                <div>
                    <h3>Приложение</h3>

                    <div className="flex flex-wrap justify-center gap-3">
                        <div>Размещение</div>
                        <div>Поиск</div>
                        <div>Подборки</div>
                        <div>Статистика цен</div>
                        <div>Каталог ЖК</div>
                        <div>Моё агентство</div>
                    </div>

                </div>
            </div>
            
        </section>

        <div className="h-[100px]"></div>


        <section className="max-w-7xl mx-auto text-center">

            <h2>Flate бесплатен</h2>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <h3>Без фейков</h3>
                    <p>В сервисе только риелторы.</p>
                </div>
                <div>
                    <h3>Увеличивает продажи</h3>
                    <p>Удобный поиск - быстрая сделка.</p>
                </div>
                <div>
                    <h3>Экономит время</h3>
                    <p>Забудьте про чаты.</p>
                </div>
            </div>




            <div>
                <h2>Вступайте в закрытое сообщество коллег</h2>
                <p>Более 1000 риелторов уже пользуются сервисом</p>

                <div className="flex items-center gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Скачать приложение</button>
                    <button className="bg-blue text-white px-4 py-2 rounded-lg">Войти в браузере</button>
                </div>
            </div>

            
        </section>


        <div className="h-[100px]"></div>


        <section className="max-w-7xl mx-auto text-center">

            <h2>Как ещё можно использовать Flate?</h2>
            <p>Ведите базу агентства, собирайте статистику и закрывайте сделки </p>



            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg">
                    <p>Мы используем для ведения всей базы нашего агентства. Всё в одном месте</p>
                </div>
            </div>

            
        </section>



        </>
    );
}