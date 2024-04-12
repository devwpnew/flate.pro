import { YMaps, Map, Placemark } from "react-yandex-maps";
import Image from "next/image";
import Container from "@modules/common/components/container/container";

import yamapPlacehodler from "public/yamap-placeholder.jpg";
import { useEffect, useRef, useState } from "react";

export default function PostYandexMap({
  map,
  address,
  hideAddress,
  containerClassName,
  zoom,
}) {
  const [coordinates, setCoordinatesValue] = useState(false);
  const [mapState, setMapState] = useState("loading");
  const [stateValues, setStateValues] = useState({
    center: [55.7522, 37.6156],
    zoom: zoom ? zoom : 19,
    controls: ["zoomControl"],
  });

  const setCoordinates = async (value) => {
    setCoordinatesValue(value);
    setStateValues({ center: value, zoom: zoom ? zoom : 19 });
  };

  const formateCoorditates = (stirng) => {
    const arr = stirng.split(",");
    return [parseFloat(arr[0]), parseFloat(arr[1])];
  };

  if (map) {
    setCoordinates(formateCoorditates(map));
  }

  const ymapsObject = useRef(null);

  useEffect(() => {
    return async () => {
      if (ymapsObject.current) {
        ymapsObject.current.geocode(address).then((res) => {
          if (res && res.geoObjects) {
            // console.log(res, 'yaRes');
            const zeroElement = res.geoObjects.get(0);
            const coords = zeroElement.geometry.getCoordinates();
            setCoordinates(coords);
          }
        });
      }
    };
  }, [mapState]);
  // console.log(coordinates);
  return (
    <>
      <div className={containerClassName ? containerClassName : "mb-10"}>
        {!hideAddress && (
          <div className="block mb-2.5">
            <span className="block text-xl font-bold mb-2 md:mb-5">Расположение</span>
            <div className="flex flex-col text-sm leading-6">{address}</div>
          </div>
        )}

        <YMaps
          query={{
            apikey: "d1243c14-b620-45f3-b9b3-6fb17ca79202",
            load: "geocode",
          }}
        >
          <Map
            modules={["control.ZoomControl", "control.FullscreenControl"]}
            key={map}
            width={"100%"}
            state={stateValues}
            onLoad={(instace) => {
              (ymapsObject.current = instace), setMapState("loaded");
            }}
          >
            {coordinates && <Placemark geometry={coordinates}></Placemark>}
          </Map>
        </YMaps>
      </div>
    </>
  );
}
