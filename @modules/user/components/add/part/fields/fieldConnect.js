import H2 from "@modules/common/components/heading/h2";
import Preloader from "@modules/common/components/preloader/preloader";
import SelectCheckBox from "@modules/common/components/select/checkBox/selectCheckBox";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";

import useFilterProps from "hooks/filter/useFilterProps";

export default function FieldConnect({product}) {
  const { data, error, isLoading } = useFilterProps(["messages_calls"]);

  return (
    <>
      <H2>Способ связи</H2>

      <div className="w-[300px]">
        {isLoading || error ? (
          <div className="h-10 ">
            <Preloader />
          </div>
        ) : (
          <SelectCheckBox
            name="messages_calls"
            options={data.messages_calls}
            defaultValue={product?.messages_calls ? product?.messages_calls : "0"}
          />
        )}
      </div>
    </>
  );
}
