export default function getProductAddress(product) {
  let address = product?.properties?.product_address;



  if (!address) {
    return (
      <>
        {product?.city_link.name}

        {product?.area_link && product?.area_link?.name && (
          <>
            {", "}р-н {product?.area_link?.name}
          </>
        )}
      </>
    );
  }else {
    address = address.replace('Россия, ', "")
    return address
  }
}
