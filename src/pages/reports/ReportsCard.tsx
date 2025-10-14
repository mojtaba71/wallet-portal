import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import DatePicker from "@/components/kits/date-picker/DatePicker";
import InputNumber from "@/components/kits/number-input/NumberInput";
import { ResultType } from "@/models/enum/enum";
import {
  FunctionCodeType,
  TerminalType,
  type GetTransactionCardResponse,
} from "@/models/reports.model";
import { useTransactionCard } from "@/services/hook/reportsService.hook";
import { convertToJalaliString } from "@/utils/dateConfig";
import { getTransactionStatusText } from "@/utils/utils";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { Button, Card, Form, Spin, Tag } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdCreditCard,
  MdReceipt,
  MdStore,
} from "react-icons/md";
import SimpleBar from "simplebar-react";

interface SearchTransactionFrom {
  pan?: number;
  startDate?: any;
  endDate?: any;
}

const ReportsCardView: React.FC = () => {
  const [form] = Form.useForm<SearchTransactionFrom>();
  const [isMobile, setIsMobile] = useState(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { mutate: mutateTransactionCard, isLoading } = useTransactionCard();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [mobileTransactions, setMobileTransactions] = useState<any[]>([]);
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

  const loadMobileTransactions = useCallback(
    (offset: number = 0, append: boolean = false) => {
      if (mobileLoading) return;

      setMobileLoading(true);
      const { startDate, endDate, pan } = form.getFieldsValue();

      mutateTransactionCard(
        {
          offset,
          count: 10,
          startDate: convertToJalaliString(startDate),
          endDate: convertToJalaliString(endDate),
          pan: pan ? +pan : undefined,
        },
        {
          onSuccess: (res: GetTransactionCardResponse) => {
            if (res.resultCode === ResultType.Success) {
              if (append) {
                setMobileTransactions((prev) => [
                  ...prev,
                  ...res.cardTransactionList,
                ]);
              } else {
                setMobileTransactions(res.cardTransactionList);
              }
              setMobileHasMore(res.cardTransactionList.length === 10);
              setMobileOffset(offset + res.cardTransactionList.length);
            }
          },
          onError: () => {
            if (append) {
              setMobileTransactions((prev) => prev);
            } else {
              setMobileTransactions([]);
            }
          },
          onSettled: () => {
            setMobileLoading(false);
          },
        }
      );
    },
    [mutateTransactionCard, form]
  );

  useEffect(() => {
    if (
      hasSearched &&
      mobileObserverRef.current &&
      mobileHasMore &&
      !mobileLoading
    ) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && mobileHasMore) {
            loadMobileTransactions(mobileOffset, true);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(mobileObserverRef.current);
      return () => observer.disconnect();
    }
  }, [
    hasSearched,
    mobileObserverRef,
    mobileHasMore,
    mobileLoading,
    mobileOffset,
    loadMobileTransactions,
  ]);

  const fetchAllTransactions = useCallback(() => {
    if (isLoading) return;

    const { startDate, endDate, pan } = form.getFieldsValue();

    mutateTransactionCard(
      {
        offset: 0,
        count: 999,
        startDate: convertToJalaliString(startDate),
        endDate: convertToJalaliString(endDate),
        pan: pan ? +pan : undefined,
      },
      {
        onSuccess: (res: GetTransactionCardResponse) => {
          if (res.resultCode === ResultType.Success) {
            setAllTransactions(res.cardTransactionList);
          }
        },
        onError: () => {
          setAllTransactions([]);
        },
      }
    );
  }, [mutateTransactionCard, form, isLoading]);

  const onFinish = () => {
    if (isMobile) {
      setHasSearched(true);
      setMobileOffset(0);
      loadMobileTransactions(0, false);
    } else {
      fetchAllTransactions();
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
      headerName: "شماره کارت",
      field: "pan",
      width: 200,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
      filter: "agNumberColumnFilter",
    },
    {
      field: "transactionDateTime",
      headerName: "تاریخ تراکنش",
      cellRenderer: (params: ICellRendererParams) => <bdi>{params.value}</bdi>,
      width: 200,
      filter: "agDateColumnFilter",
    },
    {
      field: "functionCode",
      headerName: "نوع تراکنش",
      flex: 1,
      valueFormatter: (p) => FunctionCodeType[p.value],
      filter: "agSetColumnFilter",
      filterParams: {
        values: Object.keys(FunctionCodeType).map((key) => parseInt(key)),
        valueFormatter: (params: any) =>
          FunctionCodeType[params.value] || params.value,
      },
    },
    {
      field: "rrn",
      headerName: "شماره مرجع",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "stan",
      headerName: "شماره پیگیری",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "amount",
      headerName: "مبلغ",
      flex: 1,
      valueFormatter: (p) => p.value?.toLocaleString(),
      filter: "agNumberColumnFilter",
    },
    {
      field: "acquiringInstitute",
      headerName: "کد موسسه پذیرنده",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "receivingBusiness",
      headerName: "شناسه کسب‌وکار",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "destinationPan",
      headerName: "شماره کارت مقصد",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "merchantId",
      headerName: "کد پذیرنده",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "merchantName",
      headerName: "نام پذیرنده",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      field: "mcc",
      headerName: "کد صنف",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "terminalId",
      headerName: "کد پایانه",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "terminalType",
      headerName: "نوع پایانه",
      flex: 1,
      valueFormatter: (p) => TerminalType[p.value],
      filter: "agSetColumnFilter",
      filterParams: {
        values: Object.keys(TerminalType).map((key) => parseInt(key)),
        valueFormatter: (params: any) =>
          TerminalType[params.value] || params.value,
      },
    },
    {
      field: "status",
      headerName: "وضعیت",
      flex: 1,
      cellRenderer: (params: any) => {
        const status = params.value;
        const statusText = getTransactionStatusText(status);
        const isComplete = status >= 10 && status <= 19;

        return (
          <span
            className={
              isComplete
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {statusText}
          </span>
        );
      },
      filter: "agSetColumnFilter",
      filterParams: {
        values: [0, 10, 20],
        valueFormatter: (params: any) => {
          const statusMap: { [key: number]: string } = {
            0: "ناقص",
            10: "کامل",
            20: "برگشت خورده",
          };
          return statusMap[params.value] || params.value;
        },
      },
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const renderMobileTransaction = (transaction: any, index: number) => (
    <Card
      key={index}
      className="!mb-4 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !border-0 !rounded-xl !overflow-hidden !bg-white dark:!bg-gray-900 dark:!bg-gray-800"
      styles={{ body: { padding: "16px" } }}
    >
      <div className="!flex !flex-col !gap-3">
        <div className="!flex !items-center !justify-between">
          <div className="!flex !items-center !gap-2">
            <span className="!text-gray-600 dark:!text-gray-400 !text-sm">
              ردیف {index + 1}
            </span>
            <MdCreditCard className="!text-blue-500 !text-xl" />
            <span className="!text-sm !text-gray-500 dark:!text-gray-400 ">
              تراکنش کارت
            </span>
          </div>
          <Tag
            color={
              transaction.status >= 10 && transaction.status <= 19
                ? "green"
                : "red"
            }
            className="!text-xs"
          >
            {getTransactionStatusText(transaction.status)}
          </Tag>
        </div>

        <div className="!text-lg !font-bold !text-gray-800 dark:!text-gray-200  !text-center !py-2 !bg-gray-50  dark:!bg-gray-800 !rounded-lg">
          {transaction.amount?.toLocaleString()} ریال
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdCreditCard className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                شماره کارت
              </div>
              <div className="!text-sm !font-medium">{transaction.pan}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdCalendarToday className="!text-orange-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                تاریخ تراکنش
              </div>
              <div className="!text-sm !font-medium">
                {transaction.transactionDateTime}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdAttachMoney className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                نوع تراکنش
              </div>
              <div className="!text-sm !font-medium">
                {FunctionCodeType[transaction.functionCode]}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-blue-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                نوع پایانه
              </div>
              <div className="!text-sm !font-medium">
                {TerminalType[transaction.terminalType]}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdReceipt className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                شماره مرجع
              </div>
              <div className="!text-sm !font-medium">{transaction.rrn}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdReceipt className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                شماره پیگیری
              </div>
              <div className="!text-sm !font-medium">{transaction.stan}</div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-indigo-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                کد موسسه پذیرنده
              </div>
              <div className="!text-sm !font-medium">
                {transaction.acquiringInstitute}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-indigo-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                شناسه کسب‌وکار
              </div>
              <div className="!text-sm !font-medium">
                {transaction.receivingBusiness}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdCreditCard className="!text-blue-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                شماره کارت مقصد
              </div>
              <div className="!text-sm !font-medium">
                {transaction.destinationPan || "-"}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                کد پذیرنده
              </div>
              <div className="!text-sm !font-medium">
                {transaction.merchantId}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-orange-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                نام پذیرنده
              </div>
              <div className="!text-sm !font-medium">
                {transaction.merchantName}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-red-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                کد صنف
              </div>
              <div className="!text-sm !font-medium">{transaction.mcc}</div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdStore className="!text-teal-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                کد پایانه
              </div>
              <div className="!text-sm !font-medium">
                {transaction.terminalId}
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
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Form.Item
              name="pan"
              label={<span className="dark:text-gray-50">شماره کارت</span>}
              className="!mb-0"
              rules={[
                { required: true, message: "لطفاً شماره کارت را وارد کنید" },
              ]}
            >
              <InputNumber className="!w-full dir-ltr" />
            </Form.Item>

            <Form.Item
              name="startDate"
              label={<span className="dark:text-gray-50">از تاریخ</span>}
              className="!mb-0"
              rules={[
                { required: true, message: "لطفاً از تاریخ را وارد کنید" },
              ]}
            >
              <DatePicker className="!w-full" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label={<span className="dark:text-gray-50">تا تاریخ</span>}
              className="!mb-0"
              rules={[
                { required: true, message: "لطفاً تا تاریخ را وارد کنید" },
              ]}
            >
              <DatePicker className="!w-full" />
            </Form.Item>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 justify-end">
            <Button
              type="default"
              onClick={() => form.resetFields()}
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
                fileName={`card-report-${new Date()
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
            <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900 dark:!bg-gray-900 !border-dashed !border-2 !border-gray-300 dark:!border-gray-250">
              <div className="!text-gray-500 dark:!text-gray-400 dark:!text-gray-400 !text-lg !mb-2">
                📋 موردی برای نمایش وجود ندارد
              </div>
              <div className="!text-gray-400 !text-sm">
                لطفاً ابتدا جستجو انجام دهید
              </div>
            </Card>
          ) : mobileTransactions.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              {mobileTransactions.map(renderMobileTransaction)}
              {mobileHasMore && (
                <div ref={mobileObserverRef} className="!text-center !py-4">
                  <Spin size="large" />
                  <div className="!text-sm !text-gray-500 dark:!text-gray-400 dark:!text-gray-400 !mt-2">
                    در حال دریافت اطلاعات...
                  </div>
                </div>
              )}
            </SimpleBar>
          ) : (
            !mobileLoading && (
              <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900 dark:!bg-gray-900">
                <div className="!text-gray-500 dark:!text-gray-400 dark:!text-gray-400">
                  هیچ تراکنشی یافت نشد
                </div>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] md:h-[calc(100vh-320px)] mt-6">
          <AgGridClientComponent
            className="ag-theme-balham w-full h-full"
            columnDefs={columnDefs}
            rowData={allTransactions}
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

export default ReportsCardView;
