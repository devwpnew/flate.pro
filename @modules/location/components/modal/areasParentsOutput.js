import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import AreaModalInputParent from "./areaModalInputParent";
import getLayout from "helpers/getLayout";
export default function AreasParentsOutput({
  isLoading,
  sortedAreas,
  getParentAreaId,
  setChildrenAreas,
  activeAreas,
  setActiveParent,
}) {
  const { MOBILE } = getLayout();

  return (
    <>
      {!isLoading ? (
        <>
          {sortedAreas?.length > 0 ? (
            <>
              {sortedAreas.map((area, index) => {
                let isFirst = index === 0;
                let isLast = index === area.length;

                return (
                  <AreaModalInputParent
                    activeAreas={activeAreas}
                    area={area}
                    onClick={(ev) => {
                      setChildrenAreas(area.children ? area.children : []);
                      setActiveParent(area.id);
                      getParentAreaId(area.id);
                    }}
                    onMouseEnter={() => {
                      if (!MOBILE) {
                        setChildrenAreas(area.children ? area.children : []);
                        setActiveParent(area.id);
                      }
                    }}
                    isFirst={isFirst}
                    isLast={isLast}
                    key={area.id}
                  />
                );
              })}
            </>
          ) : (
            <span className="text-blue text-center py-5 px-[15px] w-full">
              Районы не найдены
            </span>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center">
          <PreloaderSpinner />
        </div>
      )}
    </>
  );
}
