import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import DatePicker from "@/components/kits/date-picker/DatePicker";
import InputNumber from "@/components/kits/number-input/NumberInput";
import { ResultType } from "@/models/enum/enum";
import type { GetBusinessDepositStatementsResponse } from "@/models/reports.model";
import { useBusinessDepositStatements } from "@/services/hook/reportsService.hook";
import { convertToJalaliString } from "@/utils/dateConfig";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { Button, Card, Form, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdBusiness,
  MdAccountBalance,
  MdCreditCard,
  MdSchedule,
  MdTrendingUp,
  MdDescription,
} from "react-icons/md";
import SimpleBar from "simplebar-react";


interface SearchBusinessDepositForm {
  businessId: string;
  startDate?: any;
  endDate?: any;
}

const BusinessDepositReportView: React.FC = () => {
  const [form] = Form.useForm<SearchBusinessDepositForm>();
  const [isMobile, setIsMobile] = useState(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { mutate: mutateBusinessDeposit, isLoading } =
    useBusinessDepositStatements();
  const [allStatements, setAllStatements] = useState<any[]>([]);
  const [mobileStatements, setMobileStatements] = useState<any[]>([]);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileHasMore, setMobileHasMore] = useState(true);
  const [mobileOffset, setMobileOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const mobileObserverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadMobileStatements = useCallback(
    (offset: number = 0, append: boolean = false) => {
      if (mobileLoading) return;

      setMobileLoading(true);
      const { startDate, endDate, businessId } = form.getFieldsValue();

      if (!businessId) {
        setMobileLoading(false);
        return;
      }

      mutateBusinessDeposit(
        {
          offset,
          count: 999,
          businessId,
          startDate: convertToJalaliString(startDate),
          endDate: convertToJalaliString(endDate),
        },
        {
          onSuccess: (res: GetBusinessDepositStatementsResponse) => {
            if (res.resultCode === ResultType.Success) {
              if (append) {
                setMobileStatements((prev) => [
                  ...prev,
                  ...res.depositStatementList,
                ]);
              } else {
                setMobileStatements(res.depositStatementList);
              }
              setMobileHasMore(res.depositStatementList.length === 10);
              setMobileOffset(offset + res.depositStatementList.length);
            }
          },
          onError: () => {
            if (append) {
              setMobileStatements((prev) => prev);
            } else {
              setMobileStatements([]);
            }
            setMobileHasMore(false);
          },
          onSettled: () => {
            setMobileLoading(false);
          },
        }
      );
    },
    [mobileLoading, form, mutateBusinessDeposit]
  );

  useEffect(() => {
    if (hasSearched && isMobile) {
      loadMobileStatements();
    }
  }, [hasSearched, isMobile, loadMobileStatements]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && mobileHasMore && !mobileLoading) {
          loadMobileStatements(mobileOffset, true);
        }
      },
      { threshold: 0.1 }
    );

    if (mobileObserverRef.current) {
      observer.observe(mobileObserverRef.current);
    }

    return () => observer.disconnect();
  }, [mobileHasMore, mobileLoading, mobileOffset, loadMobileStatements]);

  const fetchAllStatements = useCallback(() => {
    if (isLoading) return;

    const { startDate, endDate, businessId } = form.getFieldsValue();

    if (!businessId) {
      setAllStatements([]);
      return;
    }

    mutateBusinessDeposit(
      {
        offset: 0,
        count: 999,
        businessId,
        startDate: convertToJalaliString(startDate),
        endDate: convertToJalaliString(endDate),
      },
      {
        onSuccess: (res: GetBusinessDepositStatementsResponse) => {
          if (res.resultCode === ResultType.Success) {
            setAllStatements(res.depositStatementList);
          }
        },
        onError: () => {
          setAllStatements([]);
        },
      }
    );
  }, [mutateBusinessDeposit, form, isLoading]);

  const onFinish = () => {
    if (isMobile) {
      setHasSearched(true);
      setMobileOffset(0);
      setMobileHasMore(true);
      loadMobileStatements();
    } else {
      fetchAllStatements();
    }
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const clearFilters = () => {
    form.resetFields();
    setHasSearched(false);
    if (isMobile) {
      setMobileStatements([]);
      setMobileOffset(0);
      setMobileHasMore(true);
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "ردیف",
      field: "rowIndex",
      width: 80,
      valueGetter: (params) => (params.node?.rowIndex || 0) + 1,
      sortable: false,
      filter: false,
    },
    {
      headerName: "کد مشتری",
      field: "cif",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2">
          <MdBusiness className="text-blue-500" />
          <span>{params.value}</span>
        </div>
      ),
      filter: "agTextColumnFilter",
    },
    {
      headerName: "شماره حساب",
      field: "depositNumber",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "شماره مرجع واریز",
      field: "referenceId",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <span className={params.value === null ? "text-gray-400" : ""}>
          {params.value === null ? "-" : params.value}
        </span>
      ),
      filter: "agTextColumnFilter",
    },
    {
      headerName: "مبلغ",
      field: "amount",
      flex: 1,
      valueFormatter: (p) => p.value?.toLocaleString(),
      cellRenderer: (params: ICellRendererParams) => (
        <span className="font-medium text-green-600">
          {params.value?.toLocaleString()} ریال
        </span>
      ),
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "موجودی",
      field: "balance",
      flex: 1,
      valueFormatter: (p) => p.value?.toLocaleString(),
      cellRenderer: (params: ICellRendererParams) => (
        <span className="font-medium text-blue-600">
          {params.value?.toLocaleString()} ریال
        </span>
      ),
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "تاریخ واریز",
      field: "statementDateTime",
      flex: 1,
      filter: "agDateColumnFilter",
    },
    {
      headerName: "شناسه واریز",
      field: "statementId",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "توضیحات",
      field: "description",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "تاریخ دریافت اطلاعات",
      field: "insertDateTime",
      flex: 1,
      filter: "agDateColumnFilter",
    },
  ];

  const renderMobileCard = (statement: any, index: number) => (
    <Card
      key={index}
      className="!mb-4 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !border-0 !rounded-xl !overflow-hidden !bg-white dark:!bg-gray-900"
      styles={{ body: { padding: "16px" } }}
    >
      <div className="!flex !flex-col !gap-3">
        <div className="!flex !items-center !justify-between">
          <div className="!flex !items-center !gap-2">
            <span className="!text-gray-600 dark:!text-gray-400 !text-sm">
              ردیف {index + 1}
            </span>
            <MdAccountBalance className="!text-blue-500 !text-xl" />
            <span className="!text-sm !text-gray-500 dark:!text-gray-400">
              واریز به حساب کسب‌وکار
            </span>
          </div>
        </div>

        <div className="!text-lg !font-bold !text-gray-800 dark:!text-gray-200  !text-center !py-2 !bg-gray-50  dark:!bg-gray-800 !rounded-lg">
          {statement.amount?.toLocaleString('fa-IR')} ریال
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdBusiness className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                کد مشتری
              </div>
              <div className="!text-sm !font-medium">{statement.cif}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdSchedule className="!text-orange-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                تاریخ واریز
              </div>
              <div className="!text-sm !font-medium">
                {statement.statementDateTime}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdTrendingUp className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                موجودی
              </div>
              <div className="!text-sm !font-medium !text-blue-600">
                {statement.balance?.toLocaleString('fa-IR')} ریال
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdCreditCard className="!text-blue-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                شماره مرجع
              </div>
              <div className="!text-sm !font-medium">
                {statement.referenceId === null ? "-" : statement.referenceId}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-1 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdAccountBalance className="!text-indigo-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                شماره حساب
              </div>
              <div className="!text-sm !font-medium">
                {statement.depositNumber}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdDescription className="!text-teal-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                توضیحات
              </div>
              <div className="!text-sm !font-medium !text-right">
                {statement.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-400">
        <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Form.Item
              name="businessId"
              label={<span className="dark:text-gray-50">شناسه کسب و کار</span>}
              className="!mb-0"
              rules={[
                {
                  required: true,
                  message: "لطفاً شناسه کسب و کار را وارد کنید",
                },
              ]}
            >
              <InputNumber className="!w-full dir-ltr" />
            </Form.Item>

            <Form.Item
              name="startDate"
              label={<span className="dark:text-gray-50">از تاریخ</span>}
              className="!mb-0"
              rules={[{ required: true, message: "لطفاً از تاریخ را وارد کنید" }]}
            >
              <DatePicker className="!w-full" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label={<span className="dark:text-gray-50">تا تاریخ</span>}
              className="!mb-0"
              rules={[{ required: true, message: "لطفاً تا تاریخ را وارد کنید" }]}
            >
              <DatePicker className="!w-full" />
            </Form.Item>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 justify-end">
            <Button
              type="default"
              onClick={clearFilters}
              className="!px-6 !bg-white dark:!bg-gray-800 !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
            >
              حذف فیلتر
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || mobileLoading}
              className="!px-6 !bg-blue-500 hover:!bg-blue-600 !border-blue-500"
            >
              جستجو
            </Button>
            {!isMobile && (
              <ExportButton
                gridApi={gridApi || undefined}
                fileName={`business-deposit-report-${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace(/:/g, "-")}`}
                disabled={!gridApi || isLoading}
                tooltip="دانلود گزارش Excel"
                className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
              />
            )}
          </div>
      </Form>
        </div>

      {isMobile ? (
        <div className="!space-y-4 !mt-6">
          {!hasSearched ? (
            <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900 !border-dashed !border-2 !border-gray-300 dark:!border-gray-250">
              <div className="!text-gray-500 dark:!text-gray-400 !text-lg !mb-2">
                📋 موردی برای نمایش وجود ندارد
              </div>
              <div className="!text-gray-400 !text-sm">
                لطفاً ابتدا جستجو انجام دهید
              </div>
            </Card>
          ) : mobileStatements.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              {mobileStatements.map((statement, index) =>
                renderMobileCard(statement, index)
              )}
              {mobileHasMore && (
                <div ref={mobileObserverRef} className="!text-center !py-4">
                  <Spin size="large" />
                  <div className="!text-sm !text-gray-500 dark:!text-gray-400 !mt-2">
                    در حال دریافت اطلاعات...
                  </div>
                </div>
              )}
            </SimpleBar>
          ) : (
            !mobileLoading && (
              <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900">
                <div className="!text-gray-500 dark:!text-gray-400">
                  هیچ واریزی یافت نشد
                </div>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] mt-6">
          <AgGridClientComponent
            className="ag-theme-balham w-full h-full"
            columnDefs={columnDefs}
            rowData={allStatements}
            loading={isLoading}
            pagination
            paginationPageSize={50}
            onGridReady={(params) => {
              onGridReady(params);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessDepositReportView;
