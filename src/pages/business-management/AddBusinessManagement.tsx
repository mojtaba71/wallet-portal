import React, { useEffect, useState, useCallback } from "react";
import { Button, Divider } from "antd";
import AddBusinessInfo from "./AddBusinessInfo";
import AddBusinessDeposit from "./AddBusinessDeposit";
import "./business-management.scss";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";

const AddBusinessManagementView: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [businessId, setBusinessId] = useState<number | null>(null);
  const [showDepositSection, setShowDepositSection] = useState(false);
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [submitInfoForm, setSubmitInfoForm] = useState<(() => void) | null>(null);
  const [submitDepositForm, setSubmitDepositForm] = useState<(() => void) | null>(null);
  const isAddDepositOnly = Boolean(state?.addBusinessDeposit && state?.businessId && !state?.businessInfo);

  const handleInfoSuccess = useCallback((businessId: number) => {
    setBusinessId(businessId);
    // در حالت افزودن، فرم حساب را اینجا نمایش نده؛ از دکمه "ادامه به اطلاعات حساب" استفاده می‌شود
    setInfoSubmitted(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const isEditMode = Boolean(state?.businessInfo || state?.businessId || state?.depositData);
    if (isAddDepositOnly) {
      submitDepositForm?.();
      return;
    }
    
    if (isEditMode) {
      if (submitInfoForm) {
        submitInfoForm();
      }
      if (showDepositSection && businessId && submitDepositForm) {
        submitDepositForm();
      }
    } else if (infoSubmitted && showDepositSection && businessId && submitDepositForm) {
      submitDepositForm();
    } else {
      submitInfoForm?.();
    }
  }, [submitInfoForm, submitDepositForm, showDepositSection, businessId, state, infoSubmitted, isAddDepositOnly]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const bindSubmitCallback = useCallback((fn: () => void) => {
    setSubmitInfoForm(() => fn);
  }, []);

  const bindDepositSubmitCallback = useCallback((fn: () => void) => {
    setSubmitDepositForm(() => fn);
  }, []);

  useEffect(() => {
    if (state?.businessInfo) {
      setBusinessId(state.businessInfo.businessId);
      setShowDepositSection(true);
    }
    
    if (state?.addBusinessDeposit && state?.businessId) {
      setBusinessId(state.businessId);
      setShowDepositSection(true);
    }

    if (state?.businessId && !state?.businessInfo && !state?.addBusinessDeposit) {
      setBusinessId(state.businessId);
      setShowDepositSection(true);
    }
  }, [state]);

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex-1 flex flex-col overflow-hidden border border-gray-100 dark:border-gray-400">
        <SimpleBar className="flex-1" style={{ height: 'calc(100vh - 300px)' }}>
          <div className="p-6 space-y-6">
            {!isAddDepositOnly && (
              <>
                <AddBusinessInfo 
                  handleSuccess={handleInfoSuccess}
                  bindSubmit={bindSubmitCallback}
                />
                {showDepositSection && (
                  <Divider 
                    className="!border-dashed !border-blue-400 !my-6"
                    style={{ borderStyle: 'dashed', borderColor: '#60a5fa' }}
                  />
                )}
              </>
            )}

            {showDepositSection && businessId && (Boolean(state?.businessInfo || state?.businessId || state?.depositData) || isAddDepositOnly) && (
              <AddBusinessDeposit 
                businessId={businessId} 
                bindSubmit={bindDepositSubmitCallback}
              />
            )}
          </div>
        </SimpleBar>

        {/* دکمه‌های ثابت در پایین */}
        <div className="border-t border-gray-200 dark:border-gray-400 p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCancel}
              className="!w-[120px] !bg-white dark:!bg-transparent !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
            >
              انصراف
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="!w-[180px] !bg-blue-500 hover:!bg-blue-600 !border-blue-500"
            >
              ثبت
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessManagementView;
