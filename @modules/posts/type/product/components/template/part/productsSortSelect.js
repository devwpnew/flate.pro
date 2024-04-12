import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import { useRouter } from "next/router";

const sortFields = [
  {
    name: "По умолчанию",
    id: "date_published",
    sort: null,
  },
  {
    name: "Дешевле",
    id: "price-desc",
    sort: { product_price: "ASC" },
  },
  {
    name: "Дороже",
    id: "price-DESC",
    sort: { product_price: "DESC" },
  },
  {
    name: "Площадь больше",
    id: "squares-DESC",
    sort: { living_squares: "DESC" },
  },
  {
    name: "Площадь меньше",
    id: "squares-ASC",
    sort: { living_squares: "ASC" },
  },
  {
    name: "Сначала старые",
    id: "date_created-ASC",
    sort: { date_sort: "ASC" },
  },
  {
    name: "Сначала новые",
    id: "date_created-DESC",
    sort: { date_sort: "DESC" },
  },
  // {
  //   name: "Дороже за м2",
  //   id: "squares-price-asc",
  //   sort: { living_squares: "DESC" },
  // },
  // {
  //   name: "Дешевле за м2",
  //   id: "squares-price-desc",
  //   sort: { living_squares: "ASC" },
  // },
];

export default function ProductsSortSelect({ callback }) {
  const router = useRouter();

  const specialSortFields = [
    {
      name: "По имени [A-Я]",
      id: "name-ASC",
      sort: { name: "ASC" },
    },
    {
      name: "По имени [Я-A]",
      id: "name-DESC",
      sort: { name: "DESC" },
    },
    {
      name: "По ЖК [A-Я]",
      id: "rc_link-ASC",
      sort: { rc_link: "ASC" },
    },
    {
      name: "По ЖК [Я-A]",
      id: "rc_link-DESC",
      sort: { rc_link: "DESC" },
    },
  ];

  return (
    <div className="w-auto">
      <SelectNoAutocomplete
        options={
          router.pathname === "/user/profile/items"
            ? [...sortFields, ...specialSortFields]
            : sortFields
        }
        style={"h-12 py-[0] px-[6px] h-[30px]"}
        callback={callback}
      />
    </div>
  );
}
