import InputNumber from "@/components/kits/number-input/NumberInput";
import Select from "@/components/kits/select-box/SelectBox";
import DatePicker from "@/components/kits/date-picker/DatePicker";
import {
  type CustomerRegistrationRequest,
  personTypeOptions,
  genderOptions,
} from "@/models/customer.model";
import { ResultType } from "@/models/enum/enum";
import { useRegisterCustomer } from "@/services/hook/customerService.hook";
import { Button, Form, Input, Typography } from "antd";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { MdDelete, MdAdd } from "react-icons/md";
import { convertToJalaliString } from "@/utils/dateConfig";

const { Title } = Typography;

interface AddCustomerProps {
  handleSuccess?: () => void;
  handleCancel?: () => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({
  handleSuccess,
  handleCancel,
}) => {
  const [form] = Form.useForm<CustomerRegistrationRequest>();
  const { mutate: mutateRegisterCustomer, isLoading } = useRegisterCustomer();

  const onFinish = useCallback(
    (values: CustomerRegistrationRequest) => {
      const payload = {
        ...values,
        personId: Number(values.personId),
        birthDate: convertToJalaliString(values.birthDate),
        registerDate: convertToJalaliString(new Date()),
      };

      mutateRegisterCustomer(payload, {
        onSuccess: (response) => {
          if (response.resultCode === ResultType.Success) {
            toast.success("اطلاعات مشتری با موفقیت ثبت شد");
            if (handleSuccess) {
              handleSuccess();
            }
          } else {
            toast.error(response.resultMessage || "خطا در ثبت اطلاعات مشتری");
          }
        },
        onError: (error) => {
          console.error("Registration error:", error);
          toast.error("خطا در ثبت اطلاعات مشتری");
        },
      });
    },
    [mutateRegisterCustomer, handleSuccess]
  );

  return (
    <div>
      <div className="mb-6">
        <Title
          level={4}
          className="!text-lg !font-semibold !mb-4 !text-gray-600"
        >
          فرم ثبت اطلاعات مشتری
        </Title>
        <div className="border-b border-dashed border-blue-400"></div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="personType"
            label={<span className="dark:text-gray-50">نوع مشتری</span>}
            rules={[{ required: true, message: "نوع مشتری الزامی است" }]}
          >
            <Select
              options={personTypeOptions}
              className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
            />
          </Form.Item>

          <Form.Item
            name="personId"
            label={<span className="dark:text-gray-50">کد مشخصه مشتری</span>}
            rules={[
              { required: true, message: "کد مشخصه مشتری الزامی است" },
              {
                validator: (_, value) => {
                  const personType = form.getFieldValue("personType");
                  if (
                    personType === "REAL" &&
                    value &&
                    value.toString().length !== 10
                  ) {
                    return Promise.reject(new Error("کد ملی باید 10 رقم باشد"));
                  }
                  if (
                    personType === "LEGAL" &&
                    value &&
                    value.toString().length !== 11
                  ) {
                    return Promise.reject(
                      new Error("شناسه ملی باید 11 رقم باشد")
                    );
                  }
                  if (
                    personType === "FOREIGN" &&
                    value &&
                    value.toString().length !== 16
                  ) {
                    return Promise.reject(
                      new Error("کد فراگیر باید 16 رقم باشد")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber className="!w-full dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="name"
            label={<span className="dark:text-gray-50">نام</span>}
            rules={[{ required: true, message: "نام الزامی است" }]}
          >
            <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.personType !== curr.personType}
          >
            {({ getFieldValue }) => {
              const personType = getFieldValue("personType");
              if (personType === "REAL" || personType === "FOREIGN") {
                return (
                  <Form.Item
                    name="lastName"
                    label={
                      <span className="dark:text-gray-50">نام خانوادگی</span>
                    }
                    rules={[
                      {
                        validator: (_, value) => {
                          const personType = form.getFieldValue("personType");
                          if (
                            (personType === "REAL" ||
                              personType === "FOREIGN") &&
                            !value
                          ) {
                            return Promise.reject(
                              new Error(
                                "نام خانوادگی برای اشخاص حقیقی و اتباع خارجی الزامی است"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="nameEN"
            label={<span className="dark:text-gray-50">نام به انگلیسی</span>}
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.personType !== curr.personType}
          >
            {({ getFieldValue }) => {
              const personType = getFieldValue("personType");
              if (personType === "REAL" || personType === "FOREIGN") {
                return (
                  <Form.Item
                    name="lastNameEN"
                    label={
                      <span className="dark:text-gray-50">
                        نام خانوادگی به انگلیسی
                      </span>
                    }
                  >
                    <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.personType !== curr.personType}
          >
            {({ getFieldValue }) => {
              const personType = getFieldValue("personType");
              if (personType === "REAL" || personType === "FOREIGN") {
                return (
                  <Form.Item
                    name="fatherName"
                    label={<span className="dark:text-gray-50">نام پدر</span>}
                  >
                    <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.personType !== curr.personType}
          >
            {({ getFieldValue }) => {
              const personType = getFieldValue("personType");
              if (personType === "REAL" || personType === "FOREIGN") {
                return (
                  <Form.Item
                    name="fatherNameEN"
                    label={
                      <span className="dark:text-gray-50">
                        نام پدر به انگلیسی
                      </span>
                    }
                  >
                    <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="gender"
            label={<span className="dark:text-gray-50">جنسیت</span>}
          >
            <Select
              options={genderOptions}
              className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
            />
          </Form.Item>

          <Form.Item
            name="mobile"
            label={<span className="dark:text-gray-50">موبایل</span>}
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.toString().length !== 12) {
                    return Promise.reject(
                      new Error("شماره موبایل باید با فرمت 98xxxxxxxxxx باشد")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              className="!w-full dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
              placeholder="989121234567"
              maxLength={12}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="dark:text-gray-50">ایمیل</span>}
            rules={[
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "فرمت ایمیل صحیح نیست",
              },
            ]}
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label={<span className="dark:text-gray-50">تاریخ</span>}
          >
            <DatePicker className="!w-full" />
          </Form.Item>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <Title
              level={5}
              className="!text-base !font-semibold !mb-0 !text-gray-600"
            >
              اطلاعات تکمیلی مشتری
            </Title>
            <Form.List name="additionalData">
              {(_, { add }) => (
                <Button
                  type="primary"
                  onClick={() => add()}
                  icon={<MdAdd />}
                  className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
                >
                  افزودن اطلاعات تکمیلی
                </Button>
              )}
            </Form.List>
          </div>
          <div className="border-b border-dashed border-blue-400 mb-4"></div>

          <Form.List name="additionalData">
            {(fields, { remove }) => (
              <div className="grid grid-cols-2 gap-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Form.Item
                        {...restField}
                        name={[name, "tagKey"]}
                        label={<span className="dark:text-gray-50">کلید</span>}
                        rules={[{ required: true, message: "کلید الزامی است" }]}
                        className="flex-1 mb-0"
                      >
                        <InputNumber className="!w-full dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "tagValue"]}
                        label={<span className="dark:text-gray-50">مقدار</span>}
                        rules={[
                          { required: true, message: "مقدار الزامی است" },
                        ]}
                        className="flex-1 mb-0"
                      >
                        <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<MdDelete />}
                        onClick={() => remove(name)}
                        className="!text-red-500 hover:!text-red-600"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            onClick={handleCancel}
            className="!bg-white !border-green-500 !text-green-500 hover:!bg-green-50"
          >
            انصراف
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-[180px] !bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
          >
            ثبت
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCustomer;
