import { YMaps, Map, Placemark } from "react-yandex-maps";
import Image from "next/image";
import Container from "@modules/common/components/container/container";

import yamapPlacehodler from "public/yamap-placeholder.jpg";
import { useEffect, useRef, useState } from "react";

export default function MapDraggable({
  map,
  address,
  hideAddress,
  containerClassName,
  zoom,
  setAddress,
}) {
  const [coordinates, setCoordinatesValue] = useState(false);
  const [mapState, setMapState] = useState("loading");
  const [stateValues, setStateValues] = useState({
    center: [55.7522, 37.6156],
    zoom: zoom ? zoom : 19,
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
            const zeroElement = res.geoObjects.get(0);
            const coords = zeroElement.geometry.getCoordinates();
            setCoordinates(coords);
          }
        });
      }
    };
  }, [mapState]);

  const onPlacemarkDragend = async (e) => {
    setCoordinatesValue(e.originalEvent.target.geometry.getCoordinates());

    const address = await getAddressByCoords(
      e.originalEvent.target.geometry.getCoordinates()
    );

    setAddress(address);
  };

  const getAddressByCoords = async (coords) => {
    const geo = await ymapsObject.current.geocode(coords);
    return geo.geoObjects.get(0).getAddressLine();
  };

  return (
    <>
      <div className={containerClassName ? containerClassName : "mb-10"}>
        {!hideAddress && (
          <Container>
            <div className="block mb-2.5">
              <span className="block text-xl font-bold mb-2 md:mb-5">Расположение</span>
              <div className="flex flex-col text-sm leading-6">{address}</div>
            </div>
          </Container>
        )}

        <YMaps
          query={{
            apikey: "d1243c14-b620-45f3-b9b3-6fb17ca79202",
            load: "geocode",
          }}
        >
          <Map
            modules={["geolocation", "geocode"]}
            key={map}
            width={"100%"}
            state={stateValues}
            onLoad={(instace) => {
              (ymapsObject.current = instace), setMapState("loaded");
            }}
          >
            {coordinates && (
              <Placemark
                geometry={coordinates}
                defaultGeometry={coordinates}
                options={{ draggable: true }}
                onDragend={onPlacemarkDragend}
              ></Placemark>
            )}
          </Map>
        </YMaps>
      </div>
    </>
  );
}
