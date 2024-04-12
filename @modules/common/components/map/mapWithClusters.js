import { YMaps, Map, Placemark, Clusterer } from "react-yandex-maps";
import { useEffect, useMemo, useRef, useState } from "react";

import randomInteger from "helpers/randomInteger";
import PreloaderSpinner from "../preloader/preloaderSpinner";
import ProductItemGrid from "@modules/posts/type/product/components/item/layout/productItemGrid";
import { useSelector } from "react-redux";
import declension from "helpers/formatters/declension";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import DialogCloseIcon from "../dialog/dialogCloseIcon";
export default function MapWithClusters({
  products,
  city,
  zoom,
  className = "",
}) {
  const user = useSelector((state) => state.userLogin.value);
  const [product, setProduct] = useState([]);

  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [mapState, setMapState] = useState({
    center: [13.585472, 19.723098],
    zoom: zoom,
  });
  const [points, setPoints] = useState([]);

  const [clustererKey, setClustererKey] = useState(1);

  const clusterer = useRef();
  const ymaps = useRef();

  useEffect(() => {
    (async () => {
      setIsLoadingSpinner(true);
      if (ymaps.current) {
        const resultCoords = [];
        const resultCoordsWithAddresses = [];

        const geocodeCity = await ymaps.current.geocode(city);
        const coordsCity = geocodeCity.geoObjects
          .get(0)
          .geometry.getCoordinates();

        if (coordsCity) {
          setMapState({ ...mapState, center: coordsCity });
        }

        await Promise.all(
          products.map(async (p) => {
            const address = p.properties.product_address;

            if (address) {
              const geocode = await ymaps.current.geocode(address);

              if (geocode) {
                const coordsObj = geocode.geoObjects.get(0);

                if (coordsObj) {
                  const coords = coordsObj.geometry.getCoordinates();

                  if (coords) {
                    resultCoords.push(coords);
                    resultCoordsWithAddresses.push({
                      product: p,
                      address: [address],
                      point: coords,
                    });
                  }
                }
              }
            }
          })
        );

        const uniqueCoordsWithAddresses = [
          ...new Set(resultCoordsWithAddresses),
        ];

        setPoints(uniqueCoordsWithAddresses);

        setClustererKey(randomInteger());
      }
      setIsLoadingSpinner(false);
    })();
  }, [isMapLoaded, products]);

  const onBalloonOpen = async (e) => {
    e.preventDefault();
    setProduct([]);

    const coords = e.originalEvent.currentTarget
      .getClusters()[0]
      .geometry.getCoordinates();

    points.map((p) => {
      const pSum = p.point.reduce((prev, cur) => prev + cur, 0).toFixed(1);
      const cSum = coords.reduce((prev, cur) => prev + cur, 0).toFixed(1);

      if (pSum === cSum) {
        // console.log(p.product, "p.product");
        setProduct((prev) => [...prev, p.product]);
      }
    });
  };

  const onPlaceMarkClick = (item) => {
    setProduct([]);

    points.map((p) => {
      const pSum = p.point.reduce((prev, cur) => prev + cur, 0);
      const cSum = item.point.reduce((prev, cur) => prev + cur, 0);

      if (pSum === cSum) {
        setProduct((prev) => [...prev, p.product]);
      }
    });
  };
  // console.log(points);

  const getCount = (coords) => {
    let count = 0;

    points.map((p) => {
      const pSum = p.point.reduce((prev, cur) => prev + cur, 0);
      const cSum = coords.reduce((prev, cur) => prev + cur, 0);

      if (pSum === cSum) {
        ++count;
      }
    });

    return count;
  };

  return (
    <div className={className}>
      {isLoadingSpinner ? (
        <div className="flex flex-col h-full items-center justify-center">
          <PreloaderSpinner />
        </div>
      ) : (
        <>
          <YMaps
            query={{
              apikey: "d1243c14-b620-45f3-b9b3-6fb17ca79202",
              load: "geocode",
            }}
          >
            <Map
              style={{ width: "100%", height: "100%" }}
              modules={["clusterer.addon.balloon"]}
              state={mapState}
              onLoad={(instace) => {
                ymaps.current = instace;
                setIsMapLoaded(true);
              }}
            >
              {points.map((item, idx) => {
                return (
                  <Placemark
                    geometry={item.point}
                    key={idx}
                    properties={{ iconContent: getCount(item.point) }}
                    // properties={
                    //   {
                    //     // iconCaption: item.address,
                    //     balloonContentBody:
                    //     "<strong>цена " + getProductPrice(item.product) + " руб. </strong>",
                    //     clusterCaption: "Объект <strong>" + item.product.name + "</strong>",
                    //   }
                    // }
                    onClick={() => onPlaceMarkClick(item)}
                  />
                );
              })}
            </Map>
          </YMaps>

          {product && product?.length > 0 && (
            <div className="absolute right-[0px] lg:right-[30px] top-[70px] lg:top-[100px] bg-white overflow-y-scroll h-[350px] lg:h-[450px] p-2.5 m-2.5">
              <div className="text-md pb-2 mb-2 border-b border-greyborder w-full text-sm">
                {`${product.length} ${declension(product.length, [
                  "объект",
                  "объекта",
                  "объектов",
                ])}`}
              </div>

              <div className="flex flex-col gap-2.5 mt-5">
                {product.map((p) => {
                  return (
                    <div className="w-[200px] lg:w-[240px]">
                      <ProductItemGrid
                        key={product.id}
                        user={user}
                        product={p}
                      />
                    </div>
                  );
                })}
              </div>

              <DialogCloseIcon
                className={"absolute right-0 top-0 m-2.5"}
                onClick={() => setProduct([])}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
