import type { BusinessInfoItem } from "@/models/businessManagement.model";
import { ResultType } from "@/models/enum/enum";
import { type MainResponse } from "@/models/general.model";
import { useChangeStatusBusiness } from "@/services/hook/businessManagementService.hook";
import { Modal } from "antd";
import cn from "classnames";
import type { FC } from "react";
import { toast } from "react-toastify";

interface ChangeStatusBusinessModalProps {
  openModal: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  selectedBusiness: BusinessInfoItem;
}

const ChangeStatusBusinessModal: FC<ChangeStatusBusinessModalProps> = ({
  openModal,
  onClose,
  handleConfirm,
  selectedBusiness,
}) => {
  const { mutate } = useChangeStatusBusiness();

  const handleSubmit = () => {
    mutate(
      {
        businessId: selectedBusiness.businessId,
        status: selectedBusiness.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
      {
        onSuccess: (successData: MainResponse) => {
          if (successData.resultCode === ResultType.Success) {
            toast.success("تغییر وضعیت کسب‌وکار مورد نظر با موفقیت انجام شد.");
            handleConfirm();
            onClose();
          }
        },
      }
    );
  };

  return (
    <Modal
      title={<span className="!text-gray-800 dark:!text-gray-200">تغییر وضعیت کسب‌وکار</span>}
      open={openModal}
      onCancel={onClose}
      keyboard={false}
      maskClosable={false}
      okText="بله"
      cancelText="خیر"
      onOk={handleSubmit}
      width={550}
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
      <div className="font-medium my-2">
        <hr className="mb-4 text-gray-200" />
        <span> آیا از </span>
        <span
          className={cn(
            "font-bold",
            selectedBusiness.status === "ACTIVE"
              ? "text-red-500"
              : "text-green-500"
          )}
        >
          {" "}
          {selectedBusiness.status === "ACTIVE"
            ? `غیرفعال کردن`
            : `فعال کردن`}{" "}
        </span>
        <span>کسب‌وکار اطمینان دارید ؟ </span>
      </div>
    </Modal>
  );
};

export default ChangeStatusBusinessModal;
