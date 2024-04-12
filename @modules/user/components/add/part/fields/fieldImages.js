import { useState, useEffect } from "react";

import Image from "next/image";
import { FileUploader } from "react-drag-drop-files";
import { ReactSortable } from "react-sortablejs";

import H2 from "@modules/common/components/heading/h2";

import galleryIconOpacity from "public/icons/gallery-icon-opacity.svg";
import Button from "@modules/common/components/button/button";
import GalleryOutput from "@modules/common/components/input/part/galleryOutput";
import api from "pages/api/service/api";

const fileTypes = ["JPG", "JPEG", "WEBP", "PNG"];

export default function FieldImages({
  setForm,
  form,
  title,
  description,
  name,
  defaultImages,
  sectionId,
}) {
  const [counter, setCounter] = useState(30);
  const [error, setError] = useState(null);

  const [galleryMainImage, setGalleryMainImage] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [galleryInput, setGalleryInput] = useState(null);

  const handleChange = (file) => {
    if (counter - file.length < 0) {
      setError("Максимум 30 фото.");
    } else {
      setGalleryInput(file);
      setError("");
    }
  };

  useEffect(() => {
    let filesResult = gallery && gallery.length ? gallery : [];

    if (galleryInput) {
      for (let i in galleryInput) {
        const file = galleryInput[i];

        if (typeof file == "object") {
          file.id =
            gallery && gallery.length
              ? parseInt(gallery.length) + parseInt(i) + 1
              : parseInt(i);
          filesResult.push(file);
        }
      }
      setGalleryInput(null);
    }

    const filesArray = Array.from(filesResult);

    if (filesArray.length > 0) {
      setGallery(filesArray);
      setGalleryMainImage(filesArray[0].id);
    }
  }, [galleryInput]);

  useEffect(() => {
    setCounter(30);

    if (gallery) {
      const propName = name ? name : "property_product_galery";

      setForm({
        ...form,
        [propName]: gallery,
      });

      setCounter((counter) => counter - gallery?.length);
    }
  }, [gallery]);

  const handleError = (err) => {
    console.log(err);
    if (err === "File type is not supported") {
      setError("Неверный формат");
      return;
    }

    if (err === "File size is too big") {
      setError("Размер одного фото не должен превышать 10 МБ.");
      return;
    }
  };

  useEffect(() => {
    setError("")
  }, [sectionId]);

  useEffect(() => {
    if (sectionId === 5 || sectionId === 7) return
    if (counter === 30) {
      setError("Это поле обязательно");
    }

  }, [counter, sectionId]);



  return (
    <div>
      {title ? (
        title
      ) : (
        <H2>
          Фотографии{" "}
          {sectionId !== 5 && sectionId !== 7 && (
            <span className="text-red">*</span>
          )}
        </H2>
      )}
      <div className="text-sm mb-5">
        {description ? (
          description
        ) : (
          <>
            Сфотографируйте все комнаты, кухню, санузел, коридор, вид из окна,
            фасад здания, подъезд. Если у вас нет фотографий квартиры,
            прикрепите фотографию дома{" "}
          </>
        )}
      </div>

      {error && <span className="text-red">{error}</span>}

      <div className="block dashed-gradient p-5 cursor-pointer relative group">
        <FileUploader
          // required={true}
          name={name ? name : "property_product_galery"}
          classes={`${
            counter < 0 ? "FileUploader FileUploader--disabled" : "FileUploader"
          }`}
          multiple={true}
          handleChange={handleChange}
          types={fileTypes}
          onTypeError={(err) => handleError(err)}
          onSizeError={(err) => handleError(err)}
          // onDrop={(file) => {
          //   setError("");
          // }}
          // onSelect={(file) => console.log(file)}
          // onDraggingStateChange={(dragging) => console.log(dragging)}
          label=" "
          hoverTitle={" "}
          maxSize={10}
        />

        <div className="flex flex-col justify-center items-center">
          <Image
            src={galleryIconOpacity.src}
            width={galleryIconOpacity.width}
            height={galleryIconOpacity.height}
          />

          <div className="flex items-center gap-2.5 mt-2.5">
            <Button
              className={"py-2.5 px-7 group-hover:bg-bluedeep"}
              type="button"
            >
              {counter < 30 ? "Осталось" : "Максимум"} {counter} фото
            </Button>
            <span className="hidden md:inline text-sm whitespace-wrap">
              Размер одного фото не должен превышать 10 МБ.
            </span>
          </div>
        </div>
      </div>

      {gallery && gallery.length > 0 && (
        <>
          <GalleryOutput gallery={gallery} setGallery={setGallery} />
        </>
      )}

      {defaultImages && defaultImages.length > 0 && (
        <>
          <GalleryOutput gallery={defaultImages} ghost={true} />
        </>
      )}
    </div>
  );
}
