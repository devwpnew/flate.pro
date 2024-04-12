import API from "pages/api/service/api";

const getProducts = async (
  published,
  premium,
  page,
  limit,
  city_link,
  user,
  section,
  sort,
  priceRange,
  squaresRange,
  status,
  rooms,
  area,
  mortgage,
  sumContract,
  floorRange,
  landSquaresMax,
  livingSquaresMax,
  houseTypes,
  houseConstruction,
  houseCommunication,
  houseFloors,
  parkingTypes,
  commercialTypes,
  statusLands
) => {
  const requestParams = {
    window_host: window.location.origin,
    filter: {},
    sort: {
      id: "asc",
    },
  };

  if (limit) {
    requestParams["limit"] = limit;
  }

  if (sort) {
    requestParams["sort"] = sort;
  }

  if (page) {
    requestParams["page"] = page;
  }

  if (published) {
    requestParams["filter"]["published"] = published;
  }

  if (premium) {
    requestParams["filter"]["premium"] = premium;
  }

  if (city_link) {
    requestParams["filter"]["city_link"] = city_link;
  }

  if (user) {
    requestParams["filter"]["user_id"] = user;
  }

  if (section) {
    requestParams["filter"]["section_relation"] = section;
  }

  if (priceRange && priceRange.length !== 0) {
    const minPrice = priceRange[1];
    const maxPrice = priceRange[0];

    requestParams["filter"]["product_price"] = {
      from: minPrice,
      to: maxPrice,
    };
  }

  if (squaresRange && squaresRange.length !== 0) {
    const minSquares = squaresRange[1];
    const maxSquares = squaresRange[0];

    if (router.query.section_slug === "place") {
      requestParams["filter"]["land_squares"] = {
        from: minSquares,
        to: maxSquares,
      };
    } else {
      requestParams["filter"]["living_squares"] = {
        from: minSquares,
        to: maxSquares,
      };
    }
  }

  if (status) {
    requestParams["filter"]["status"] =
      status.length === 1 ? status[0] : status;
  }

  if (rooms) {
    requestParams["filter"]["product_room_count"] =
      rooms.length === 1 ? rooms[0] : rooms;
  }

  if (area) {
    requestParams["filter"]["area_link"] = area;
  }

  if (mortgage) {
    requestParams["filter"]["mortgage"] = mortgage;
  }

  if (sumContract) {
    requestParams["filter"]["sum_contract"] = sumContract;
  }

  if (floorRange) {
    const minFloor = floorRange[1];
    const maxFloor = floorRange[0];

    requestParams["filter"]["property_product_floor"] = {
      from: minFloor,
      to: maxFloor,
    };
  }

  if (landSquaresMax) {
    const minSquares = landSquaresMax[1];
    const maxSquares = landSquaresMax[0];
    requestParams["filter"]["land_squares"] = {
      from: minSquares,
      to: maxSquares,
    };
  }

  if (livingSquaresMax) {
    const minSquares = livingSquaresMax[1];
    const maxSquares = livingSquaresMax[0];
    requestParams["filter"]["living_squares"] = {
      from: minSquares,
      to: maxSquares,
    };
  }

  if (houseTypes && houseTypes.length !== 0) {
    requestParams["filter"]["house_types"] = houseTypes;
  }

  if (houseConstruction && houseConstruction.length !== 0) {
    requestParams["filter"]["house_construction"] = houseConstruction;
  }

  if (houseCommunication && houseCommunication.length !== 0) {
    requestParams["filter"]["house_communication"] = houseCommunication;
  }

  if (houseFloors && houseFloors.length !== 0) {
    requestParams["filter"]["house_floors"] = houseFloors;
  }

  if (parkingTypes && parkingTypes.length !== 0) {
    requestParams["filter"]["parking_types"] = parkingTypes;
  }

  if (commercialTypes && commercialTypes.length !== 0) {
    requestParams["filter"]["commercial_types"] = commercialTypes;
  }

  if (statusLands && statusLands.length !== 0) {
    requestParams["filter"]["status_lands"] = statusLands;
  }

  const response = await API.get.product.list({ ...requestParams });
  return response;
};

export default getProducts;
