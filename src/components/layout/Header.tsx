import { useState, useEffect } from "react";
import {
  Dropdown,
  Modal,
  Form,
  Input,
  Button,
  message,
  Avatar,
} from "antd";
import {
  MdLightMode,
  MdMenu,
  MdPerson,
} from "react-icons/md";
import { 
  NotificationIcon,
  MoonIcon,
  UserIcon
} from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearToken } from "@/store/authSlice";
import { toggleTheme } from "@/store/themeSlice";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/login");
  };

  const handleChangePassword = async (values: any) => {
    try {
      console.log("Changing password:", values);
      message.success("رمز عبور با موفقیت تغییر کرد");
      setShowChangePasswordModal(false);
      changePasswordForm.resetFields();
      navigate("/login");
    } catch (error) {
      message.error("خطا در تغییر رمز عبور");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="py-3 px-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                size={48}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
              >
                {userInfo?.name?.charAt(0) || ""}
              </Avatar>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                {userInfo?.name || ""}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo?.uname || ""}
              </span>
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "changePassword",
      label: "تغییر رمز عبور",
      icon: <MdPerson />,
      onClick: () => setShowChangePasswordModal(true),
    },
    {
      key: "logout",
      label: "خروج",
      icon: <MdPerson />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 h-14 md:h-16 lg:h-18 flex justify-between items-center px-3 md:px-6 lg:px-8 py-2 md:py-3 w-full transition-all duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg transition-all duration-200"
        >
          <MdMenu className="text-xl !text-gray-600 dark:!text-gray-200" />
        </button>

        <img
          src="/images/banksina1-removebg-preview.png"
          alt="بانک سینا"
          className="h-6 md:h-10 lg:h-12 transition-transform duration-200 hover:scale-105 dark:bg-white dark:rounded-md dark:p-1"
        />
        <img
          src="/images/green-logo.png"
          alt="لوگو گرین"
          className="h-6 md:h-10 lg:h-12 transition-transform duration-200 hover:scale-105 dark:bg-white dark:rounded-md dark:p-1"
        />
        {/* <img
          src="/images/kasbino-removebg-preview.png"
          alt="کسبینو"
          className="h-5 md:h-9 lg:h-11 transition-transform duration-200 hover:scale-105"
        /> */}
      </div>

      <div className="flex items-center gap-1 md:gap-3 lg:gap-4">
          <div className="group cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-250 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <NotificationIcon 
              width={isMobile ? 14 : 18} 
              height={isMobile ? 14 : 18} 
              color={theme === "dark" ? "#F2F2F2" : "#292D32"} 
            />
          </div>

        <div
          className="group cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-250 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          onClick={handleThemeToggle}
        >
          {theme === "dark" ? (
            <MdLightMode className={`${isMobile ? 'text-sm' : 'text-lg'} text-yellow-500 group-hover:text-yellow-600 transition-colors duration-200`} />
          ) : (
            <MoonIcon 
              width={isMobile ? 14 : 18} 
              height={isMobile ? 14 : 18} 
              color="#292D32" 
            />
          )}
        </div>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="group cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-250 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <UserIcon 
              width={isMobile ? 14 : 18} 
              height={isMobile ? 14 : 18} 
              color={theme === "dark" ? "#F2F2F2" : "#292D32"} 
            />
          </div>
        </Dropdown>
      </div>

      <Modal
        title="تغییر رمز عبور"
        open={showChangePasswordModal}
        onCancel={() => setShowChangePasswordModal(false)}
        footer={null}
        width={400}
        className="dark:!bg-gray-800"
        styles={{
          header: {
            backgroundColor: "var(--ant-color-bg-container)",
            borderBottom: "1px solid var(--ant-color-border)",
          },
          body: {
            backgroundColor: "var(--ant-color-bg-container)",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
      >
        <Form
          form={changePasswordForm}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <Form.Item
            name="currentPassword"
            label="رمز عبور فعلی"
            rules={[
              { required: true, message: "لطفا رمز عبور فعلی را وارد کنید" },
            ]}
          >
            <Input.Password
              placeholder="رمز عبور فعلی"
              className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="رمز عبور جدید"
            rules={[
              { required: true, message: "لطفا رمز عبور جدید را وارد کنید" },
              { min: 8, message: "رمز عبور باید حداقل 8 کاراکتر باشد" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message:
                  "رمز عبور باید شامل حروف بزرگ، کوچک، اعداد و کاراکترهای خاص باشد",
              },
            ]}
          >
            <Input.Password
              placeholder="رمز عبور جدید"
              className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="تکرار رمز عبور جدید"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "لطفا تکرار رمز عبور جدید را وارد کنید",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("رمز عبور جدید و تکرار آن یکسان نیستند")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="تکرار رمز عبور جدید"
              className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
            />
          </Form.Item>

          <div className="text-xs !text-gray-500 dark:!text-gray-400 mb-4">
            رمز عبور باید شامل حداقل 8 کاراکتر، حروف بزرگ و کوچک، اعداد و
            کاراکترهای خاص باشد
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setShowChangePasswordModal(false)}
              className="dark:!bg-gray-700 dark:!border-gray-250 dark:!text-white"
            >
              انصراف
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="dark:!bg-blue-600 dark:!border-blue-600"
            >
              تغییر رمز عبور
            </Button>
          </div>
        </Form>
      </Modal>
    </header>
  );
};

export default Header;
