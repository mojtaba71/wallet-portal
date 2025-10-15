import InputNumber from "@/components/kits/number-input/NumberInput";
import Select from "@/components/kits/select-box/SelectBox";
import {
  type CustomerRegistrationRequest,
  personTypeOptions,
  genderOptions,
} from "@/models/customer.model";
import { ResultType } from "@/models/enum/enum";
import { useRegisterCustomer } from "@/services/hook/customerService.hook";
import { Button, Form, Input, Typography, DatePicker } from "antd";
import { useCallback } from "react";
import { toast } from "react-toastify";

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
      mutateRegisterCustomer(values, {
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
            name="lastName"
            label={<span className="dark:text-gray-50">نام خانوادگی</span>}
            rules={[
              { required: true, message: "نام خانوادگی الزامی است" },
              {
                validator: (_, value) => {
                  const personType = form.getFieldValue("personType");
                  if (
                    (personType === "REAL" || personType === "FOREIGN") &&
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

          <Form.Item
            name="nameEN"
            label={<span className="dark:text-gray-50">نام به انگلیسی</span>}
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="lastNameEN"
            label={
              <span className="dark:text-gray-50">نام خانوادگی به انگلیسی</span>
            }
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="fatherName"
            label={<span className="dark:text-gray-50">نام پدر</span>}
          >
            <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="fatherNameEN"
            label={
              <span className="dark:text-gray-50">نام پدر به انگلیسی</span>
            }
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
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
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="dark:text-gray-50">ایمیل</span>}
            rules={[
              {
                type: "email",
                message: "لطفاً ایمیل معتبر وارد کنید",
              },
            ]}
          >
            <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label={<span className="dark:text-gray-50">تاریخ</span>}
          >
            <DatePicker className="!w-full !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250" />
          </Form.Item>
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
