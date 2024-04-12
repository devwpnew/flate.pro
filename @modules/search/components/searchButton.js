import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setFilterVisibility } from "store/global/filter/filterVisibility";
import { useSelector } from "react-redux";

export default function SearchButton({ icon, width, height }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const link = `/posts/flats`;
  const filterVisibility = useSelector((state) => state.filterVisibility.value);

  return (
    <>
      {(router?.query?.section_slug !== "flats" &&
        router?.query?.section_slug !== "houses" &&
        router?.query?.section_slug !== "land" &&
        router?.query?.section_slug !== "commertion" &&
        router?.query?.section_slug !== "parkings") ||
      router?.query?.product_slug ? (
        <div
          onClick={() => {
            router.push({ pathname: link, query: {search: 1} });
          }}
          className="flex flex-col items-center h-[53px] w-[50px] justify-between pt-2"
        >
          <button className="flex items-center justify-center w-5 h-5">
            <Image
              src={icon.src}
              width={width ? width : icon.width}
              height={height ? height : icon.height}
            />
          </button>
          <span className="text-exs text-greymiddle">Поиск</span>
        </div>
      ) : (
        <div
          onClick={() => dispatch(setFilterVisibility(!filterVisibility))}
          className="flex flex-col items-center h-[53px] w-[50px] justify-between pt-2"
        >
          <button className="flex items-center justify-center w-5 h-5">
            <Image
              src={icon.src}
              width={width ? width : icon.width}
              height={height ? height : icon.height}
            />
          </button>
          <span className="text-exs text-greymiddle">Поиск</span>
        </div>
      )}
    </>
  );
}
