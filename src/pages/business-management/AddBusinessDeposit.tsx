import InputNumber from "@/components/kits/number-input/NumberInput";
import type { RegisterBusinessDepositRequest } from "@/models/businessManagement.model";
import { ResultType } from "@/models/enum/enum";
import type { MainResponse } from "@/models/general.model";
import { UrlRoutes } from "@/routes/url.routes";
import {
  useModifyBusinessDeposit,
  useRegisterBusinessDeposit,
} from "@/services/hook/businessManagementService.hook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;

interface Props {
  businessId: number;
  bindSubmit?: (submitFn: () => void) => void;
}

const AddBusinessDeposit: React.FC<Props> = ({ businessId, bindSubmit }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterBusinessDepositRequest>();
  const { mutate: registerDeposit } = useRegisterBusinessDeposit();
  const { mutate: modifyDeposit } = useModifyBusinessDeposit();

  const onFinish = (values: RegisterBusinessDepositRequest) => {
    const hasDepositNumber = Boolean(values.depositNumber && values.depositNumber.trim() !== "");
    const hasCifList = Boolean(values.cifList && values.cifList.length > 0);
    const hasOtherFields = Boolean(values.wageDepositNumber || hasCifList);
    const hasExistingData = Boolean(state?.depositData);
    const isAddMode = !hasExistingData;

    if (isAddMode) {
      registerDeposit(
        { ...values, businessId },
        {
          onSuccess: (successData: MainResponse) => {
            if (successData.resultCode === ResultType.Success) {
              toast.success("اطلاعات حساب کسب‌وکار با موفقیت ثبت شد");
              setTimeout(() => {
                backRoute();
              }, 1500);
            }
          },
        }
      );
    } else {
      if (hasOtherFields && !hasDepositNumber) {
        toast.error("شماره حساب کسب‌وکار الزامی می‌باشد");
        return;
      }
      
      if (hasDepositNumber && !hasCifList) {
        toast.error("حداقل یک کد مشتری/امضادار حساب باید اضافه شود");
        return;
      }
      
      if (!hasDepositNumber && !hasOtherFields) {
        return;
      }

      if (hasExistingData || hasDepositNumber) {
        modifyDeposit(
          {
            ...values,
            businessId: +form.getFieldValue("businessId"),
          },
          {
            onSuccess: (successData: MainResponse) => {
              if (successData.resultCode === ResultType.Success) {
                toast.success("اطلاعات حساب کسب‌وکار با موفقیت ویرایش شد");
                setTimeout(() => {
                  backRoute();
                }, 1500);
              }
            },
          }
        );
      } else {
        if (!hasDepositNumber) {
          toast.error("شماره حساب کسب‌وکار الزامی می‌باشد");
          return;
        }
        
        if (!hasCifList) {
          toast.error("حداقل یک کد مشتری/امضادار حساب باید اضافه شود");
          return;
        }

        registerDeposit(
          { ...values, businessId },
          {
            onSuccess: (successData: MainResponse) => {
              if (successData.resultCode === ResultType.Success) {
                toast.success("اطلاعات حساب کسب‌وکار با موفقیت ثبت شد");
                setTimeout(() => {
                  backRoute();
                }, 1500);
              }
            },
          }
        );
      }
    }
  };

  const backRoute = () => {
    navigate(
      `${UrlRoutes.businessManagement}${UrlRoutes.businessManagementList}`
    );
  };

  useEffect(() => {
    if (bindSubmit) {
      bindSubmit(() => form.submit());
    }
  }, [bindSubmit]);

  useEffect(() => {
    if (state?.businessInfo) {
      form.setFieldValue("businessId", state.businessInfo.businessId);
    }

    if (state?.addBusinessDeposit && state?.businessId) {
      form.setFieldValue("businessId", state.businessId);
    }

    if (state?.businessId && !state?.businessInfo) {
      form.setFieldValue("businessId", state.businessId);
    }
  }, [state]);

  useEffect(() => {
    if (state?.depositData) {
      form.setFieldsValue({
        businessId: state.depositData.businessId,
        depositNumber: state.depositData.depositNumber,
        cifList: state.depositData.cifList || [],
        wageDepositNumber: state.depositData.wageDepositNumber,
      });
    }
  }, [state?.depositData]);

  useEffect(() => {
    if (businessId) {
      form.setFieldValue("businessId", businessId);
    }
  }, [businessId]);

  return (
    <div>
      <div className="mb-6">
        <Title level={4} className="!text-lg !font-semibold !mb-4 !text-gray-800 dark:!text-gray-50">
          فرم ثبت اطلاعات حساب کسب‌وکار
        </Title>
        <div className="border-b border-dashed border-gray-300 dark:border-gray-400"></div>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Form.Item label={<span className="dark:text-gray-50">شناسه کسب‌وکار</span>} name="businessId">
              <Input disabled className="!w-full dir-ltr" />
             </Form.Item>

            <Form.Item
              label={<span className="dark:text-gray-50">شماره حساب کسب‌وکار</span>}
              name="depositNumber"
              rules={[
                {
                  required: !state?.depositData,
                  message: "وارد کردن شماره حساب الزامی است",
                },
              ]}
            >
              <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
            </Form.Item>

            <Form.Item
              label={<span className="dark:text-gray-50">شماره حساب کارمزد</span>}
              name="wageDepositNumber"
            >
              <Input className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
            </Form.Item>
          </div>
          <Form.List
            name="cifList"
            rules={[
              {
                validator: async (_, v) => {
                  if (!state?.depositData && (!v || v.length === 0)) {
                    return Promise.reject(
                      new Error("حداقل یک کد مشتری/امضادار حساب باید اضافه شود")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <Form.Item className="!w-full">
                    <Button
                      className="!bg-blue-300 hover:!bg-blue-400 !border-blue-300 !text-white"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      افزودن کد مشتری/امضاءدار حساب
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fields.map(({ name, ...restField }) => (
                    <div key={name} className="flex gap-2 items-center w-full">
                      <Form.Item
                        {...restField}
                        className="!mb-0 w-full"
                        name={[name]}
                        rules={[{ required: true, message: "" }]}
                      >
                        <InputNumber className="!w-full dir-ltr" />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="!text-red-500"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Form.List>
      </Form>
    </div>
  );
};

export default AddBusinessDeposit;
