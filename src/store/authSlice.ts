import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
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

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  exp: number | null;
}

const initialState: AuthState = {
  token: null,
  userInfo: null,
  exp: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setExp: (state, action: PayloadAction<number>) => {
      state.exp = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.userInfo = null;
      state.exp = null;
    },
  },
});

export const { setToken, setUserInfo, setExp, clearToken } = authSlice.actions;
export default authSlice.reducer;
