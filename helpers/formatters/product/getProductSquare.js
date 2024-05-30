export default function getProductSquare(product) {
  const numberFormat = new Intl.NumberFormat("ru");
  const pr = product?.product_price;

  if (pr) {
    return numberFormat.format(product.living_squares);
  } else {
    ("");
  }
}
