import React from "react";

interface LockIconProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const LockIcon: React.FC<LockIconProps> = ({
  width = 31,
  height = 31,
  color = "#999999",
  fill = "none",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 31"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.48999 13.0301V10.4628C8.48999 6.21382 9.77366 2.76076 16.192 2.76076C22.6103 
2.76076 23.894 6.21382 23.894 10.4628V13.0301"
        stroke={color}
        strokeWidth="1.9255"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.192 23.9413C17.9643 23.9413 19.4011 22.5045 19.4011 20.7321C19.4011 18.9597 17.9643 17.5229 16.192 17.5229C14.4196 17.5229 12.9828 18.9597 12.9828 20.7321C12.9828 22.5045 14.4196 23.9413 16.192 23.9413Z"
        stroke={color}
        strokeWidth="1.9255"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.6104 28.4341H9.77369C4.63901 28.4341 3.35535 27.1504 3.35535 22.0158V19.4484C3.35535 14.3138 4.63901 13.0301 9.77369 13.0301H22.6104C27.745 13.0301 29.0287 14.3138 29.0287 19.4484V22.0158C29.0287 27.1504 27.745 28.4341 22.6104 28.4341Z"
        stroke={color}
        strokeWidth="1.9255"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LockIcon;
