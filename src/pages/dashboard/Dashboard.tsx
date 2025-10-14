// DashboardView.tsx
import { BarChart, type BarChartData } from "@/components/charts/BarChart";
import { PieChart, type ChartData } from "@/components/charts/PieChart";
// Temporarily commented out imports to prevent errors
// import {
//   useBusinessBalance,
//   useBusinessSummary,
//   useDailyTransactionSummary,
//   useTodayTransactionSummary,
//   useTotalBalance,
// } from "@/services/hook/dashboardService.hook";
import { formatPersianDate } from "@/utils/utils";
import React, { useState, useEffect } from "react";
import {
  TbCreditCard,
  TbMoneybag,
  TbTrendingDown,
  TbTrendingUp,
} from "react-icons/tb";
import SimpleBar from "simplebar-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  isLoading = false,
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="!bg-white dark:!bg-gray-800 !shadow-lg !rounded-lg !p-3 sm:!p-4 md:!p-6 min-h-[120px] sm:min-h-[140px] overflow-hidden persian-numbers">
        <div className="animate-pulse">
          <div className="flex items-start justify-between !mb-3 sm:!mb-4">
            <div className="!h-3 sm:!h-4 !bg-gray-200 !rounded !w-20 sm:!w-24"></div>
            <div className="!w-8 !h-8 sm:!w-10 sm:!h-10 !bg-gray-200 !rounded-lg"></div>
          </div>
          <div className="!h-4 sm:!h-5 md:!h-6 !bg-gray-200 !rounded !w-28 sm:!w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="!bg-white dark:!bg-gray-800 !shadow-lg !rounded-lg !p-3 sm:!p-4 md:!p-6 hover:!shadow-xl transition-shadow duration-300 !border !border-gray-100 dark:!border-gray-400 min-h-[120px] sm:min-h-[140px] overflow-hidden persian-numbers">
      <div className="flex flex-col h-full">
        <div className="flex justify-start mb-3">
          <div className="!w-8 !h-8 sm:!w-10 sm:!h-10 md:!w-12 md:!h-12 !bg-blue-100 !rounded-full flex items-center justify-center flex-shrink-0">
            <div className="!text-blue-500">{icon}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="!text-xs sm:!text-sm font-medium !text-gray-200 dark:!text-gray-50 !mb-2 !line-clamp-2 text-right">
            {title}
          </h3>
          <div className="!text-sm sm:!text-base md:!text-lg lg:!text-xl font-bold !text-gray-900 dark:!text-gray-50 !break-all text-left">
            {typeof value === "number" ? formatNumber(value) : value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardView() {
  const [isMobile, setIsMobile] = useState(false);

  // Temporarily commented out API requests to prevent errors
  // const { data: todaySummary, isLoading: todayLoading } =
  //   useTodayTransactionSummary();
  // const { data: totalBalance, isLoading: balanceLoading } = useTotalBalance();
  // const { data: businessBalance, isLoading: businesBalanceLoading } =
  //   useBusinessBalance();
  // const { data: dailySummary, isLoading: dailyLoading } =
  //   useDailyTransactionSummary();
  // const { data: businessSummary, isLoading: businessSummaryLoading } =
  //   useBusinessSummary();

  // Mock data for testing
  const todaySummary = {
    todaySuccessCount: 0,
    todayFailedCount: 0,
    todaySuccessAmount: 0,
  };
  const totalBalance = { balance: 0 };
  const businessBalance = {
    businessInfoList: [
      { name: "کسب و کار ۱", balance: 0 },
      { name: "کسب و کار ۲", balance: 0 },
    ],
  };
  const dailySummary = {
    transactionSummaryList: [
      { date: "1403/01/01", successCount: 0, failureCount: 0 },
      { date: "1403/01/02", successCount: 0, failureCount: 0 },
      { date: "1403/01/03", successCount: 0, failureCount: 0 },
    ],
  };
  const businessSummary = {
    businessSummaryList: [
      { businessName: "کسب و کار ۱", transactionCount: 0 },
      { businessName: "کسب و کار ۲", transactionCount: 0 },
    ],
  };
  const todayLoading = false;
  const balanceLoading = false;
  const businesBalanceLoading = false;
  const dailyLoading = false;
  const businessSummaryLoading = false;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Bar & Pie data
  const transactionChartData: BarChartData = {
    id: "daily-transactions",
    labels:
      dailySummary?.transactionSummaryList?.map((item) =>
        formatPersianDate(item.date)
      ) || [],
    datasets: [
      {
        label: "موفق",
        data:
          dailySummary?.transactionSummaryList?.map(
            (item) => item.successCount
          ) || [],
        backgroundColor: "#007467",
      },
      {
        label: "ناموفق",
        data:
          dailySummary?.transactionSummaryList?.map(
            (item) => item.failureCount
          ) || [],
        backgroundColor: "#F85D3A",
      },
    ],
    valuePrefix: "",
    valueSuffix: "",
  };

  const balanceChartData: BarChartData = {
    id: "business-balance",
    labels: businessBalance?.businessInfoList?.map((item) => item.name) || [],
    datasets: [
      {
        label: "موجودی",
        data:
          businessBalance?.businessInfoList?.map((item) => item.balance) || [],
        backgroundColor: "#3A4DF8",
      },
    ],
    valuePrefix: "",
    valueSuffix: " ریال",
  };

  const businessPieData: ChartData = {
    id: "business-summary",
    labels:
      businessSummary?.businessSummaryList?.map((item) => item.businessName) ||
      [],
    data:
      businessSummary?.businessSummaryList?.map(
        (item) => item.transactionCount
      ) || [],
    colors: ["#4A3AFF", "#E4CBFF", "#FF6B3A", "#FFD9CC", "#FFB03A", "#FFEBCC"],
  };

  return (
    <SimpleBar className="h-full" autoHide={false}>
      <div className="!p-2 sm:!p-3 md:!p-4 lg:!p-6 h-full">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <StatCard
            title="تراکنش‌های موفق روز جاری"
            value={todaySummary?.todaySuccessCount || 0}
            icon={<TbTrendingUp className="!w-5 !h-5 md:!w-6 md:!h-6" />}
            isLoading={todayLoading}
          />
          <StatCard
            title="تراکنش‌های ناموفق روز جاری"
            value={todaySummary?.todayFailedCount || 0}
            icon={<TbTrendingDown className="!w-5 !h-5 md:!w-6 md:!h-6" />}
            isLoading={todayLoading}
          />
          <StatCard
            title="مبلغ تراکنش‌های موفق روز جاری"
            value={`${(
              todaySummary?.todaySuccessAmount || 0
            ).toLocaleString()} ریال`}
            icon={<TbCreditCard className="!w-5 !h-5 md:!w-6 md:!h-6" />}
            isLoading={todayLoading}
          />
          <StatCard
            title="موجودی کل کسب‌وکارها"
            value={`${(totalBalance?.balance || 0).toLocaleString()} ریال`}
            icon={<TbMoneybag className="!w-5 !h-5 md:!w-6 md:!h-6" />}
            isLoading={balanceLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <BarChart
            data={transactionChartData}
            title="تعداد تراکنش‌های موفق و ناموفق (۷ روز اخیر)"
            isLoading={dailyLoading}
            fontSize={isMobile ? 8 : 10}
            height={isMobile ? 280 : 320}
          />

          <PieChart
            data={businessPieData}
            title="تعداد تراکنش هر کسب و کار"
            isLoading={businessSummaryLoading}
            fontSize={isMobile ? 7 : 9}
            height={isMobile ? 280 : 320}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <BarChart
            data={balanceChartData}
            title="موجودی تمام کسب‌وکارها"
            isLoading={businesBalanceLoading}
            fontSize={isMobile ? 8 : 10}
            height={isMobile ? 280 : 320}
          />
        </div>
      </div>
    </SimpleBar>
  );
}
