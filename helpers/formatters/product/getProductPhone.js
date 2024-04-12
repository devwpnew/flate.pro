let formatPhoneNumber = (str) => {
  if(!str) return null

  str = str.replace(/[^0-9]/g, "");

  if (typeof str !== "string") str = str.toString();
  // +7 (895) 895-68-95
  if (str.length === 11) {
    return str.replace(
      /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
      "+$1 ($2) $3-$4-$5"
    );
  } else if (str.length < 11) {
    return '';
  } else if (str.length > 11) {
    return '';
  } else {
    return '';
  }
};

export default function getProductPhone(product) {
  const phone = product?.properties?.product_phone ? product?.properties?.product_phone : product;

  return formatPhoneNumber(phone);
}
