import { useState, useEffect } from "react";
import API from "pages/api/service/api";

const useFavorites = (user) => {
  // Устанавливаем начальное состояние для значений. 
  const [favoritesList, setFavoritesList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Флаг отмены запроса.
    let didCancel = false;

    const fetchFavorites = async () => {
      setIsLoading(true);

      try {
        // Запрос на получение избранных продуктов по ID пользователя.
        const favorites = await API.get.favoritesById(user.id);

        if (!didCancel && favorites) {
          // Делаем несколько запросов на получение информации о каждом продукте в списке.
          const res = await Promise.all(
            favorites.map(async (favoriteProduct) => {
              const response = await API.get.product.list({
                window_host: window.location.origin,
                filter: {
                  id: favoriteProduct.id,
                },
              });

              if (response) {
                // Возвращаем результат первого элемента после обработки массива продуктов.
                return response[0];
              }
            })
          );

          // Обновляем состояние списка избранных продуктов.
          setFavoritesList(res);
        } else {
          // Если список пустой или флаг отмены запроса установлен, то обновляем состояние null.
          setFavoritesList(null);
        }
      } catch (err) {
        if (!didCancel) {
          // Обновляем состояние ошибки, если флаг отмены запроса не установлен.
          setError("Failed to fetch favorites.");
        }
      }

      // После того, как операция сеттера завершена, выключаем индикатор загрузки.
      setIsLoading(false);
    };

    // Выполнение функции запроса по получению списка избранных продуктов.
    fetchFavorites();

    // Функция возврата, которая отменит все запросы при размонтировании компонента.
    return () => {
      didCancel = true;
    };
  }, [user.id]);

  // Возвращаем объект со значениями состояния.
  return { favoritesList, isLoading, error };
};

export default useFavorites;
