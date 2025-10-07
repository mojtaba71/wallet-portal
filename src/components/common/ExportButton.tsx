import React from "react";
import { Button } from "antd";
import { MdFileDownload } from "react-icons/md";

interface ExportButtonProps {
  gridApi?: {
    exportDataAsExcel: (options: {
      fileName: string;
      sheetName: string;
      exportMode: string;
    }) => void;
  };
  fileName?: string;
  sheetName?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  tooltip?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  gridApi,
  fileName = "export",
  sheetName = "Sheet1",
  disabled = false,
  loading = false,
  className = "",
  tooltip = "خروجی Excel",
}) => {
  const exportToExcel = () => {
    try {
      if (!gridApi) {
        console.warn("Grid API not available");
        return;
      }

      // Use AG Grid's built-in Excel export
      gridApi.exportDataAsExcel({
        fileName: `${fileName}.xlsx`,
        sheetName: sheetName,
        exportMode: "xlsx",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <Button
      type="primary"
      icon={<MdFileDownload />}
      onClick={exportToExcel}
      disabled={disabled || !gridApi}
      loading={loading}
      className={`!bg-green-600 hover:!bg-green-700 !border-green-600 hover:!border-green-700 !text-white ${className}`}
      title={tooltip}
    >
      خروجی Excel
    </Button>
  );
};

export default ExportButton;
