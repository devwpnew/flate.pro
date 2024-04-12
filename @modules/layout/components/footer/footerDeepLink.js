import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import { useRouter } from "next/router";
import React from "react";

export default function FooterDeepLink() {
  const router = useRouter();

  const currentUrl = "https://flate.pro" + router.asPath;

  function handleLinkClick(event) {
    var link = event.target;

    try {
      // Пытаемся создать URL из атрибута href
      var url = new URL(link.href);

      // Ваш код обработки URL (например, перенаправление на другую страницу)
      // ...
    } catch (error) {
      // Обработка ошибки
      if (error instanceof DOMException && error.name === "SyntaxError") {
        // Ошибка "the scheme does not have a registered handler"
        // alert('Ошибка: Неверный формат URL');

        var redirectTo = getRedirectUrl();
        window.location.href = redirectTo;

      } else {
        // Другие ошибки
        var redirectTo = getRedirectUrl();
        window.location.href = redirectTo;
      }

      // Предотвращаем переход по ссылке
      event.preventDefault();
    }
  }

  function getRedirectUrl() {
    // Получаем информацию о пользовательском агенте
    var userAgent = navigator.userAgent.toLowerCase();

    // Определяем, на каком устройстве находится пользователь и возвращаем соответствующую ссылку
    if (userAgent.match(/android/i)) {
      // Если пользователь на Android
      return "https://play.google.com/store/apps/details?id=flate.pro";
    } else if (userAgent.match(/iphone|ipad|ipod/i)) {
      // Если пользователь на iOS
      return "https://apps.apple.com/ru/app/flate/id6458738854";
    } else {
      // Если устройство не распознано, возвращаем стандартную ссылку
      return "https://apps.apple.com/ru/app/flate/id6458738854";
    }
  }

  return (
    <div className="bg-blue">
      <Container>
        <a
          className={"flex justify-between items-center py-2.5"}
          href={`flate.pro://${currentUrl}`}
          onClick={handleLinkClick}
        >
          <span className="text-white">Продолжить в приложении</span>

          <div className="ml-auto">
            <Button type="white" className="p-1">
              Открыть
            </Button>
          </div>
        </a>
      </Container>
    </div>
  );
}
