import type {
  CardDetailsResponse,
  CardItem,
} from "@/models/cardManagement.model";
import { useCardDetails } from "@/services/hook/cardManagementService.hook";
import { getCardTypeText, getGenderText, getStatusText } from "@/utils/utils";
import { Divider, Modal, Spin, Tag, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import {
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaIdCard,
  FaPhoneAlt,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import {
  MdAccountBalance,
  MdBusiness,
  MdDateRange,
  MdPerson,
  MdUpdate,
} from "react-icons/md";

const { Title, Text } = Typography;

interface CardDetailsModalProps {
  open: boolean;
  onCancel: () => void;
  card: CardItem | undefined;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  open,
  onCancel,
  card,
}) => {
  const { mutate, isLoading } = useCardDetails();
  const [cardInfo, setCardInfo] = useState<CardDetailsResponse>();

  if (!card) return null;

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "green" : "red";
  };

  const getGenderIcon = (gender: string) => {
    return gender === "MALE" ? (
      <BsGenderMale className="text-blue-500" />
    ) : (
      <BsGenderFemale className="text-pink-500" />
    );
  };

  const getCardDetails = useCallback(() => {
    mutate(
      {
        personId: card.personId || 0,
        pan : card.pan
      },
      {
        onSuccess: (successData: CardDetailsResponse) => {
          setCardInfo(successData);
        },
      }
    );
  }, [mutate, card.personId]);

  useEffect(() => {
    getCardDetails();
  }, [getCardDetails]);

  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    className?: string;
  }> = ({ icon, label, value, className = "" }) => (
    <div
      className={`flex items-center gap-3 p-3 bg-gray-50 dark:!bg-gray-700 rounded-lg ${className}`}
    >
      <div className="flex-shrink-0 text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <Text className="text-xs !text-gray-500 dark:!text-gray-400 block">{label}</Text>
        <Text className="font-medium !text-gray-800 dark:!text-gray-200 break-all">
          <bdi> {value || "ندارد"}</bdi>
        </Text>
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaCreditCard className="text-blue-500" />
          <span className="!text-gray-800 dark:!text-gray-200">اطلاعات کارت و دارنده</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnHidden
      loading={isLoading}
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
      <Spin spinning={isLoading}>
        <div className="space-y-6">
          {/* اطلاعات دارنده کارت */}
          <div>
            <Title level={4} className="flex items-center gap-2 !mb-4">
              <FaUser className="text-green-500" />
              اطلاعات دارنده کارت
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<MdPerson className="text-blue-500" />}
                label="نام و نام خانوادگی"
                value={`${cardInfo?.personInfo.name} ${cardInfo?.personInfo.lastName}`}
              />

              <InfoItem
                icon={<MdPerson className="text-blue-500" />}
                label="نام انگلیسی"
                value={`${cardInfo?.personInfo.nameEN} ${cardInfo?.personInfo.lastNameEN}`}
              />

              <div className="flex flex-col gap-2">
                <InfoItem
                  icon={<FaIdCard className="text-purple-500" />}
                  label="کد مشخصه مشتری"
                  value={cardInfo?.personInfo.personId}
                />
                <div className="text-xs text-gray-500 mb-4">
                  برای افراد حقیقی: کد ملی، برای اتباع: شناسه فراگیر و برای
                  حقوقی: شناسه ملی
                </div>
              </div>

              <InfoItem
                icon={
                  cardInfo?.personInfo.gender
                    ? getGenderIcon(cardInfo?.personInfo.gender)
                    : ""
                }
                label="جنسیت"
                value={
                  cardInfo?.personInfo.gender
                    ? getGenderText(cardInfo?.personInfo.gender)
                    : ""
                }
              />

              <InfoItem
                icon={<FaClock className="text-gray-500" />}
                label="تاریخ ثبت"
                value={cardInfo?.personInfo.insertDateTime}
              />
            </div>
          </div>

          <Divider />

          <div>
            <Title level={4} className="flex items-center gap-2 !mb-4">
              <FaCreditCard className="text-blue-500" />
              اطلاعات کارت‌ها ({cardInfo?.cardCount} کارت)
            </Title>

            <div className="space-y-6">
              {cardInfo?.cardList.map((card, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:!border-gray-250 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:!from-gray-700 dark:!to-gray-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                        <FaCreditCard className="text-white text-lg" />
                      </div>
                      <div>
                        <Text className="font-semibold text-lg text-gray-800">
                          {getCardTypeText(card.cardType)}
                        </Text>
                        <br />
                        <Tag
                          color={getStatusColor(card.status)}
                          className="mt-1"
                        >
                          {getStatusText(card.status)}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoItem
                      icon={<FaCreditCard className="text-blue-500" />}
                      label="شماره کارت (PAN)"
                      value={card.pan}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<FaPhoneAlt className="text-green-500" />}
                      label="شماره موبایل"
                      value={card.mobile}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<FaCalendarAlt className="text-red-500" />}
                      label="تاریخ انقضاء"
                      value={card.expireDate}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<MdBusiness className="text-purple-500" />}
                      label="کد کسب‌وکار"
                      value={card.businessId}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<FaBuilding className="text-orange-500" />}
                      label="نام کسب‌وکار"
                      value={card.businessName}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<FaUniversity className="text-teal-500" />}
                      label="شماره سپرده"
                      value={card.depositNumber}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<MdAccountBalance className="text-indigo-500" />}
                      label="شماره شبا"
                      value={card.iban}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<MdDateRange className="text-gray-500" />}
                      label="تاریخ ایجاد"
                      value={card.insertDateTime}
                      className="bg-white"
                    />

                    <InfoItem
                      icon={<MdUpdate className="text-amber-500" />}
                      label="تاریخ آخرین بروزرسانی"
                      value={card.updateDateTime}
                      className="bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default CardDetailsModal;
