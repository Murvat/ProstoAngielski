import React from "react";

interface Props {
  className: any;
}

export const CheckIcon50 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#D1FADF" height="23.9998" rx="12" width="23.9998" />

      <path
        clipRule="evenodd"
        d="M17.0963 7.38984L9.9364 14.2998L8.03642 12.2698C7.68643 11.9398 7.13643 11.9198 6.73643 12.1998C6.34644 12.4898 6.23644 12.9998 6.47644 13.4098L8.72641 17.0697C8.94641 17.4097 9.32641 17.6197 9.7564 17.6197C10.1664 17.6197 10.5564 17.4097 10.7764 17.0697C11.1364 16.5997 18.0063 8.40983 18.0063 8.40983C18.9063 7.48984 17.8163 6.67985 17.0963 7.37984V7.38984Z"
        fill="#12B76A"
        fillRule="evenodd"
      />
    </svg>
  );
};
