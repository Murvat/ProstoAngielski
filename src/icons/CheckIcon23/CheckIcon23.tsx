import React from "react";

interface Props {
  className: any;
}

export const CheckIcon23 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="81"
      viewBox="0 0 81 81"
      width="81"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#D1FADF" height="81" rx="40.5" width="81" />

      <path
        clipRule="evenodd"
        d="M57.7004 24.9414L33.5354 48.2626L27.1229 41.4114C25.9416 40.2976 24.0854 40.2301 22.7354 41.1751C21.4191 42.1539 21.0479 43.8751 21.8579 45.2589L29.4516 57.6114C30.1941 58.7589 31.4766 59.4676 32.9279 59.4676C34.3116 59.4676 35.6279 58.7589 36.3704 57.6114C37.5854 56.0251 60.7716 28.3839 60.7716 28.3839C63.8091 25.2789 60.1304 22.5451 57.7004 24.9076V24.9414Z"
        fill="#388E3C"
        fillRule="evenodd"
      />
    </svg>
  );
};
