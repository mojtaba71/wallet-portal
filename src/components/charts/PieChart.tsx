import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useTheme } from "@/hooks/useTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface ChartData {
  id: string;
  data: number[];
  labels: string[];
  colors: string[];
}

interface PieChartProps {
  data: ChartData;
  className?: string;
  width?: number | string;
  height?: number | string;
  fontSize?: number;
  title?: string;
  isLoading?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  className = "",
  fontSize = 11,
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
          <div className="animate-pulse">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 md:w-32"
                ></div>
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

  const totalValue = data.data.reduce((sum, value) => sum + value, 0);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.data,
        backgroundColor: data.colors,
        borderColor: data.colors,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: "#f3f4f6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        rtl: true,
        labels: {
          font: {
            family: "IranSans",
            size: fontSize + 3,
          },
          color: isDark ? "#f9fafb" : "#374151",
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets[0];
            return (
              chart.data.labels?.map((label: string, index: number) => {
                const formattedValue = datasets.data[index].toLocaleString('fa-IR');
                return {
                  text: `${label} (${formattedValue})`,
                  fillStyle: datasets.backgroundColor[index],
                  strokeStyle: datasets.backgroundColor[index],
                  lineWidth: 0,
                  pointStyle: "circle",
                  hidden: false,
                  index: index,
                  fontColor: isDark ? "#f9fafb" : "#374151",
                };
              }) || []
            );
          },
        },
      },
      tooltip: {
        enabled: true,
        rtl: true,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#1f2937",
        bodyColor: isDark ? "#d1d5db" : "#374151",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 12,
        titleFont: {
          family: "IranSans",
          size: 14,
        },
        bodyFont: {
          family: "IranSans",
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            const value = context.parsed;
            const percentage =
              totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0";
            const formattedValue = value.toLocaleString('fa-IR');
            const formattedPercentage = percentage.toLocaleString();
            return `${formattedValue} (${formattedPercentage}%)`;
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

      <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center">
        <div style={{ width: "100%", height: "100%" }}>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
