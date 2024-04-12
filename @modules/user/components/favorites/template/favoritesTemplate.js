import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Container from "@modules/common/components/container/container";
import FavoritesContent from "@modules/user/components/favorites/template/favoritesContent";
import ProfileSidebarTemplate from "@modules/user/components/profile/template/profileSidebarTemplate";

import getLayout from "helpers/getLayout";
import sortProducts from "helpers/products/sortProducts";

export default function FavoritesTemplate() {
  const { MOBILE } = getLayout();

  const user = useSelector((state) => state.userLogin.value);

  const [sort, setSort] = useState(null);
  const [favoritesList, setFavoritesList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Флаг отмены запроса.

    const fetchFavorites = async () => {
      setIsLoading(true);

      try {
        // Запрос на получение избранных продуктов по ID пользователя.
        const favorites = await API.get.favoritesById(user.id);
        if (favorites) {
          const favoritesReverse = favorites.reverse();
          // Делаем несколько запросов на получение информации о каждом продукте в списке.
          const res = await Promise.all(
            favoritesReverse.map(async (favoriteProduct) => {
              const response = await API.get.product.byID(favoriteProduct);

              if (response) {
                // Возвращаем результат первого элемента после обработки массива продуктов.
                return response;
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
        // Обновляем состояние ошибки, если флаг отмены запроса не установлен.
        setError("Failed to fetch favorites.");
      }

      // После того, как операция сеттера завершена, выключаем индикатор загрузки.
      setIsLoading(false);
    };

    // Выполнение функции запроса по получению списка избранных продуктов.
    fetchFavorites();

    // Функция возврата, которая отменит все запросы при размонтировании компонента.
  }, [user]);

  useEffect(() => {
    if(!Array.isArray(favoritesList)) return;
    
    updateSort();
  }, [sort, favoritesList]);

  const updateSort = () => {
    console.log('favoritesList', favoritesList)
    const sortedFavorites = sortProducts(sort, favoritesList);
    console.log('sortedFavorites', sortedFavorites)
    if (sortedFavorites) {
      setFavoritesList(sortedFavorites);
    }
  };

  return (
    <>
      {MOBILE ? (
        <FavoritesContent
          user={user}
          setProducts={setFavoritesList}
          favorites={favoritesList}
          isLoading={isLoading}
        />
      ) : (
        <Container>
          <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
            <ProfileSidebarTemplate />

            <div className="flex flex-col w-full">
              <FavoritesContent
                user={user}
                setProducts={setFavoritesList}
                favorites={favoritesList}
                isLoading={isLoading}
                setSort={setSort}
              />
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
