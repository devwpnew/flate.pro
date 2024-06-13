import { useCallback, useEffect, useState } from "react";

import Input from "@modules/common/components/input/input";
import Preloader from "@modules/common/components/preloader/preloader";

import debounce from "helpers/debounce";

export default function FieldAddressInput({
  rcInfoIsLoading,
  rcInfo,
  handleAddressChange,
  address,
}) {
  const [isError, setIsError] = useState(null);

  const [defaultValue, setDefaultValue] = useState(false);
  const debouncedAddressChange = useCallback(debounce(handleAddressChange), []);

  useEffect(() => {
    if (rcInfo) {
      setDefaultValue(rcInfo.address);
    }
  }, [rcInfo]);

  useEffect(() => {
    setDefaultValue(address);
  }, []);

  // useEffect(() => {
  //   setDefaultValue(address);
  // }, [defaultValue]);

  // console.log(address);

  useEffect(() => {
    setIsError(null);

    if (defaultValue === "") {
      setIsError("Обязательно для заполнения");
    }

    return function () {};
  }, [defaultValue]);

  const handleErrorsOnChange = (ev) => {
    setIsError(null);

    if (ev.target.value === "") {
      setIsError("Обязательно для заполнения");
    }
  };

  switch (rcInfo) {
    case null:
      return (
        <>
          <Input
            key={defaultValue}
            id={"suggest-address"}
            name={"property_product_address"}
            style={"flex-grow h-10"}
            placeholder={"Укажите адрес*"}
            onChange={(ev) => {
              debouncedAddressChange(ev);
              handleErrorsOnChange(ev);
            }}
            defaultValue={
              (defaultValue && defaultValue) || (address && address)
            }
            isError={typeof isError === "string"}
            errorMsg={isError}
          />
        </>
      );
    default:
      return (
        <>
          {rcInfoIsLoading ? (
            <div className="h-10 flex-grow">
              <Preloader />
            </div>
          ) : (
            <>
              <Input
                key={defaultValue}
                id={"suggest-address"}
                name={null}
                onChange={(ev) => {
                  debouncedAddressChange(ev);
                  handleErrorsOnChange(ev);
                }}
                style={"flex-grow h-10"}
                placeholder={"Укажите адрес*"}
                defaultValue={
                  (defaultValue && defaultValue) || (address && address)
                }
                isError={typeof isError === "string"}
                errorMsg={isError}
              />
            </>
          )}
        </>
      );
  }
}
