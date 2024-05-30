export default function getProductStatus(product) {
  const numberFormat = new Intl.NumberFormat("ru");
  const pr = product?.product_price;

  if (pr) {
    return `${product.properties.product_floor ? numberFormat.format(product.properties.product_floor) : '-'} / ${product.flat_floors ? numberFormat.format(product.flat_floors) : '-'}`;
  } else {
    ("");
  }
}
