import React from "react";

interface Props {
  className: any;
}

export const Graduationcap3 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="40"
      viewBox="0 0 41 40"
      width="41"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 15L20.25 5L39 15L20.25 25L1.5 15Z"
        stroke="#FF6636"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />

      <path
        d="M29.625 37.5V20L20.25 15"
        stroke="#FF6636"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />

      <path
        d="M34.625 17.3333V25.8522C34.6255 26.1219 34.5384 26.3844 34.3766 26.6002C33.324 28.0008 28.8833 33.125 20.25 33.125C11.6167 33.125 7.17597 28.0008 6.12336 26.6002C5.96165 26.3844 5.87449 26.1219 5.875 25.8522V17.3333"
        stroke="#FF6636"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
};
