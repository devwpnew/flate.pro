export default function sortProducts(sort, products) {
  if (!sort || !products || products.length === 0) return null;

  const clone = products.slice(0);

  if (sort?.id === "price-DESC") {
    return clone.sort((a, b) => b.product_price - a.product_price);
  }

  if (sort?.id === "price-desc") {
    return clone.sort((a, b) => a.product_price - b.product_price);
  }

  if (sort?.id === "rc_link-ASC") {
    return clone.sort(function (a, b) {
      if (a.rc_link.name < b.rc_link.name) {
        return -1;
      }
      if (a.rc_link.name > b.rc_link.name) {
        return 1;
      }
      return 0;
    });
  }

  if (sort?.id === "rc_link-DESC") {
    return clone.sort(function (a, b) {
      if (!a.rc_link && b.rc_link) {
        // Если a.rc_link отсутствует, а b.rc_link присутствует, поместите a в конец массива
        return 1;
      }
      if (a.rc_link && !b.rc_link) {
        // Если b.rc_link отсутствует, а a.rc_link присутствует, поместите b в конец массива
        return -1;
      }
      if (!a.rc_link && !b.rc_link) {
        // Если и a.rc_link и b.rc_link отсутствуют, вернуть 0, чтобы сохранить текущий порядок элементов
        return 0;
      }

      // В противном случае, продолжайте сравнивать и сортировать элементы по полю name в обратном порядке
      if (a.rc_link.name > b.rc_link.name) {
        return -1;
      }
      if (a.rc_link.name < b.rc_link.name) {
        return 1;
      }

      return 0;
    });
  }

  if (sort?.id === "date_created-DESC") {
    return clone.sort(
      (a, b) =>
        new Date(b.date_published).getTime() -
        new Date(a.date_published).getTime()
    );
  }

  if (sort?.id === "date_created-ASC") {
    return clone.sort(
      (a, b) =>
        new Date(a.date_published).getTime() -
        new Date(b.date_published).getTime()
    );
  }

  if (sort?.id === "default") {
    // return clone.sort(
    //   (a, b) =>
    //     new Date(a.date_published).getTime() -
    //     new Date(b.date_published).getTime()
    // );
  }

  if (sort?.id === "name-ASC") {
    return clone.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  if (sort?.id === "name-DESC") {
    return clone.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  }

  if (sort?.id === "squares-ASC") {
    return clone.sort((a, b) => {
      const squaresA =
        a && a.living_squares !== null ? a.living_squares : a && a.land_squares;
      const squaresB =
        b && b.living_squares !== null ? b.living_squares : b && b.land_squares;

      return squaresB - squaresA;
    });
  }

  if (sort?.id === "squares-DESC") {
    return clone.sort((a, b) => {
      const squaresA =
        a && a.living_squares !== null ? a.living_squares : a && a.land_squares;
      const squaresB =
        b && b.living_squares !== null ? b.living_squares : b && b.land_squares;

      return squaresA - squaresB;
    });
  }

  if (sort?.id === "squares-price-ASC") {
    return clone.sort((a, b) => {
      const squaresA =
        a && a.living_squares !== null ? a.living_squares : a && a.land_squares;
      const squaresB =
        b && b.living_squares !== null ? b.living_squares : b && b.land_squares;
      const priceA = a.product_price / squaresA;
      const priceB = b.product_price / squaresB;

      return priceB - priceA;
    });
  }

  if (sort?.id === "squares-price-DESC") {
    return clone.sort((a, b) => {
      const squaresA =
        a && a.living_squares !== null ? a.living_squares : a && a.land_squares;
      const squaresB =
        b && b.living_squares !== null ? b.living_squares : b && b.land_squares;
      const priceA = a.product_price / squaresA;
      const priceB = b.product_price / squaresB;

      return priceA - priceB;
    });
  }
}
