import Button from "@modules/common/components/button/button";
import Input from "@modules/common/components/input/input";
import Select from "@modules/common/components/select/comboBox/select";
import Image from "next/image";
import searchIcon from "public/icons/search-grey.svg";
import filterIcon from "public/icons/filter-blue.svg";
import LinkWrap from "@modules/common/components/link/linkWrap";

export default function SearchMobile() {
  return (
    <form>
      <div className="flex justify-between items-center">
        <div className="relative w-full">
          <Input
            style={"w-full h-[32px]"}
            type={"text"}
            placeholder="ЖК, Адрес, Район"
          />
          <LinkWrap href={'/search/'}>
            <div className="absolute right-[10px] top-[5px] cursor-pointer">
              <Image src={searchIcon.src} width={16} height={16} />
            </div>
          </LinkWrap>
        </div>
        <div className="pl-[7px] cursor-pointer">
          <Image
            src={filterIcon.src}
            width={17}
            height={17}
          />
        </div>
      </div>
    </form>
  );
}
