import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface ConfigState {
  baseUrl: string;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  baseUrl: "",
  loading: false,
  error: null,
};

interface ConfigResponse {
  baseUrl: string;
}

export const fetchConfig = createAsyncThunk("config/fetch", async () => {
  const response = await fetch("/config.json");
  return (await response.json()) as ConfigResponse;
});

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchConfig.fulfilled,
        (state, action: PayloadAction<ConfigResponse>) => {
          state.baseUrl = action.payload.baseUrl;
          state.loading = false;
        }
      )
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "مشکلی در دریافت تنظیمات به وجود آمده است";
      });
  },
});
export default configSlice.reducer;
