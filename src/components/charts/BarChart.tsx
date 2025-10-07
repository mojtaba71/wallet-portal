import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@/hooks/useTheme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BarDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface BarChartData {
  id: string;
  labels: string[];
  datasets: BarDataset[];
  yAxisLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

interface BarChartProps {
  data: BarChartData;
  className?: string;
  height?: number | string;
  fontSize?: number;
  title?: string;
  isLoading?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  className = "",
  fontSize = 12,
  title,
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 border border-gray-100 dark:border-gray-400">
        {title && (
          <h3 className="font-bold text-lg md:text-xl text-gray-200 dark:text-gray-50 mb-4 md:mb-6 text-right">
            {title}
          </h3>
        )}
        <div className="h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 md:w-48 mx-auto"></div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 md:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 border border-gray-100 dark:border-gray-400">
        {title && (
          <h3 className="font-bold text-lg md:text-xl text-gray-200 dark:text-gray-50 mb-4 md:mb-6 text-right">
            {title}
          </h3>
        )}
        <div className="h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl md:text-6xl mb-4">📊</div>
            <p className="text-base md:text-lg">
              هیچ داده‌ای برای نمایش وجود ندارد
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
      borderRadius: 6,
      maxBarThickness: 60,
    })),
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        rtl: true,
        labels: {
          font: {
            family: "IranSans",
            size: fontSize + 3,
          },
          color: isDark ? "#f9fafb" : "#374151",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 25,
        },
      },
      tooltip: {
        rtl: true,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#1f2937",
        bodyColor: isDark ? "#d1d5db" : "#374151",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          family: "IranSans",
          size: 14,
        },
        bodyFont: {
          family: "IranSans",
          size: 13,
        },
        callbacks: {
          title: (context) => {
            return `${context[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            const formattedValue = value.toLocaleString('fa-IR');
            return `${context.dataset.label}: ${
              data.valuePrefix || ""
            }${formattedValue}${data.valueSuffix || ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "IranSans",
            size: fontSize + 2,
          },
          color: isDark ? "#f9fafb" : "#4b5563",
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          display: true,
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "IranSans",
            size: fontSize + 2,
          },
          color: isDark ? "#f9fafb" : "#4b5563",
          callback: function (value) {
            if (typeof value === "number") {
              const formattedValue = value.toLocaleString('fa-IR');
              return `${data.valuePrefix || ""}${formattedValue}${
                data.valueSuffix || ""
              }`;
            }
            return value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-400 ${className}`}
    >
      {title && (
        <h3 className="font-bold text-lg md:text-xl text-gray-200 dark:text-gray-50 mb-4 md:mb-6 text-right">
          {title}
        </h3>
      )}

      <div className="h-[300px] md:h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
