import React from "react";

interface Props {
  className: any;
}

export const CheckIcon22 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="36"
      viewBox="0 0 36 36"
      width="36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#D1FADF" height="36" rx="18" width="36" />

      <path
        clipRule="evenodd"
        d="M25.6445 11.085L14.9045 21.45L12.0545 18.405C11.5295 17.91 10.7045 17.88 10.1045 18.3C9.51951 18.735 9.35451 19.5 9.71451 20.115L13.0895 25.605C13.4195 26.115 13.9895 26.43 14.6345 26.43C15.2495 26.43 15.8345 26.115 16.1645 25.605C16.7045 24.9 27.0095 12.615 27.0095 12.615C28.3595 11.235 26.7245 10.02 25.6445 11.07V11.085Z"
        fill="#388E3C"
        fillRule="evenodd"
      />
    </svg>
  );
};
