import type { RootState } from "@/store";
import { setExp, setToken } from "@/store/authSlice";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshToken } from "./auth.hook";

import { jwtDecode } from "jwt-decode";

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

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const useTokenRefresh = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const exp = useSelector((state: RootState) => state.auth.exp);
  const dispatch = useDispatch();
  const { mutationRefreshToken, isSuccess, data } = useRefreshToken();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshedRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isSuccess && data && !refreshedRef.current) {
      refreshedRef.current = true;

      if (data.accessToken) {
        dispatch(setToken(data.accessToken));

        const decoded = decodeToken(data.accessToken);
        if (decoded) {
          dispatch(setExp(decoded.exp));
          scheduleTokenRefresh(decoded.exp);
        }
      }

      setTimeout(() => {
        refreshedRef.current = false;
      }, 1000);
    }
  }, [isSuccess, data, dispatch]);

  const scheduleTokenRefresh = useCallback(
    (expiration: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiration - currentTime;

      if (timeUntilExpiry > 120) {
        const timeUntilRefresh = (timeUntilExpiry - 60) * 1000;

        timeoutRef.current = setTimeout(() => {
          if (!refreshedRef.current) {
            mutationRefreshToken();
          }
        }, timeUntilRefresh);
      } else if (timeUntilExpiry > 60) {
        const timeUntilRefresh = (timeUntilExpiry - 60) * 1000;

        timeoutRef.current = setTimeout(() => {
          if (!refreshedRef.current) {
            mutationRefreshToken();
          }
        }, timeUntilRefresh);
      } else if (timeUntilExpiry > 0) {
        if (!refreshedRef.current) {
          mutationRefreshToken();
        }
      }
    },
    [mutationRefreshToken]
  );

  useEffect(() => {
    if (!token || isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    if (exp) {
      scheduleTokenRefresh(exp);
    } else {
      const decoded = decodeToken(token);
      if (decoded?.exp) {
        dispatch(setExp(decoded.exp));
        scheduleTokenRefresh(decoded.exp);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    isRefreshing: false,
  };
};
