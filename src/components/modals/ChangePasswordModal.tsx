import React, { useCallback, useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UrlRoutes } from "@/routes/url.routes";
import { useChangePassword } from "@/services/hook/auth.hook";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm<ChangePasswordForm>();
  const navigate = useNavigate();
  const { 
    mutationChangePassword, 
    isLoading, 
    isSuccess, 
    error 
  } = useChangePassword();

  const validatePassword = useCallback((password: string): boolean => {
    // حداقل 6 کاراکتر، شامل حروف بزرگ، کوچک و اعداد
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
  }, []);

  const handleSubmit = useCallback((values: ChangePasswordForm) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن یکسان نیستند");
      return;
    }

    if (!validatePassword(values.newPassword)) {
      toast.error("رمز عبور باید حداقل 6 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد");
      return;
    }

    mutationChangePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }, [mutationChangePassword, validatePassword]);

  const handleSuccess = useCallback(() => {
    toast.success("رمز عبور با موفقیت تغییر یافت");
    form.resetFields();
    onClose();
    
    // Redirect to login with new password
    setTimeout(() => {
      navigate(UrlRoutes.login);
    }, 2000);
  }, [form, onClose, navigate]);

  const handleError = useCallback(() => {
    toast.error("خطا در تغییر رمز عبور");
  }, []);

  useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [isSuccess, handleSuccess]);

  useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error, handleError]);

  const getPasswordStrength = useCallback((password: string) => {
    if (!password) return { text: "", color: "" };
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasMinLength].filter(Boolean).length;
    
    if (score === 4) return { text: "قوی", color: "text-green-600" };
    if (score >= 3) return { text: "متوسط", color: "text-yellow-600" };
    if (score >= 2) return { text: "ضعیف", color: "text-orange-600" };
    return { text: "خیلی ضعیف", color: "text-red-600" };
  }, []);

  const password = Form.useWatch("newPassword", form);
  const passwordStrength = getPasswordStrength(password);

  // Reset form when modal closes to prevent stale state
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      title={<span className="!text-gray-800 dark:!text-gray-200">تغییر رمز عبور</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
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
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="currentPassword"
          label="رمز عبور فعلی"
          rules={[
            { required: true, message: "لطفاً رمز عبور فعلی را وارد کنید" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور فعلی"
            size="large"
            className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white dir-rtl"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="رمز عبور جدید"
          rules={[
            { required: true, message: "لطفاً رمز عبور جدید را وارد کنید" },
            { min: 6, message: "رمز عبور باید حداقل 6 کاراکتر باشد" },
            {
              validator: (_, value) => {
                if (value && !validatePassword(value)) {
                  return Promise.reject(
                    "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور جدید"
            size="large"
            className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* Password strength indicator */}
        {password && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">قدرت رمز عبور:</span>
              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                {passwordStrength.text}
              </span>
            </div>
            <div className="flex gap-1">
              {[
                password.length >= 6,
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
                /\d/.test(password),
              ].map((valid, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    valid ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              حداقل 6 کاراکتر، شامل حروف بزرگ، کوچک و اعداد
            </div>
          </div>
        )}

        <Form.Item
          name="confirmPassword"
          label="تکرار رمز عبور جدید"
          rules={[
            { required: true, message: "لطفاً تکرار رمز عبور جدید را وارد کنید" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("رمز عبور جدید و تکرار آن یکسان نیستند");
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="تکرار رمز عبور جدید"
            size="large"
            className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onClose} disabled={isLoading} className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white">
              انصراف
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<LockOutlined />}
              className="dark:!bg-blue-600 dark:!border-blue-600"
            >
              تغییر رمز عبور
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
