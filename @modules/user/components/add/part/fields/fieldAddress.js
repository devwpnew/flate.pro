import api from "pages/api/service/api";
import { useEffect, useState, useCallback } from "react";

import H2 from "@modules/common/components/heading/h2";
import RadioAddProduct from "@modules/common/components/radio/radioAddProduct";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Preloader from "@modules/common/components/preloader/preloader";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import PostYandexMap from "@modules/posts/type/post/parts/postYandexMap";

import FieldCity from "./fieldCity";
import FieldArea from "./fieldArea";
import FieldMicroArea from "./fieldMicroArea";
import FieldRc from "./fieldRc";

import useFilterProps from "hooks/filter/useFilterProps";

import FieldAddressInput from "./fieldAddressInput";
import MapDraggable from "@modules/common/components/map/mapDraggable";
import MapSuggestedInput from "@modules/common/components/map/mapSuggestedInput";

export default function FieldAddress({
  sectionId,
  setForm,
  form,
  user,
  product,
}) {
  let defaultAddress = null;

  // if (user?.default_city?.name) {
  //   defaultAddress = user.default_city.name;
  // }

  if (product?.properties?.product_address) {
    defaultAddress = product.properties.product_address;
  }

  const props = useFilterProps(["handed_over"]);

  const [cityId, setCityId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [microAreaId, setMicroAreaId] = useState(null);
  const [rcId, setRcId] = useState(null);

  const [rcInfoIsLoading, setRcInfoIsLoading] = useState(null);
  const [rcInfo, setRcInfo] = useState(product?.rc_link);

  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapAddress, setMapAddress] = useState(defaultAddress);
  const [building, setBuilding] = useState(null);
  const [preName, setPreName] = useState(null);

  useEffect(() => {
    (async function getRcInfo() {
      if (!rcId) {
        return;
      }

      setRcInfoIsLoading(true);
      setIsMapLoading(true);
      try {
        const response = await api.get.rcs({
          window_host: window.location.origin,
          filter: {
            id: rcId,
          },
          sort: {
            id: "asc",
          },
          limit: "all",
        });

        if (response) {
          const rcInfo = response[0];

          if (!rcInfo) return;

          setRcInfo(rcInfo);

          if (rcInfo?.address) {
            setMapAddress(rcInfo.address);
          }

          if (rcInfo?.coordinates) {
            const coordsJson = JSON.stringify(rcInfo.coordinates);
            setForm({
              ...form,
              rc_link: rcInfo.id,
              map_coordinates: coordsJson,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsMapLoading(false);
      setRcInfoIsLoading(false);
    })();
  }, [rcId]);

  const handleAddressChange = (ev) => {
    setMapAddress(ev.target.value);
  };

  const handleMapCoordinatesChange = (coords) => {
    if (!coords) return;

    setForm({ ...form, map_coordinates: coords });
  };

  useEffect(() => {
    if (!areaId || areaId == "null") return;
    setForm({ ...form, area_link: areaId });
  }, [areaId]);

  useEffect(() => {
    if (!microAreaId || microAreaId == "null") return;
    setForm({ ...form, area_link: microAreaId });
  }, [microAreaId]);

  // console.log(building);
  console.log(form);

  return (
    <div className="">
      <input type="hidden" value={building} name="building_address" />
      <input type="hidden" value={preName} name="pre_name" />

      <H2>
        Расположение <span className="text-red">*</span>
      </H2>
      <div className="mb-2 text-sm">
        Укажите адрес или передвиньте метку на карте
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-2 mb-5">
        {sectionId === 3 && (
          <FieldRc setRcId={setRcId} defaultRc={product?.rc_link} />
        )}

        <FieldAddressInput
          rcId={rcId}
          rcInfoIsLoading={rcInfoIsLoading}
          rcInfo={rcInfo}
          handleAddressChange={handleAddressChange}
          address={mapAddress}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-2 mb-5">
        <div>
          <FieldCity setCityId={setCityId} rcInfo={rcInfo} />
        </div>

        <div>
          <FieldArea
            cityId={cityId}
            rcInfo={rcInfo}
            setAreaId={setAreaId}
            value={rcInfo && rcInfo.address}
            product={product}
          />
        </div>

        <div>
          {areaId && areaId !== "null" ? (
            <FieldMicroArea
              key={areaId + cityId}
              rcInfo={rcInfo}
              areaId={areaId}
              cityId={cityId}
              product={product}
              setMicroAreaId={setMicroAreaId}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      {isMapLoading ? (
        <div className="flex justify-center">
          <PreloaderSpinner />
        </div>
      ) : (
        // <MapDraggable
        //   containerClassName={" "}
        //   zoom={15}
        //   address={mapAddress}
        //   setAddress={setMapAddress}
        //   hideAddress={true}
        // />

        <MapSuggestedInput
          city={cityId}
          inputId={"suggest-address"}
          rcInfo={rcInfo}
          address={mapAddress}
          setAddress={setMapAddress}
          // setCity={setRcCity}
          setBuilding={setBuilding}
          setPreName={setPreName}
          handleMapCoordinatesChange={handleMapCoordinatesChange}
        />
      )}

      {sectionId === 3 && (
        <div className="mt-5">
          {props.isLoading || props.error ? (
            <div className="h-10 w-full md:w-[300px]">
              <Preloader />
            </div>
          ) : (
            <>
              <div className="text-sm font-bold mb-2">
                Дом сдан
                <span className="text-red">*</span>
              </div>
              <RadioAddProduct
                containerClassName="flex flex-row-reverse justify-end gap-5"
                itemClassName="h-9 mb-1.5"
                name="handed_over"
                options={props.data.handed_over}
                defaultValue={product?.handed_over}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
