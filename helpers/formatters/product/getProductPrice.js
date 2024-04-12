export default function getProductPrice(product) {
  const numberFormat = new Intl.NumberFormat("ru");
  const pr = product?.product_price;

  if (pr) {
    return numberFormat.format(product.product_price);
  } else {
    ("");
  }
}
