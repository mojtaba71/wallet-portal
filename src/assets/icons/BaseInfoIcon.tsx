import React from "react";

interface ProfileIconProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const BaseInfoIcon: React.FC<ProfileIconProps> = ({
  width = 24,
  height = 24,
  color = "#625F6D",
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
        d="M3.17004 7.43994L12 12.5499L20.77 7.46994"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21.61V12.54"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.93001 2.47979L4.59001 5.43979C3.38001 6.10979 2.39001 7.78979 2.39001 9.16979V14.8198C2.39001 16.1998 3.38001 17.8798 4.59001 18.5498L9.93001 21.5198C11.07 22.1498 12.94 22.1498 14.08 21.5198L19.42 18.5498C20.63 17.8798 21.62 16.1998 21.62 14.8198V9.16979C21.62 7.78979 20.63 6.10979 19.42 5.43979L14.08 2.46979C12.93 1.83979 11.07 1.83979 9.93001 2.47979Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BaseInfoIcon;
