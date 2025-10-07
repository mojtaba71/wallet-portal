import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { DatePickerProps } from "antd";

export type JalaliDatePickerProps = Omit<DatePickerProps, "locale">;

const DatePickerComponent: React.FC<JalaliDatePickerProps> = ({ className, format, value, onChange, ...res }) => {
  const fmt = (typeof format === "string" ? format : "YYYY/MM/DD") as string;
  
  const handleChange = (dateObject: any) => {
    if (dateObject && dateObject.isValid) {
      const dateString = dateObject.format(fmt);
      onChange?.(dateObject as any, dateString);
    } else {
      onChange?.(null as any, "");
    }
  };

  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      format={fmt}
      value={value as any}
      onChange={handleChange}
      className={`!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-50 !border-0 ${className || ''}`}
      style={{
        width: "100%",
        height: "40px",
      }}
      fixMainPosition={false}
      offsetY={4}
      offsetX={0}
      {...(res as any)}
    />
  );
};

export default DatePickerComponent;
