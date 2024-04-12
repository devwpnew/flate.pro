import React from "react";
import AreaModalInput from "./areaModalInput";

export default function AreasOutput({
  childrenAreas,
  activeAreas,
  childrenOnChange,
}) {
  return (
    <>
      {childrenAreas.map((area) => {
        return (
          <AreaModalInput
            area={area}
            activeAreas={activeAreas}
            onClick={() => childrenOnChange(area.id)}
            key={area.id}
          />
        );
      })}
    </>
  );
}
