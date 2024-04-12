import Link from "next/link";

export default function MobileAppButtons() {
  return (
    <div className="flex items-center gap-[26px]">
      <a
        href="https://apps.apple.com/ru/app/flate/id6458738854"
        target="_blank"
      >
        <div className="cursor-pointer fill-primary hover:fill-blue transition-all">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="inhirit"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2684_2844)">
              <path
                d="M10.3119 0C9.51219 0.0553122 8.57751 0.567184 8.03282 1.23374C7.53595 1.83843 7.1272 2.73655 7.28658 3.60935C8.16032 3.63654 9.06313 3.11248 9.58625 2.43467C10.0756 1.80374 10.4459 0.911245 10.3119 0Z"
                fill="inhirit"
              />
              <path
                d="M13.4722 5.03248C12.7044 4.06967 11.6253 3.51093 10.6063 3.51093C9.26097 3.51093 8.69191 4.15498 7.75723 4.15498C6.79349 4.15498 6.0613 3.5128 4.89787 3.5128C3.75507 3.5128 2.5382 4.21123 1.76664 5.4056C0.681961 7.08747 0.867584 10.2496 2.62539 12.9431C3.25445 13.9068 4.09444 14.9905 5.19318 14.9999C6.17099 15.0093 6.44661 14.3727 7.77129 14.3662C9.09597 14.3587 9.34722 15.0084 10.3232 14.998C11.4228 14.9896 12.3088 13.7887 12.9378 12.8249C13.3888 12.134 13.5566 11.7862 13.9063 11.0062C11.3628 10.0378 10.955 6.42091 13.4722 5.03248Z"
                fill="inhirit"
              />
            </g>
            <defs>
              <clipPath id="clip0_2684_2844">
                <rect width="15" height="15" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=flate.pro"
        target="_blank"
      >
        <div className="cursor-pointer fill-primary hover:fill-blue transition-all">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="inhirit"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.8936 1.7159C3.3928 1.42398 2.8048 1.43073 2.3072 1.72012L8.1392 7.39402L10.0984 5.32779L3.8936 1.7159Z"
              fill="inhirit"
            />
            <path
              d="M1.724 2.30059C1.5816 2.54611 1.5 2.82706 1.5 3.12489V13.3725C1.5 13.661 1.5744 13.9361 1.7088 14.1765L7.5736 7.99136L1.724 2.30059Z"
              fill="inhirit"
            />
            <path
              d="M12.696 6.83971L10.8272 5.75217L8.7272 7.96605L11.3008 10.4693L12.6968 9.65683C13.1992 9.36322 13.5 8.83675 13.5 8.24785C13.4992 7.65894 13.1992 7.13247 12.696 6.83971Z"
              fill="inhirit"
            />
            <path
              d="M8.1616 8.56339L2.2808 14.7655C2.536 14.919 2.816 15 3.0976 15C3.3696 15 3.6432 14.9274 3.8936 14.7815L10.5632 10.8996L8.1616 8.56339Z"
              fill="inhirit"
            />
          </svg>
        </div>
      </a>
    </div>
  );
}
