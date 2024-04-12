export default function getProductUrl(product) {
  const url = `/posts/${
    product?.section_relation[0] != undefined &&
    product?.section_relation[0]?.slug
  }/${product?.slug}`;

  return url;
}
