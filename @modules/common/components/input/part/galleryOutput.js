import set from "pages/api/service/set/set";
import { useEffect } from "react";
import { ReactSortable } from "react-sortablejs";

export default function GalleryOutput({
  gallery,
  setGallery,
  isNotSortable,
  ghost,
}) {
  const removeGalleryItem = async (imageId) => {
    const filesResult = [];

    for (let i in gallery) {
      const file = gallery[i];
      if (typeof file == "object" && file.id != imageId) {
        filesResult.push(file);
      }
    }

    setGallery(filesResult);
  };

  const gal = gallery && gallery

  if (isNotSortable === true || ghost === true) {
    return (
      <>
        <div className="grid grid-cols-5 gap-2.5 mt-2.5">
          {Array.isArray(gallery) && gallery.map((image, index) => {
            if (!image) return;

            let src = null;

            if (typeof image === "string") {
              src = "https://flate.pro/" + image;
            }

            if (typeof image === "object") {
              src = URL.createObjectURL(image);
            }

            if (src) {
              return (
                <div
                  key={`${image?.lastModified}${image?.id}${index}`}
                  className="dashed-gradient p-1 relative cursor-pointer bg-bluelighter flex justify-center items-center rounded-md overflow-hidden"
                >
                  {!ghost && (
                    <span
                      className="absolute z-10 flex justify-center items-center right-[5px] top-[5px] w-[20px] h-[20px] cursor-pointer hover:fill-red bg-greylight fill-blue rounded-full"
                      onClick={(e) => {
                        removeGalleryItem(image?.id);
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99973 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99973 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"></path>
                      </svg>
                    </span>
                  )}

                  <img
                    className={`transition-all object-cover object-center`}
                    src={src}
                  />
                </div>
              );
            }
          })}
        </div>
      </>
    );
  } else {
    return (
      <>
        <ReactSortable
          className="grid grid-cols-5 gap-2.5 mt-2.5"
          list={gallery}
          setList={setGallery}
        >
          {Array.isArray(gallery) && gallery.map((image, index) => {
            if (!image) return;

            let src = null;

            if (typeof image === "string") {
              src = "https://flate.pro/" + image;
            }

            if (typeof image === "object") {
              src = URL.createObjectURL(image);
              // console.log(src);
            }


            if (src) {
              return (
                <div
                  key={`${image?.lastModified}${image?.id}${index}`}
                  className="dashed-gradient p-1 relative cursor-pointer bg-bluelighter flex justify-center items-center rounded-md overflow-hidden"
                >
                  <span
                    className="absolute z-10 flex justify-center items-center right-[5px] top-[5px] w-[20px] h-[20px] cursor-pointer hover:fill-red bg-greylight fill-blue rounded-full"
                    onClick={(e) => {
                      removeGalleryItem(image?.id);
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99973 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99973 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"></path>
                    </svg>
                  </span>

                  <img
                    className={`hover:opacity-100 transition-all object-cover object-center ${
                      index === 0 ? "opacity-100" : "opacity-50"
                    }`}
                    src={src}
                  />
                </div>
              );
            }
          })}
        </ReactSortable>
      </>
    );
  }
}
