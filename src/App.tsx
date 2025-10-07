import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import fa_IR from "antd/es/locale/fa_IR";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import QueryProvider from "./providers/query-provider";
import type { RootState } from "./store";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./assets/style.scss";
import AppRoute from "./routes/app.routes";

function App() {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  
  useEffect(() => {
    const html = document.documentElement;
    const isDark = currentTheme === 'dark';
    
    
    // Add transition class for smooth theme switching
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    
    // Cleanup transition after animation
    const timer = setTimeout(() => {
      html.style.transition = '';
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentTheme]);

  return (
    <ConfigProvider
      locale={fa_IR}
      direction="rtl"
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "IranSans",
        },
      }}
    >
      <QueryProvider>
        <BrowserRouter>
          <ToastContainer rtl position="top-left" theme="colored" />
          <AppRoute />
        </BrowserRouter>
      </QueryProvider>
    </ConfigProvider>
  );
}

export default App;
