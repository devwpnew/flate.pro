import { useEffect, useState } from "react";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Preloader from "@modules/common/components/preloader/preloader";

import useFilterProps from "hooks/filter/useFilterProps";

export default function FieldPremium({ form, setForm, product }) {
  const [defValue, setDefValue] = useState(null);
  
  const [selected, setSelected] = useState(null);
  const { data, error, isLoading } = useFilterProps(["premium"]);

  useEffect(() => {
    if(!selected) return
    setForm({ ...form, premium: selected.id });
  }, [selected]);

  useEffect(() => {
    if (product) {
      setDefValue(product.premium);
    }
  }, [product])

  return (
    <>
      <div className="text-sm font-bold mb-2">Премиум объявление</div>

      <div className="h-10 w-full md:w-[300px]">
        {isLoading || error ? (
          <Preloader />
        ) : (
          <SelectNoAutocomplete
            placeholder="Премиум"
            name={"premium"}
            callback={setSelected}
            options={data.premium}
            defaultValue={defValue}
          />
        )}
      </div>
    </>
  );
}
