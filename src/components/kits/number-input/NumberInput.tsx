import { Input as AntInput } from "antd";
import React from "react";
import { NumericFormat, type NumberFormatValues } from "react-number-format";
import cn from "classnames";
export interface InputNumberProps {
  variant?: "outlined" | "borderless" | "filled" | "underlined";
  value?: number | string;
  onChange?: (value: string) => void;
  decimalScale?: number;
  thousandSeparator?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  allowNegative?: boolean;
  placeholder?: string;
  allowedDecimalSeparators?: Array<string>;
  decimalSeparator?: string;
  fixedDecimalScale?: boolean;
  allowLeadingZeros?: boolean;
  style?: React.CSSProperties;
  label?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
}

const InputNumber: React.FC<InputNumberProps> = ({
  variant = "outlined",
  value,
  onChange,
  decimalScale = 0,
  thousandSeparator,
  min,
  max,
  maxLength,
  allowNegative = true,
  placeholder,
  allowedDecimalSeparators,
  decimalSeparator,
  fixedDecimalScale = false,
  allowLeadingZeros = false,
  style,
  label,
  labelClassName,
  className,
  disabled,
  ...rest
}) => {
  const handleValueChange = (values: NumberFormatValues) => {
    if (onChange) {
      onChange(values.value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className={labelClassName}>{label}</label>}
      <NumericFormat
        value={value}
        onValueChange={handleValueChange}
        displayType="input"
        decimalScale={decimalScale}
        thousandSeparator={thousandSeparator}
        allowNegative={allowNegative}
        allowedDecimalSeparators={allowedDecimalSeparators}
        decimalSeparator={decimalSeparator}
        fixedDecimalScale={fixedDecimalScale}
        allowLeadingZeros={allowLeadingZeros}
        customInput={AntInput}
        min={min}
        maxLength={maxLength}
        max={max}
        style={style}
        placeholder={placeholder}
        variant={variant}
          className={cn("!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100", className)}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
};

export default InputNumber;
