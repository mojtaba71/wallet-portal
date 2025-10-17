import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import {
  type BulkCustomerData,
  PersonTypeLabels,
  GenderLabels,
} from "@/models/customer.model";
import { useRegisterCustomer } from "@/services/hook/customerService.hook";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button, Card, Upload, message, Tag } from "antd";
import React, { useState } from "react";
import {
  MdUpload,
  MdDownload,
  MdCheckCircle,
  MdError,
  MdAccessTime,
  MdDelete,
  MdFileDownload,
} from "react-icons/md";
import * as XLSX from "xlsx";

const BulkCustomerRegistrationView: React.FC = () => {
  const [customers, setCustomers] = useState<BulkCustomerData[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [gridApi, setGridApi] = useState<any>(null);
  const { mutate: registerCustomer } = useRegisterCustomer();

  const totalRecords = customers.length;
  const successfulRecords = customers.filter(
    (c) => c.status === "success"
  ).length;
  const failedRecords = customers.filter((c) => c.status === "error").length;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsedCustomers: BulkCustomerData[] = jsonData.map(
          (row: any, index: number) => ({
            rowIndex: index + 1,
            personType: row["نوع مشتری"] || "REAL",
            personId: row["کد مشخصه مشتری"] || 0,
            name: row["نام"] || "",
            lastName: row["نام خانوادگی"] || "",
            fatherName: row["نام پدر"] || "",
            gender: row["جنسیت"] || "MALE",
            mobile: row["موبایل"] || 0,
            email: row["ایمیل"] || "",
            status: "idle" as const,
          })
        );

        setCustomers(parsedCustomers);
        setUploadedFileName(file.name);
        message.success("فایل با موفقیت بارگذاری شد");
      } catch (error) {
        message.error("خطا در خواندن فایل اکسل");
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        "نوع مشتری": "حقیقی",
        "کد مشخصه مشتری": 1234567891,
        نام: "علی",
        "نام خانوادگی": "محمدی",
        "نام پدر": "امیر",
        جنسیت: "مرد",
        موبایل: 989121122233,
        ایمیل: "ali.mohammadi@example.com",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "مشتریان");
    XLSX.writeFile(wb, "نمونه_فایل_مشتریان.xlsx");
  };

  const handleRegisterAll = async () => {
    if (customers.length === 0) {
      message.warning("لطفاً ابتدا فایل را بارگذاری کنید");
      return;
    }

    setIsProcessing(true);

    for (let i = 0; i < customers.length; i += 10) {
      const batch = customers.slice(i, i + 10);

      for (const customer of batch) {
        registerCustomer(
          {
            personType: customer.personType,
            personId: customer.personId,
            name: customer.name,
            lastName: customer.lastName,
            fatherName: customer.fatherName,
            gender: customer.gender,
            mobile: customer.mobile,
            email: customer.email,
          },
          {
            onSuccess: () => {
              setCustomers((prev) =>
                prev.map((c) =>
                  c.rowIndex === customer.rowIndex
                    ? { ...c, status: "success" as const }
                    : c
                )
              );
            },
            onError: (error: any) => {
              setCustomers((prev) =>
                prev.map((c) =>
                  c.rowIndex === customer.rowIndex
                    ? {
                        ...c,
                        status: "error" as const,
                        errorMessage: error.message,
                      }
                    : c
                )
              );
            },
          }
        );
      }
    }

    setIsProcessing(false);
    message.success("ثبت اطلاعات با موفقیت انجام شد");
  };

  const handleExportExcel = () => {
    if (!gridApi) return;

    const params = {
      fileName: `bulk_customers_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")}.xlsx`,
    };

    gridApi.exportDataAsExcel(params);
  };

  const handleRemoveFile = () => {
    setCustomers([]);
    setUploadedFileName("");
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "ردیف",
      field: "rowIndex",
      width: 80,
      sortable: false,
      filter: false,
    },
    {
      headerName: "نوع مشتری",
      field: "personType",
      width: 120,
      cellRenderer: (params: ICellRendererParams) => (
        <Tag
          color={
            params.value === "REAL"
              ? "blue"
              : params.value === "LEGAL"
              ? "green"
              : "orange"
          }
        >
          {PersonTypeLabels[params.value] || params.value}
        </Tag>
      ),
    },
    {
      headerName: "کد مشخصه مشتری",
      field: "personId",
      width: 150,
    },
    {
      headerName: "نام",
      field: "name",
      width: 120,
    },
    {
      headerName: "نام خانوادگی",
      field: "lastName",
      width: 150,
    },
    {
      headerName: "نام پدر",
      field: "fatherName",
      width: 120,
    },
    {
      headerName: "جنسیت",
      field: "gender",
      width: 100,
      cellRenderer: (params: ICellRendererParams) => (
        <span>{params.value ? GenderLabels[params.value] : "-"}</span>
      ),
    },
    {
      headerName: "موبایل",
      field: "mobile",
      width: 120,
    },
    {
      headerName: "ایمیل",
      field: "email",
      width: 180,
    },
    {
      headerName: "وضعیت ثبت",
      field: "status",
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        const status = params.value;
        if (status === "success") {
          return (
            <Tag color="success" icon={<MdCheckCircle />}>
              موفق
            </Tag>
          );
        } else if (status === "error") {
          return (
            <Tag color="error" icon={<MdError />}>
              ناموفق
            </Tag>
          );
        } else {
          return (
            <Tag color="warning" icon={<MdAccessTime />}>
              در انتظار تایید
            </Tag>
          );
        }
      },
    },
  ];

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-400 mb-6">
        <div className="mb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                لطفا فایل خود را مطابق نمونه اکسل بارگذاری کنید.
              </p>

              {uploadedFileName && (
                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 mb-2">
                  <span>{uploadedFileName}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<MdDelete className="!text-red-500" />}
                    onClick={handleRemoveFile}
                    className="!text-red-500 hover:!text-red-600 !p-0 !h-auto"
                  />
                </div>
              )}
            </div>

            <div className="!flex !gap-3">
              <Button
                type="default"
                icon={<MdDownload className="!text-xl" />}
                onClick={handleDownloadSample}
                className="!border-green-500 !text-green-500 hover:!bg-green-50"
              >
                دریافت نمونه فایل اکسل
              </Button>
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept=".xlsx,.xls"
              >
                <Button
                  type="primary"
                  icon={<MdUpload className="!text-xl" />}
                  className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
                >
                  آپلود فایل
                </Button>
              </Upload>
            </div>
          </div>
        </div>
      </div>

      {customers.length > 0 && (
        <>
          <h2 className="!text-lg !font-bold !text-gray-900 dark:!text-gray-50 !mb-4">
            گزارش کلی پردازش
          </h2>
          <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4 !mb-6">
            <Card className="!bg-white dark:!bg-gray-700 !border-none">
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-2">
                  <div className="!w-12 !h-12 !bg-green-100 !rounded-full !flex !items-center !justify-center">
                    <MdCheckCircle className="!text-white !text-2xl" />
                  </div>
                  <div className="!text-sm !text-gray-600 dark:!text-gray-400">
                    کل رکوردها
                  </div>
                </div>
                <div className="!text-2xl !font-bold !text-gray-900 dark:!text-gray-50">
                  {totalRecords}
                </div>
              </div>
            </Card>

            <Card className="!bg-white dark:!bg-gray-700 !border-none">
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-2">
                  <div className="!w-12 !h-12 !bg-green-100 !rounded-full !flex !items-center !justify-center">
                    <MdCheckCircle className="!text-white !text-2xl" />
                  </div>
                  <div className="!text-sm !text-gray-600 dark:!text-gray-400">
                    ثبت موفق
                  </div>
                </div>
                <div className="!text-2xl !font-bold !text-gray-900 dark:!text-gray-50">
                  {successfulRecords}
                </div>
              </div>
            </Card>

            <Card className="!bg-white dark:!bg-gray-700 !border-none">
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-2">
                  <div className="!w-12 !h-12 !bg-green-100 !rounded-full !flex !items-center !justify-center">
                    <MdCheckCircle className="!text-white !text-2xl" />
                  </div>
                  <div className="!text-sm !text-gray-600 dark:!text-gray-400">
                    ثبت ناموفق
                  </div>
                </div>
                <div className="!text-2xl !font-bold !text-gray-900 dark:!text-gray-50">
                  {failedRecords}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {customers.length > 0 && (
        <>
          <div className="h-[calc(100vh-400px)] mb-6">
            <AgGridClientComponent
              className="ag-theme-balham !w-full !h-full"
              columnDefs={columnDefs}
              rowData={customers}
              loading={isProcessing}
              pagination
              paginationPageSize={50}
              onGridReady={(params) => {
                setGridApi(params.api);
              }}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="default"
              icon={<MdFileDownload className="!text-xl" />}
              onClick={handleExportExcel}
              disabled={!gridApi || customers.length === 0}
              className="!border-green-500 !text-green-500 hover:!bg-green-50"
            >
              دریافت خروجی اکسل
            </Button>
            <Button
              type="primary"
              icon={<MdCheckCircle className="!text-xl" />}
              onClick={handleRegisterAll}
              loading={isProcessing}
              className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
            >
              ثبت اطلاعات
            </Button>
          </div>
        </>
      )}

      {customers.length === 0 && (
        <Card className="!text-center !py-12 !bg-white dark:!bg-gray-900 !border-dashed !border-2 !border-gray-300 dark:!border-gray-250">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            📋 فایلی بارگذاری نشده است
          </div>
          <div className="text-gray-400 text-sm">
            لطفاً فایل اکسل را بارگذاری کنید
          </div>
        </Card>
      )}
    </div>
  );
};

export default BulkCustomerRegistrationView;
