import Link from "next/link";
import Button from "@modules/common/components/button/button";

export default function FavoritesEmpty() {
  return (
    <div className="flex flex-col items-center gap-2.5 mx-auto">
      <div className="font-bold">Здесь пока ничего нет</div>
      <div className="text-sm inline-flex gap-2 items-center">
        Добавляйте объявления в избранное с помощью
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.38506 2.80794L9.99971 3.68714L10.6144 2.80798C11.4919 1.55296 12.8957 0.75 14.4696 0.75C17.0811 0.75 19.25 2.96446 19.25 5.76C19.25 6.85321 18.7216 8.12405 17.8151 9.47188C16.9189 10.8044 15.7102 12.1285 14.4802 13.3108C13.2533 14.4899 12.0235 15.5105 11.0989 16.2371C10.6414 16.5966 10.26 16.8831 9.99247 17.0801C9.72565 16.8898 9.34681 16.6137 8.89296 16.2665C7.96944 15.5601 6.74121 14.5639 5.51603 13.4017C4.28771 12.2366 3.08111 10.922 2.18643 9.58048C1.28381 8.227 0.75 6.92216 0.75 5.75995C0.75 3.942 1.31345 2.71578 2.13474 1.94026C2.9645 1.15675 4.14582 0.75 5.52983 0.75C7.10419 0.75 8.50771 1.55295 9.38506 2.80794Z"
            fill="white"
            fillOpacity="0.5"
            stroke="#4BA5F8"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <Link href="/">
        <a>
          <Button className={"mt-2.5 w-auto px-4 py-2"}>
            Перейти в каталог
          </Button>
        </a>
      </Link>
    </div>
  );
}
