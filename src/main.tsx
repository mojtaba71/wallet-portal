import { persistor, store } from "@/store";
import { fetchConfig } from "@/store/configSlice.ts";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "@/assets/font.css";
import "./index.css";
import "simplebar-react/dist/simplebar.min.css";

registerSW({
  onNeedRefresh() {
    console.log("🔄 نسخه جدید در دسترس است");
  },
  onOfflineReady() {
    console.log("✅ اپلیکیشن آماده استفاده آفلاین است");
  },
});

const container = document.getElementById("root")!;
const root = createRoot(container);

store.dispatch(fetchConfig()).then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate
          loading={<div>در حال بارگذاری...</div>}
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
});
