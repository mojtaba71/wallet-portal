import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import DatePicker from "@/components/kits/date-picker/DatePicker";
import InputNumber from "@/components/kits/number-input/NumberInput";
import Select from "@/components/kits/select-box/SelectBox";
import { ResultType, SettlementType, SettlementTypeText } from "@/models/enum/enum";
import type { GetSettlementReportResponse } from "@/models/reports.model";
import { useSettlementReport } from "@/services/hook/reportsService.hook";
import { convertToJalaliString } from "@/utils/dateConfig";
import type { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import { Button, Card, Form, Spin, Input } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";


interface SearchSettlementForm {
  fromDate?: any;
  toDate?: any;
  sourceDeposit?: string;
  destinationDeposit?: string;
  paymentRrn?: string;
  settleType?: string;
  paymentStatus?: number;
}


const SettlementReportView: React.FC = () => {
  const [form] = Form.useForm<SearchSettlementForm>();
  const [isMobile, setIsMobile] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { mutate: fetchSettlement, isLoading } = useSettlementReport();
  const [rows, setRows] = useState<any[]>([]);
  const [mobileRows, setMobileRows] = useState<any[]>([]);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileHasMore, setMobileHasMore] = useState(true);
  const [mobileOffset, setMobileOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const mobileObserverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onFinish = (values: SearchSettlementForm) => {
    setHasSearched(true);
    if (isMobile) {
      setMobileRows([]);
      setMobileOffset(0);
      setMobileHasMore(true);
      loadMobileSettlements(values);
    } else {
      fetchSettlement(
        {
          fromDate: convertToJalaliString(values.fromDate),
          toDate: convertToJalaliString(values.toDate),
          sourceDeposit: values.sourceDeposit,
          destinationDeposit: values.destinationDeposit,
          paymentRrn: values.paymentRrn,
          settleType: values.settleType,
          paymentStatus: values.paymentStatus,
          page: 1,
          pageSize: 50,
        } as any,
        {
          onSuccess: (res: GetSettlementReportResponse) => {
            if (res.resultCode === ResultType.Success) {
              setRows(res.settlementPayments || []);
            }
          },
        }
      );
    }
  };

  const loadMobileSettlements = useCallback((values: SearchSettlementForm) => {
    setMobileLoading(true);
    fetchSettlement(
      {
        fromDate: convertToJalaliString(values.fromDate),
        toDate: convertToJalaliString(values.toDate),
        sourceDeposit: values.sourceDeposit,
        destinationDeposit: values.destinationDeposit,
        paymentRrn: values.paymentRrn,
        settleType: values.settleType,
        paymentStatus: values.paymentStatus,
        page: Math.floor(mobileOffset / 20) + 1,
        pageSize: 20,
      } as any,
      {
        onSuccess: (res: GetSettlementReportResponse) => {
          if (res.resultCode === ResultType.Success) {
            const newRows = res.settlementPayments || [];
            if (mobileOffset === 0) {
              setMobileRows(newRows);
            } else {
              setMobileRows(prev => [...prev, ...newRows]);
            }
            setMobileHasMore(newRows.length === 20);
            setMobileOffset(prev => prev + newRows.length);
          }
          setMobileLoading(false);
        },
        onError: () => {
          setMobileLoading(false);
        }
      }
    );
  }, [mobileOffset, fetchSettlement]);

  const clearFilters = () => {
    form.resetFields();
    setHasSearched(false);
    if (isMobile) {
      setMobileRows([]);
      setMobileOffset(0);
      setMobileHasMore(true);
    } else {
      setRows([]);
      gridApi?.setFilterModel(null);
    }
  };

  const renderMobileSettlement = (settlement: any, index: number) => (
    <Card key={`${settlement.trackerId}-${index}`} className="!mb-4 !bg-white dark:!bg-gray-800">
      <div className="!space-y-3">
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">ردیف:</span>
          <span className="!font-medium">{index + 1}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">شناسه تسویه:</span>
          <span className="!font-medium">{settlement.trackerId}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">تاریخ ورود اطلاعات:</span>
          <span className="!font-medium">{settlement.insertDT}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">شناسه تکمیل تسویه:</span>
          <span className="!font-medium">{settlement.settleCycleId}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">نوع تسویه:</span>
          <span className="!font-medium">{SettlementTypeText[settlement.settleType as SettlementType] || settlement.settleType}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">حساب مبدا:</span>
          <span className="!font-medium">{settlement.sourceDeposit}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">شناسه مالک حساب مبدا:</span>
          <span className="!font-medium">{settlement.sourceOwnerId}</span>
        </div>
        <div className="!flex !justify-between !items-center">
          <span className="!text-sm !text-gray-600 dark:!text-gray-400">نوع مالک حساب مبدا:</span>
          <span className="!font-medium">{settlement.sourceOwnerType}</span>
        </div>
      </div>
    </Card>
  );

  const columnDefs: ColDef[] = [
    { headerName: "تعداد", field: "rowIndex", width: 90, valueGetter: (p) => (p.node?.rowIndex || 0) + 1, sortable: false, filter: false },
    { headerName: "شناسه تسویه", field: "trackerId", filter: "agNumberColumnFilter", width: 140 },
    { headerName: "تاریخ ورود اطلاعات", field: "insertDT", filter: "agDateColumnFilter", width: 160, cellRenderer: (p: ICellRendererParams) => <bdi>{p.value}</bdi> },
    { headerName: "شناسه سیکل تسویه", field: "settleCycleId", filter: "agTextColumnFilter", width: 160 },
    { headerName: "نوع تسویه", field: "settleType", filter: "agSetColumnFilter", width: 140, 
      valueFormatter: (p) => (SettlementTypeText[p.value as SettlementType] || p.value) as string },
    { headerName: "حساب مبدا", field: "sourceDeposit", filter: "agTextColumnFilter", width: 160, cellRenderer: (p: ICellRendererParams) => <span className="dir-ltr"><bdi>{p.value}</bdi></span> },
    { headerName: "مبلغ", field: "amount", filter: "agNumberColumnFilter", width: 140, 
      valueFormatter: (p) => Number(p.value ?? 0).toLocaleString(),
      cellRenderer: (p: ICellRendererParams) => <span>{Number(p.value ?? 0).toLocaleString()}</span> },
    { headerName: "شناسه مالک حساب مبدا", field: "sourceOwnerId", filter: "agTextColumnFilter", width: 180 },
    { headerName: "نوع مالک حساب مبدا", field: "sourceOwnerType", filter: "agTextColumnFilter", width: 170 },
    { headerName: "شماره مشتری حساب مبدا", field: "sourceCif", filter: "agTextColumnFilter", width: 180 },
    { headerName: "شماره حساب مقصد", field: "destinationDeposit", filter: "agTextColumnFilter", width: 170, cellRenderer: (p: ICellRendererParams) => <span className="dir-ltr"><bdi>{p.value}</bdi></span> },
    { headerName: "شناسه مالک حساب مقصد", field: "destinationOwnerId", filter: "agTextColumnFilter", width: 180 },
    { headerName: "نوع مالک حساب مقصد", field: "destinationOwnerType", filter: "agTextColumnFilter", width: 180 },
    { headerName: "وضعیت پرداخت", field: "paymentStatusDescription", filter: "agTextColumnFilter", width: 160 },
    { headerName: "شماره مرجع پرداخت", field: "paymentRrn", filter: "agTextColumnFilter", width: 170, cellRenderer: (p: ICellRendererParams) => <span className="dir-ltr"><bdi>{p.value}</bdi></span> },
    { headerName: "تاریخ پرداخت", field: "paymentDT", filter: "agDateColumnFilter", width: 160, cellRenderer: (p: ICellRendererParams) => <bdi>{p.value}</bdi> },
    { headerName: "نوع پرداخت", field: "paymentType", filter: "agTextColumnFilter", width: 140 },
    { headerName: "تعداد تلاش برای پرداخت", field: "tryCounter", filter: "agNumberColumnFilter", width: 190 },
    { headerName: "تاریخ آخرین به‌روزرسانی", field: "updateDT", filter: "agDateColumnFilter", width: 180, cellRenderer: (p: ICellRendererParams) => <bdi>{p.value}</bdi> },
  ];

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-400">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Form.Item label="از تاریخ" name="fromDate" rules={[{ required: true, message: "لطفاً از تاریخ را وارد کنید" }]}>
              <DatePicker className="!w-full" />
            </Form.Item>
            <Form.Item label="تا تاریخ" name="toDate" rules={[{ required: true, message: "لطفاً تا تاریخ را وارد کنید" }]}>
              <DatePicker className="!w-full" />
            </Form.Item>
            
            <Form.Item label="حساب مبدا" name="sourceDeposit">
              <Input className="!w-full dir-ltr" />
            </Form.Item>
            <Form.Item label="حساب مقصد" name="destinationDeposit">
              <Input className="!w-full dir-ltr" />
            </Form.Item>
            <Form.Item label="شماره مرجع پرداخت" name="paymentRrn">
              <InputNumber className="!w-full dir-ltr" />
            </Form.Item>
            <Form.Item label="نوع تسویه" name="settleType">
              <Select
                options={[
                  { value: SettlementType.WAGE_SETTLE, label: SettlementTypeText[SettlementType.WAGE_SETTLE] },
                  { value: SettlementType.TRANSFER_SETTLE, label: SettlementTypeText[SettlementType.TRANSFER_SETTLE] },
                  { value: SettlementType.FINANCIAL_SETTLE, label: SettlementTypeText[SettlementType.FINANCIAL_SETTLE] },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button htmlType="submit" className="!bg-blue-500 hover:!bg-blue-600 !text-white">جستجو</Button>
            <Button onClick={clearFilters} className="!px-6 !bg-white !border-blue-500 !text-blue-500 hover:!bg-blue-50">حذف فیلتر</Button>
            {!isMobile && (
              <ExportButton
                gridApi={gridApi || undefined}
                fileName={`settlement-report-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`}
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
          ) : mobileRows.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              {mobileRows.map(renderMobileSettlement)}
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
                <div className="!text-gray-500 dark:!text-gray-400">هیچ تسویه‌ای یافت نشد</div>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] mt-6">
          <AgGridClientComponent
            className="ag-theme-balham w-full h-full"
            columnDefs={columnDefs}
            rowData={rows}
            loading={isLoading}
            pagination
            paginationPageSize={50}
            onGridReady={(params) => onGridReady(params)}
          />
        </div>
      )}
    </div>
  );
};

export default SettlementReportView;












