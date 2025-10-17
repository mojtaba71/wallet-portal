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
  MdPerson,
  MdGroup,
  MdPayment,
  MdAccountBalanceWallet,
  MdCheckCircle,
  MdBusinessCenter,
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
      label: "مدیریت اطلاعات پایه",
      icon: <MdBusiness />,
      children: [
        {
          to: `${UrlRoutes.baseInfoManagement}${UrlRoutes.customers}`,
          label: "مشتریان",
          icon: <MdPerson />,
        },
        {
          to: `${UrlRoutes.baseInfoManagement}${UrlRoutes.groupCustomerRegistration}`,
          label: "ثبت گروهی مشتریان",
          icon: <MdGroup />,
        },
      ],
    },
    {
      to: UrlRoutes.paymentMethod,
      label: "روش پرداخت",
      icon: <MdPayment />,
    },
    {
      label: "مدیریت کیف",
      icon: <MdAccountBalanceWallet />,
      children: [
        {
          to: `${UrlRoutes.walletManagement}${UrlRoutes.personalWallet}`,
          label: "کیف شخصی",
          icon: <MdCheckCircle />,
        },
        {
          to: `${UrlRoutes.walletManagement}${UrlRoutes.groupWalletIssuance}`,
          label: "صدور گروهی کیف",
          icon: <MdCheckCircle />,
        },
        {
          to: `${UrlRoutes.walletManagement}${UrlRoutes.organizationalCardCharge}`,
          label: "شارژ کارت سازمانی",
          icon: <MdBusinessCenter />,
        },
        {
          to: `${UrlRoutes.walletManagement}${UrlRoutes.walletGroup}`,
          label: "گروه کیف",
          icon: <MdBusinessCenter />,
        },
      ],
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
        item.children.some((c) => c.to && pathname === c.to);

      const hasActiveChild = item.children.some(
        (c) => c.to && pathname === c.to
      );

      return (
        <li key={item.label} className="mb-2">
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "!w-full !p-3 !rounded-lg !flex !justify-between !items-center !transition-all !duration-200 !outline-none !cursor-pointer !text-sm",
              hasActiveChild
                ? "!bg-green-500 !text-white"
                : "!text-gray-600 dark:!text-gray-50 hover:!bg-gray-50 dark:hover:!bg-gray-800"
            )}
          >
            <span className="flex items-center gap-3 font-medium">
              <span
                className={cn(
                  "!text-lg !transition-colors !duration-200",
                  hasActiveChild
                    ? "!text-white"
                    : "!text-gray-600 dark:!text-gray-50"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </span>
            <span
              className={cn(
                "!transition-all !duration-300 !text-xl !transform",
                hasActiveChild
                  ? "!text-white"
                  : "!text-gray-600 dark:!text-gray-50",
                isChildOpen ? "!rotate-180" : "!rotate-0"
              )}
            >
              <MdExpandMore />
            </span>
          </button>

          <div
            className={cn(
              "!overflow-hidden !transition-all !duration-300 !ease-in-out",
              isChildOpen ? "!max-h-96 !opacity-100" : "!max-h-0 !opacity-0"
            )}
          >
            <ul className="mt-2 space-y-1 mr-4 pb-2">
              {item.children.map((child) => (
                <li key={child.label}>
                  <NavLink
                    to={child.to!}
                    className={({ isActive }) =>
                      cn(
                        "!block !p-3 !rounded-lg !text-sm !transition-all !duration-200",
                        isActive
                          ? "!bg-green-100 !text-white !font-medium"
                          : "!text-gray-600 dark:!text-gray-50 hover:!bg-gray-50 dark:hover:!bg-gray-800"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "!text-sm !transition-colors !duration-200",
                            isActive
                              ? "!text-white"
                              : "!text-gray-600 dark:!text-gray-50"
                          )}
                        >
                          {child.icon}
                        </span>
                        {child.label}
                      </span>
                    )}
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
              "!block !w-full !p-3 !rounded-lg !transition-all !duration-200 !text-sm",
              isActive
                ? "!bg-green-100 !text-white"
                : "!text-gray-600 dark:!text-gray-50 hover:!bg-gray-50 dark:hover:!bg-gray-800"
            )
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-3 font-medium">
              <span
                className={cn(
                  "!text-lg !transition-colors !duration-200",
                  isActive ? "!text-white" : "!text-gray-600 dark:!text-gray-50"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </span>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="!bg-white dark:!bg-gray-800 !w-80 !h-screen !border-l !border-gray-250 md:!relative md:!flex md:!flex-col !transition-colors !duration-300">
      <div className="px-4 py-4 h-15">
        <div className="!border-b !border-gray-250 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="!text-gray-600 dark:!text-gray-300 !text-base font-medium">
              پرتال کیف پول
            </h1>
            <MdMenu className="text-gray-600 dark:text-gray-300 text-xl" />
          </div>
        </div>
      </div>

      <SimpleBar className="!bg-transparent" style={{ height: "100%" }}>
        <div className="p-4">
          <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
        </div>
      </SimpleBar>
    </aside>
  );
};

export default Sidebar;
