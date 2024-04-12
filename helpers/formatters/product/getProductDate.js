export default function getProductDate(product) {
  let date = "";

  if (product?.date_published) {
    date = product?.date_published;
  }

  // if (product?.date_created) {
  //   date = product?.date_created;
  // }

  return new Date(date).toLocaleDateString(process.env.Timezone);
}
