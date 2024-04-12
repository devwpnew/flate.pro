import { useState } from "react";

import Input from "@modules/common/components/input/input";
import { useEffect } from "react";
import InputRequired from "@modules/common/components/input/inputRequaired";


export default function FieldName({ name }) {
  return (
    <div className="mb-5">
      <div className="font-bold mb-2.5 text-sm">
        Название <span className="text-red">*</span>
      </div>
      <InputRequired
        style={"h-10 w-full md:w-[300px]"}
        name={"name"}
        minLength={3}
        defaultValue={name}
        placeholder={"Название объявления"}
      />
    </div>
  );
}
