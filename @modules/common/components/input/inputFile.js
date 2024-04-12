import { useState, useEffect } from "react";

import Image from "next/image";

import Button from "../button/button";
import GalleryOutput from "./part/galleryOutput";

import galleryIcon from "public/icons/gallery-icon.svg";

export default function InputFile({
  form,
  setForm,
  name,
  multiple,
  defaultValue,
  onChange
}) {
  const [gallery, setGallery] = useState([]);
  const [galleryInput, setGalleryInput] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      setGallery((prev) => [...prev, defaultValue]);
    }
  }, []);

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
    }
  }, [galleryInput]);

  useEffect(() => {
    if (gallery) {
      if (multiple) {
        setForm && setForm({
          ...form,
          [name]: gallery,
        });
      } else {
        setForm && setForm({
          ...form,
          [name]: gallery[0],
        });
      }
    }
  }, [gallery]);

  const onLoadImage = (e) => {
    if (multiple) {
      setGalleryInput(e.target.files);
    } else {
      setGallery(null);
      setGalleryInput(e.target.files);
    }
    onChange && onChange(e)
  };

  return (
    <>
      <Button
        for="image"
        as="label"
        className={"block h-auto py-2"}
        type={"button"}
      >
        <div className="flex justify-center gap-2.5 cursor-pointer">
          <Image
            src={galleryIcon.src}
            width={galleryIcon.width}
            height={galleryIcon.height}
          />

          <div>Добавить фото</div>
          <input
            onChange={onLoadImage}
            id="image"
            type="file"
            multiple={multiple}
            name="image"
            accept="image/*"
            className="hidden"
          />
        </div>
      </Button>
      {gallery && gallery.length > 0 && (
        <>
          <GalleryOutput gallery={gallery} setGallery={setGallery} isNotSortable={true} />
        </>
      )}
    </>
  );
}
