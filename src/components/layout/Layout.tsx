import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { useTokenRefresh } from "@/services/hook/useTokenRefresh.hook";
import { useState, useEffect, useRef } from "react";

const MainLayout = () => {
  useTokenRefresh();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-700 transition-colors duration-300 overflow-hidden">
      <div
        className="md:hidden fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
        }}
        ref={sidebarRef}
      >
        <Sidebar />
      </div>

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full h-full min-w-0">
        <Header onMenuClick={toggleSidebar} />
        <main className="p-2 sm:p-3 md:p-4 lg:p-6 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-700 transition-colors duration-300 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
