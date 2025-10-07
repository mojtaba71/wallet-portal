import { useState, type JSX } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";

import { UrlRoutes } from "@/routes/url.routes";
import cn from "classnames";
import {
  MdAssessment,
  MdBusiness,
  MdCreditCard,
  MdDashboard,
  MdExpandMore,
  MdMenu,
} from "react-icons/md";

type MenuItem = {
  to?: string;
  label: string;
  icon: JSX.Element;
  children?: MenuItem[];
};

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { pathname } = useLocation();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems: MenuItem[] = [
    { to: UrlRoutes.dashboard, label: "داشبورد", icon: <MdDashboard /> },
    {
      to: `${UrlRoutes.businessManagement}${UrlRoutes.businessManagementList}`,
      label: "مدیریت کسب وکارها",
      icon: <MdBusiness />,
    },
    {
      to: `${UrlRoutes.cardManagement}${UrlRoutes.cardManagementList}`,
      label: "مدیریت کارت‌ها",
      icon: <MdCreditCard />,
    },
    {
      label: "گزارشات",
      icon: <MdAssessment />,
      children: [
        {
          to: `${UrlRoutes.reports}${UrlRoutes.reportsCard}`,
          label: "گزارش کارت",
          icon: <MdCreditCard />,
        },
        {
          to: `${UrlRoutes.reports}${UrlRoutes.reportsCardEvents}`,
          label: "گزارش رخدادهای کارت",
          icon: <MdCreditCard />,
        },
        {
          to: `${UrlRoutes.reports}${UrlRoutes.reportsBusinessDeposit}`,
          label: "گزارش واریز به حساب کسب و کار",
          icon: <MdBusiness />,
        },
        {
          to: `${UrlRoutes.reports}${UrlRoutes.reportsSettlement}`,
          label: "گزارش تسویه",
          icon: <MdCreditCard />,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isChildOpen =
        openMenus[item.label] ||
        item.children.some((c) => pathname.startsWith(c.to!));
      
      const hasActiveChild = item.children.some((c) => pathname.startsWith(c.to!));

      return (
        <li key={item.label} className="mb-2">
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "w-full p-3 rounded-lg flex justify-between items-center transition-all duration-200 outline-none cursor-pointer text-sm",
              hasActiveChild
                ? "bg-blue-100 dark:bg-blue-400 !text-blue-600 dark:!text-gray-50"
                : "!text-gray-600 dark:!text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <span className="flex items-center gap-3 font-medium">
              <span
                className={cn(
                  "text-lg transition-colors duration-200",
                  hasActiveChild ? "!text-blue-600 dark:!text-gray-50" : "text-gray-600 dark:text-gray-50"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </span>
            <span
              className={cn(
                "transition-all duration-300 text-xl transform",
                hasActiveChild ? "!text-blue-600 dark:!text-gray-50" : "text-gray-600 dark:text-gray-50",
                isChildOpen ? "rotate-180" : "rotate-0"
              )}
            >
              <MdExpandMore />
            </span>
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isChildOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <ul className="mt-2 space-y-1 mr-4 pb-2">
              {item.children.map((child) => (
                <li key={child.label}>
                  <NavLink
                    to={child.to!}
                    className={({ isActive }) =>
                      cn(
                        "block p-3 rounded-lg text-sm transition-all duration-200",
                        isActive
                          ? "bg-blue-100 dark:bg-blue-400 !text-blue-600 dark:!text-gray-50 font-medium"
                          : "!text-gray-600 dark:!text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      {child.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.label} className="mb-2">
        <NavLink
          to={item.to!}
          className={({ isActive }) =>
            cn(
              "block w-full p-3 rounded-lg transition-all duration-200 text-sm",
              isActive
                ? "bg-blue-100 dark:bg-blue-400 !text-blue-600 dark:!text-gray-50"
                : "!text-gray-600 dark:!text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800"
            )
          }
        >
          <span className="flex items-center gap-3 font-medium">
            <span
              className={cn(
                "text-lg transition-colors duration-200",
                pathname === item.to ? "!text-blue-600 dark:!text-gray-50" : "text-gray-600 dark:text-gray-50"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="bg-white dark:bg-gray-800 w-80 h-screen !border-l !border-gray-250 md:relative md:flex md:flex-col transition-colors duration-300">
      <div className="px-4 py-4 h-15">
        <div className="!border-b !border-gray-250 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="!text-gray-600 dark:!text-gray-300 !text-base font-medium">
              پرتال هاب بانک سینا
            </h1>
            <MdMenu className="text-gray-600 dark:text-gray-300 text-xl" />
          </div>
        </div>
      </div>

      <SimpleBar className="bg-transparent" style={{ height: "100%" }}>
        <div className="p-4">
          <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
        </div>
      </SimpleBar>
    </aside>
  );
};

export default Sidebar;
