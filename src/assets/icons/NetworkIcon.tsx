import React from "react";

interface NetworkIconProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({
  width = 24,
  height = 24,
  color = "#666666",
  fill = "none",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.36997 9.51017C2.28997 9.80017 2.29997 15.7102 6.36997 16.0002H16.03C17.2 16.0102 18.33 15.5702 19.2 14.7802C22.06 12.2802 20.53 7.28015 16.76 6.80015C15.41 -1.33985 3.61998 1.75017 6.40998 9.51017"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16V19"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 23C13.1046 23 14 22.1046 14 21C14 19.8954 13.1046 19 12 19C10.8954 19 10 19.8954 10 21C10 22.1046 10.8954 23 12 23Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 21H14"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 21H6"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NetworkIcon;
