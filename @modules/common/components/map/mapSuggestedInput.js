import { useState, useEffect, useRef } from "react";

import { YMaps, Map, Placemark, SearchControl } from "react-yandex-maps";
import PreloaderSpinner from "../preloader/preloaderSpinner";

export default function MapSuggestedInput({
  rcInfo,
  inputId,
  setAddress,
  city = 5,
  setCity,
  setBuilding,
  setPreName,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const [yaCoords, setYaCoords] = useState([43.586171, 39.729368]);

  const ymapsObject = useRef(null);
  const searchControlRef = useRef(null);

  const onPlacemarkDragend = async (e) => {
    setYaCoords(e.originalEvent.target.geometry.getCoordinates());
    // ==============
    if (!ymapsObject.current) return;

    const res = await ymapsObject?.current?.geocode(yaCoords);
    const zeroElement = await res?.geoObjects?.get(0);

    const thoroughfare = zeroElement.getThoroughfare();
    const premiseNumber = zeroElement.getPremiseNumber();

    if (thoroughfare && premiseNumber) {
      const building = `${thoroughfare}, ${premiseNumber}`;

      setBuilding && setBuilding(building);
    }
  };

  const searchControlSelectResult = (event) => {
    if (searchControlRef.current) {
      const foundGeometries = searchControlRef.current.getResultsArray();
      const indexSelectedGeometry = searchControlRef.current.getSelectedIndex();
      const selectedItem = foundGeometries[indexSelectedGeometry];
      setYaCoords(selectedItem.geometry.getCoordinates());
      setAddress(selectedItem.properties.get("text"));
    }
  };

  const changeCoords = (coords) => {
    setYaCoords(coords);
  };

  let workPlace = [
    [43.5855, 39.7231],
    [43.5855, 39.7231],
  ];

  if (city != 5) {
    workPlace = [
      [45.0402, 38.976],
      [45.0402, 38.976],
    ];
  }

  const loadSuggest = async (ymaps) => {
    const suggestView = new ymaps.SuggestView(inputId, {
      boundedBy: workPlace,
    });

    suggestView.events.add("select", async (e) => {
      const address = e.get("item").displayName;
      // console.log(address);
      const coords = await getGeo(address, ymaps);
      setYaCoords(coords);
    });
  };

  const getGeo = async (address, ymaps) => {
    // console.log('address', address);
    const geocode = await ymaps.geocode(address);
    const coords = geocode?.geoObjects.get(0).geometry.getCoordinates();

    // console.log(geocode.geoObjects.get(0).getLocalities());
    // console.log(geocode.geoObjects.get(0).getPremise());
    // console.log(geocode.geoObjects.get(0).getPremiseNumber());
    // console.log(geocode.geoObjects.get(0).getThoroughfare());

    const locality = geocode.geoObjects.get(0).getLocalities();
    const thoroughfare = geocode.geoObjects.get(0).getThoroughfare();
    const premiseNumber = geocode.geoObjects.get(0).getPremiseNumber();

    // console.log('locality', locality)
    // console.log('thoroughfare', thoroughfare)
    // console.log('premiseNumber', premiseNumber)

    if (thoroughfare && premiseNumber) {
      const building = `${thoroughfare}, ${premiseNumber}`;
      setPreName && setPreName(null);
      setBuilding && setBuilding(building);
    } else {
      setBuilding && setBuilding(null);
      if (thoroughfare) {
        setPreName && setPreName(thoroughfare);
      } else if (locality && locality?.length > 0) {
        const resName = `${locality.join(", ")}${
          premiseNumber ? ", " + premiseNumber : ""
        }`;
        setPreName && setPreName(resName);
      } else {
        setPreName && setPreName(null);
      }
    }

    return coords;
  };

  useEffect(() => {
    (async () => {
      if (!ymapsObject.current) return;

      const res = await ymapsObject?.current?.geocode(yaCoords);
      const zeroElement = await res?.geoObjects?.get(0);
      const getClickedData = zeroElement?.properties?.get("metaDataProperty");
      const address = getClickedData?.GeocoderMetaData?.text;

      const input = document.getElementById(inputId);

      if (input) {
        input.value = address;
      }

      setAddress(address);
    })();
  }, [yaCoords]);

  useEffect(() => {
    (async () => {
      if (!ymapsObject.current) return;
      // console.log("================================");

      const rcCoords = await getGeo(rcInfo?.address, ymapsObject.current);

      setYaCoords(rcCoords);
      // console.log(rcCoords);
      // console.log(yaCoords);
    })();
  }, [rcInfo, ymapsObject?.current]);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center h-[240px] w-full">
          <PreloaderSpinner />
        </div>
      )}
      <YMaps
        key={city}
        query={{
          apikey: "d1243c14-b620-45f3-b9b3-6fb17ca79202",
          suggest_apikey: "8b6f6743-1f5d-42d3-a6f8-6f605066d814",
          load: "geocode",
        }}
      >
        <Map
          modules={[
            "control.ZoomControl",
            "control.FullscreenControl",
            "control.SearchControl",
            "SuggestView",
          ]}
          onLoad={(instace) => {
            setIsLoading(true);
            loadSuggest(instace);
            ymapsObject.current = instace;
            setIsLoading(false);
          }}
          width={"100%"}
          state={{
            center: yaCoords,
            zoom: 15,
            controls: ["zoomControl"],
          }}
          onClick={(e) => changeCoords(e.get("coords"))}
        >
          <Placemark
            key={yaCoords.toString()}
            defaultGeometry={yaCoords}
            options={{ draggable: true }}
            onDragend={onPlacemarkDragend}
          />

          <SearchControl
            onResultSelect={(e) => {
              searchControlSelectResult(e);
            }}
            instanceRef={(ref) => {
              if (ref) {
                searchControlRef.current = ref;
              }
            }}
            options={{
              float: "right",
            }}
          />
        </Map>
      </YMaps>
    </>
  );
}
