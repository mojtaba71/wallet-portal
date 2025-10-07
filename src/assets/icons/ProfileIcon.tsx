import React from "react";

interface ProfileIconProps {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  width = 32,
  height = 32,
  color = "#999999",
  fill = "none",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.3974 14.4535C16.2691 14.4406 16.115 14.4406 15.9738 14.4535C12.9187 14.3508 10.4926 11.8476 10.4926 8.76683C10.4926 5.62184 13.0342 3.06734 16.192 3.06734C19.337 3.06734 21.8915 5.62184 21.8915 8.76683C21.8787 11.8476 19.4526 14.3508 16.3974 14.4535Z"
        stroke={color}
        strokeWidth="1.9255"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.97903 19.1902C6.87255 21.2698 6.87255 24.6586 9.97903 26.7253C13.5091 29.0873 19.2985 29.0873 22.8285 26.7253C25.935 24.6458 25.935 21.2569 22.8285 19.1902C19.3113 16.8411 13.5219 16.8411 9.97903 19.1902Z"
        stroke={color}
        strokeWidth="1.9255"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileIcon;
