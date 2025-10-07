import SelectBox from "@/components/kits/select-box/SelectBox";
import type { CardItem } from "@/models/cardManagement.model";
import { ResultType } from "@/models/enum/enum";
import { cardStatusOptions, type MainResponse } from "@/models/general.model";
import { useChangeStatusCard } from "@/services/hook/cardManagementService.hook";
import { getCardTypeText } from "@/utils/utils";
import { Button, Form, Input, Modal, Typography } from "antd";
import React from "react";
import { MdOutlineChangeCircle } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ChangeStatusFrom {
  status: string;
  description: string;
}

interface ChangeCardStatusModalProps {
  openModal: boolean;
  onClose: () => void;
  selectedCard: CardItem;
  handleConfirm: () => void;
}

const ChangeCardStatusModal: React.FC<ChangeCardStatusModalProps> = ({
  openModal,
  onClose,
  handleConfirm,
  selectedCard,
}) => {
  const { mutate, isLoading } = useChangeStatusCard();

  const [form] = Form.useForm<ChangeStatusFrom>();

  const handleSubmit = (values: ChangeStatusFrom) => {
    mutate(
      {
        description: values.description,
        pan: selectedCard.pan,
        status: values.status,
      },
      {
        onSuccess: (successData: MainResponse) => {
          if (successData.resultCode === ResultType.Success) {
            toast.success("تغییر وضعیت کارت با موفقیت ثبت شد");
            handleConfirm();
            handleCancel();
          }
        },
      }
    );
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const getCurrentStatusLabel = (status: string) => {
    const currentStatus = cardStatusOptions.find(
      (option) => option.value === status
    );
    return currentStatus ? currentStatus.label : status;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <TbStatusChange className="text-white text-lg" />
          </div>
          <div>
            <Title
              level={4}
              className="!mb-0 !text-gray-800 dark:!text-gray-200 "
            >
              تغییر وضعیت کارت
            </Title>
            <Text className="text-sm !text-gray-500 dark:!text-gray-400">
              انتخاب وضعیت جدید و علت تغییر
            </Text>
          </div>
        </div>
      }
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={500}
      keyboard={false}
      maskClosable={false}
      className="dark:!bg-gray-800"
      styles={{
        header: {
          backgroundColor: 'var(--ant-color-bg-container)',
          borderBottom: '1px solid var(--ant-color-border)',
        },
        body: {
          backgroundColor: 'var(--ant-color-bg-container)',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        },
      }}
    >
      <div className="space-y-6">
        {/* اطلاعات کارت فعلی */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:!from-gray-700 dark:!to-gray-600 border border-blue-200 dark:!border-gray-250 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <MdOutlineChangeCircle className="text-blue-500 text-xl" />
            <Text className="font-semibold !text-gray-800 dark:!text-gray-200">اطلاعات کارت</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2 p-3 bg-white dark:!bg-gray-800 rounded-md">
              <Text className="!text-gray-600 dark:!text-gray-400 font-medium min-w-fit">شماره کارت:</Text>
              <Text className="font-medium !text-gray-800 dark:!text-gray-200 font-mono text-sm leading-relaxed break-all">{selectedCard.pan}</Text>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white dark:!bg-gray-800 rounded-md">
              <Text className="!text-gray-600 dark:!text-gray-400 font-medium min-w-fit">نام دارنده:</Text>
              <Text className="font-medium !text-gray-800 dark:!text-gray-200">
                {selectedCard.name} {selectedCard.lastName}
              </Text>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white dark:!bg-gray-800 rounded-md">
              <Text className="!text-gray-600 dark:!text-gray-400 font-medium min-w-fit">وضعیت فعلی:</Text>
              <Text className="font-medium !text-blue-600 dark:!text-blue-400">
                {getCurrentStatusLabel(selectedCard.status)}
              </Text>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white dark:!bg-gray-800 rounded-md">
              <Text className="!text-gray-600 dark:!text-gray-400 font-medium min-w-fit">نوع کارت:</Text>
              <Text className="font-medium !text-gray-800 dark:!text-gray-200">
                {getCardTypeText(selectedCard.cardType)}
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-4">
            <Form.Item
              name="status"
              label={
                <span className="flex items-center gap-2 !text-gray-700 dark:!text-gray-300 font-medium">
                  <TbStatusChange className="text-amber-500" />
                  وضعیت جدید
                </span>
              }
              rules={[
                { required: true, message: "انتخاب وضعیت جدید الزامی است" },
              ]}
            >
              <SelectBox
                placeholder="وضعیت جدید را انتخاب کنید"
                options={cardStatusOptions}
                className="w-full dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <span className="flex items-center gap-2 !text-gray-700 dark:!text-gray-300 font-medium">
                  <MdOutlineChangeCircle className="text-blue-500" />
                  علت تغییر وضعیت
                </span>
              }
              rules={[
                { required: true, message: "درج علت تغییر وضعیت الزامی است" },
                {
                  min: 10,
                  message: "علت تغییر وضعیت باید حداقل ۱۰ کاراکتر باشد",
                },
              ]}
            >
              <TextArea
                placeholder="لطفاً علت تغییر وضعیت را بنویسید..."
                rows={2}
                className="resize-none dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:!border-gray-250">
            <Button
              onClick={handleCancel}
              className="!px-6 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 hover:!border-gray-400 !text-gray-700 hover:!text-gray-800 dark:!bg-gray-700 dark:hover:!bg-gray-600 dark:!border-gray-250 dark:hover:!border-gray-500 dark:!text-white dark:hover:!text-gray-100 !font-medium !shadow-sm hover:!shadow-md !transition-all !duration-200"
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="!px-6 !bg-green-500 hover:!bg-green-600 !border-green-500 hover:!border-green-600 !text-white !font-medium !shadow-md hover:!shadow-lg !transition-all !duration-200"
            >
              ثبت
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ChangeCardStatusModal;
