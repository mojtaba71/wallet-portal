import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { store } from "@/store";
import { HttpStatus } from "@/models/enum/enum";
import { clearToken } from "@/store/authSlice";
import { UrlRoutes } from "@/routes/url.routes";
import { getPersianErrorMessage } from "@/models/enum/resultCode";

const logOut = () => {
  store.dispatch(clearToken());
  window.location.href = UrlRoutes.login;
};

const SUPPRESSED_ERROR_CODES = [13001];

const Axios = axios.create();

Axios.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  const baseUrl = state.config.baseUrl;

  config.baseURL = config.baseURL || baseUrl;

          // @ts-expect-error - Axios config headers type mismatch
  config.headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return config;
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const resultCode = error.response?.data?.resultCode;
    
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        logOut();
        break;
      case HttpStatus.FORBIDDEN:
        toast.error("دسترسی غیرمجاز");
        break;
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.NOT_FOUND:
        if (resultCode === 107) {
          logOut();
        }
        if (!SUPPRESSED_ERROR_CODES.includes(resultCode)) {
          const errorMessage = resultCode ? getPersianErrorMessage(resultCode) : "خطای درخواست";
          toast.error(errorMessage);
        }
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        if (resultCode) {
          const errorMessage = getPersianErrorMessage(resultCode);
          toast.error(errorMessage);
        } else {
          toast.error("خطای سیستمی رخ داده است");
        }
        break;
      default:
        // برای سایر خطاها، بررسی ResultCode
        if (resultCode) {
          const errorMessage = getPersianErrorMessage(resultCode);
          toast.error(errorMessage);
        } else {
          toast.error("خطای سیستمی رخ داده است");
        }
        break;
    }

    return Promise.reject(error);
  }
);

const defaultHeader = {
  headers: {
    "Content-Type": "application/json",
  },
};

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await Axios.post<T>(url, data, {
      ...defaultHeader,
      ...options,
    });
    return response.data;
  }

  static async postUpload<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await Axios.post<T>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    });
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async patch<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await Axios.patch<T>(url, data, {
      ...defaultHeader,
      ...options,
    });
    return response.data;
  }

  static async delete<T>(url: string, options?: AxiosRequestConfig) {
    const response = await Axios.delete<T>(url, {
      ...defaultHeader,
      ...options,
    });
    return response.data;
  }
}
