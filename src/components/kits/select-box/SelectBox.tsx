import React from "react";
import { Select as AntSelect, type SelectProps as AntSelectProps } from "antd";

export interface FieldNames {
  value?: string;
  label?: string;
}

export interface SelectBoxProps extends Omit<AntSelectProps, "options"> {
  options?: any;
  mode?: "multiple" | "tags" | undefined;
  showSearch?: boolean;
  filterOption?: any;
  placeholder?: string;
  value?: any;
  onChange?: (value: any, option: any) => void;
  allowClear?: boolean;
  loading?: boolean;
  useCommaSeparator?: boolean;
  separator?: string;
  label?: string;
  labelClassName?: string;
  fieldNames?: FieldNames;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  options = [],
  mode,
  showSearch = false,
  filterOption,
  placeholder = "انتخاب کنید",
  value,
  onChange,
  allowClear = true,
  loading = false,
  useCommaSeparator = true,
  separator = ", ",
  label,
  labelClassName,
  fieldNames,
  ...rest
}) => {
  const additionalProps: Partial<AntSelectProps> = {};

  if (useCommaSeparator && mode === "multiple") {
    additionalProps.maxTagCount = 0;
    additionalProps.maxTagPlaceholder = (omittedValues: any[]) => {
      const selectedLabels = omittedValues.map((item) => {
        if (typeof item === "object" && item.label) {
          return item.label;
        }
        const option = options.find((opt: any) => opt.value === item);
        return option ? option.label : item;
      });

      return selectedLabels.join(separator);
    };
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        {label && <label className={labelClassName}>{label}</label>}
        <AntSelect
          options={options}
          mode={mode}
          showSearch={showSearch}
          filterOption={filterOption}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          allowClear={allowClear}
          loading={loading}
          fieldNames={fieldNames}
          variant="borderless"
          className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-50"
          {...additionalProps}
          {...rest}
        />
      </div>
    </>
  );
};

const { Option, OptGroup } = AntSelect;

const Select = Object.assign(SelectBox, {
  Option,
  OptGroup,
});

export default Select;
