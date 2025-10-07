import { Button, Form, Input, ConfigProvider, theme } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { LockIcon, ProfileIcon } from "@/assets/icons";
import { useLogin } from "@/services/hook/auth.hook";
import type { LoginRequest, LoginResponse } from "@/models/auth.model";
import { ResultType } from "@/models/enum/enum";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo, setExp } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { UrlRoutes } from "@/routes/url.routes";
import { jwtDecode } from "jwt-decode";
import fa_IR from "antd/es/locale/fa_IR";

interface JwtPayload {
  iss: string;
  iat: number;
  exp: number;
  jti: string;
  name: string;
  uname: string;
  uid: number;
  roles: Record<string, string[]>;
  domainAttributes: {
    portal: {
      theme: string;
      language: string[];
    };
  };
}

type LoginForm = LoginRequest;

const LoginView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutationLogin, isLoading } = useLogin();

  const onFinish = (values: LoginForm) => {
    mutationLogin(
      { ...values },
      {
        onSuccess: (successData: LoginResponse) => {
          if (successData.resultCode === ResultType.Success) {
            dispatch(setToken(successData.accessToken));

            try {
              const decoded = jwtDecode<JwtPayload>(successData.accessToken);
              dispatch(setUserInfo(decoded));
              dispatch(setExp(decoded.exp));
            } catch (error) {
              console.error("Error decoding token:", error);
            }

            navigate(UrlRoutes.dashboard);
          }
        },
      }
    );
  };

  return (
    <ConfigProvider
      locale={fa_IR}
      direction="rtl"
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          fontFamily: "IranSans",
          colorBgContainer: "#ffffff",
          colorText: "#1f2937",
          colorBorder: "#d1d5db",
          colorTextPlaceholder: "#9ca3af",
        },
      }}
    >
      <div
        className="login-page !bg-gray-50 flex justify-center items-center min-h-screen !p-4 sm:!p-6"
        dir="rtl"
        style={{ outline: "none", border: "none" }}
      >
        <div className="!w-full !max-w-5xl !bg-white !shadow-card !rounded-2xl !overflow-hidden flex flex-col md:flex-row !mx-auto">
          <div className="!w-full md:!w-1/2 !p-6 md:!p-12 lg:!p-16">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                ورود به سیستم
              </h2>
              <div className="flex gap-2 md:gap-3">
                <img
                  src="/images/banksina1.png"
                  alt="لوگو بانک سینا"
                  className="w-20 h-12 sm:w-24 sm:h-16 md:w-24 md:h-20"
                />
                <img
                  src="/images/green-logo.png"
                  alt="لوگو گرین"
                  className="w-20 h-12 sm:w-24 sm:h-16 md:w-24 md:h-20"
                />
              </div>
            </div>

            <Form
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              className="!space-y-4"
            >
              <div className="!mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  نام کاربری
                </label>
                <Form.Item
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "لطفاً نام کاربری را وارد کنید",
                    },
                  ]}
                  className="!mb-0"
                >
                  <Input
                    size="large"
                    prefix={
                      <ProfileIcon width={20} height={20} color="#999999" />
                    }
                    placeholder="نام کاربری"
                    className="!h-10 sm:!h-12 md:!h-14 !text-sm sm:!text-base md:!text-lg !rounded-lg !border !border-gray-300 hover:!border-blue-400 focus:!border-blue-500 !shadow-sm dir-rtl !bg-white"
                  />
                </Form.Item>
              </div>

              <div className="!mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  رمز عبور
                </label>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "لطفاً رمز عبور را وارد کنید" },
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    size="large"
                    prefix={<LockIcon width={20} height={20} color="#999999" />}
                    placeholder="رمز عبور"
                    className="!h-10 sm:!h-12 md:!h-14 !text-sm sm:!text-base md:!text-lg !rounded-lg !border !border-gray-300 hover:!border-blue-400 focus:!border-blue-500 !shadow-sm dir-rtl !bg-white"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    مرا به یاد داشته باش
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  فراموشی رمز عبور؟
                </a>
              </div>

              <Form.Item className="!mb-0">
                <Button
                  htmlType="submit"
                  type="primary"
                  className="!w-full !bg-blue-400 hover:!bg-blue-500 !h-10 sm:!h-12 md:!h-14 !text-sm sm:!text-base md:!text-lg !font-medium !rounded-lg !shadow-md hover:!shadow-lg !border-0 !transition-all !duration-300 !text-white"
                  size="large"
                  loading={isLoading}
                >
                  {isLoading ? "در حال ورود..." : "ورود به حساب کاربری"}
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-6 md:mt-8 lg:mt-10 text-center">
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">
                پورتال هاب بانک سینا
              </p>
              <p className="text-xs text-gray-500">نسخه ۱.۰.۰</p>
            </div>
          </div>
          <div className="hidden md:block w-full md:w-1/2 p-4 md:p-6 lg:p-8">
            <img
              src="/images/img-login-preview.png"
              alt="عکس پس‌زمینه"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginView;
