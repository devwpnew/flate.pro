export default function getProductPriceSquares(product) {
  const numberFormat = new Intl.NumberFormat("ru");

  let squares = 0;

  const pr = product?.product_price;

  if (pr) {
    if (product?.land_squares) {
      squares = product?.land_squares;
    }

    if(product?.object_squares) {
      squares = product?.object_squares;
    }
  
    if (product?.living_squares) {
      squares = product?.living_squares;
    }

    return numberFormat.format(Math.ceil(product.product_price / squares));
  } else {
    return "";
  }
}
