import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import DatePicker from "@/components/kits/date-picker/DatePicker";
import InputNumber from "@/components/kits/number-input/NumberInput";
import { ResultType, CardEventTypeText } from "@/models/enum/enum";
import type { GetCardEventsResponse } from "@/models/reports.model";
import { useCardEvents } from "@/services/hook/reportsService.hook";
import { convertToJalaliString } from "@/utils/dateConfig";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { Button, Card, Form, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdCreditCard, MdHistory, MdSwapHoriz, MdInfo } from "react-icons/md";
import SimpleBar from "simplebar-react";


interface SearchCardEventsForm {
  pan?: number;
  startDate?: any;
  endDate?: any;
}

const CardEventsReportView: React.FC = () => {
  const [form] = Form.useForm<SearchCardEventsForm>();
  const [isMobile, setIsMobile] = useState(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { mutate: mutateCardEvents, isLoading } = useCardEvents();
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [mobileEvents, setMobileEvents] = useState<any[]>([]);
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

  const loadMobileEvents = useCallback(
    (offset: number = 0, append: boolean = false) => {
      if (mobileLoading) return;

      setMobileLoading(true);
      const { startDate, endDate, pan } = form.getFieldsValue();

      mutateCardEvents(
        {
          offset,
          count: 999,
          startDate: convertToJalaliString(startDate),
          endDate: convertToJalaliString(endDate),
          pan: pan ? +pan : undefined,
        },
        {
          onSuccess: (res: GetCardEventsResponse) => {
            if (res.resultCode === ResultType.Success) {
              if (append) {
                setMobileEvents((prev) => [...prev, ...res.cardEventList]);
              } else {
                setMobileEvents(res.cardEventList);
              }
              setMobileHasMore(res.cardEventList.length === 1000);
              setMobileOffset(offset + res.cardEventList.length);
            }
          },
          onError: () => {
            if (append) {
              setMobileEvents((prev) => prev);
            } else {
              setMobileEvents([]);
            }
            setMobileHasMore(false);
          },
          onSettled: () => {
            setMobileLoading(false);
          },
        }
      );
    },
    [mobileLoading, form, mutateCardEvents]
  );

  useEffect(() => {
    if (hasSearched && isMobile) {
      loadMobileEvents();
    }
  }, [hasSearched, isMobile, loadMobileEvents]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && mobileHasMore && !mobileLoading) {
          loadMobileEvents(mobileOffset, true);
        }
      },
      { threshold: 0.1 }
    );

    if (mobileObserverRef.current) {
      observer.observe(mobileObserverRef.current);
    }

    return () => observer.disconnect();
  }, [mobileHasMore, mobileLoading, mobileOffset, loadMobileEvents]);

  const fetchAllEvents = useCallback(() => {
    if (isLoading) return;

    const { startDate, endDate, pan } = form.getFieldsValue();

    mutateCardEvents(
      {
        offset: 0,
        count: 1000,
        startDate: convertToJalaliString(startDate),
        endDate: convertToJalaliString(endDate),
        pan: pan ? +pan : undefined,
      },
      {
        onSuccess: (res: GetCardEventsResponse) => {
          if (res.resultCode === ResultType.Success) {
            setAllEvents(res.cardEventList);
          }
        },
        onError: () => {
          setAllEvents([]);
        },
      }
    );
  }, [mutateCardEvents, form, isLoading]);

  const onFinish = () => {
    if (isMobile) {
      setHasSearched(true);
      setMobileOffset(0);
      setMobileHasMore(true);
      loadMobileEvents();
    } else {
      fetchAllEvents();
    }
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const clearFilters = () => {
    form.resetFields();
    setHasSearched(false);
    if (isMobile) {
      setMobileEvents([]);
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
      headerName: "تاریخ و زمان",
      field: "insertDateTime",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => <bdi>{params.value}</bdi>,
      filter: "agDateColumnFilter",
    },
    {
      headerName: "نوع رخداد",
      field: "cardEventType",
      width: 150,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2">
          <MdCreditCard className="text-green-500" />
          <span>
            {CardEventTypeText[
              params.value as keyof typeof CardEventTypeText
            ] || params.value}
          </span>
        </div>
      ),
      filter: "agSetColumnFilter",
      filterParams: {
        values: Object.keys(CardEventTypeText),
        valueFormatter: (params: any) =>
          CardEventTypeText[params.value as keyof typeof CardEventTypeText] ||
          params.value,
      },
    },
    {
      headerName: "مقدار قبلی",
      field: "lastValue",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <span className={params.value === "null" ? "text-gray-400" : ""}>
          {params.value === "null" ? "-" : params.value}
        </span>
      ),
      filter: "agTextColumnFilter",
    },
    {
      headerName: "مقدار فعلی",
      field: "currentValue",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <span className={params.value === "null" ? "text-gray-400" : ""}>
          {params.value === "null" ? "-" : params.value}
        </span>
      ),
      filter: "agTextColumnFilter",
    },
    {
      headerName: "توضیحات",
      field: "description",
      flex: 1,
      filter: "agTextColumnFilter",
    },
  ];

  const renderMobileCard = (event: any, index: number) => (
    <Card
      key={index}
      className="!mb-4 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !border-0 !rounded-xl !overflow-hidden !bg-white dark:!bg-gray-800"
      styles={{ body: { padding: "16px" } }}
    >
      <div className="!flex !flex-col !gap-3">
        <div className="!flex !items-center !justify-between">
          <div className="!flex !items-center !gap-2">
            <span className="!text-gray-600 dark:!text-gray-400 !text-sm">
              ردیف {index + 1}
            </span>
            <MdCreditCard className="!text-green-500 !text-xl" />
            <span className="!text-sm !text-gray-500 dark:!text-gray-400">
              رخداد کارت
            </span>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdCreditCard className="!text-orange-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                تاریخ و زمان
              </div>
              <div className="!text-sm !font-medium">
                {event.insertDateTime}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdCreditCard className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                نوع رخداد
              </div>
              <div className="!text-sm !font-medium">
                {CardEventTypeText[
                  event.cardEventType as keyof typeof CardEventTypeText
                ] || event.cardEventType}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdHistory className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400 ">
                مقدار قبلی
              </div>
              <div className="!text-sm !font-medium">
                {event.lastValue === "null" ? "-" : event.lastValue}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdSwapHoriz className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                مقدار فعلی
              </div>
              <div className="!text-sm !font-medium">
                {event.currentValue === "null" ? "-" : event.currentValue}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-1 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdInfo className="!text-blue-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                توضیحات
              </div>
              <div className="!text-sm !font-medium !text-right">
                {event.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="!p-2 sm:!p-3 md:!p-4 h-full">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Form.Item
              name="pan"
              label={<span className="dark:text-gray-50">شماره کارت</span>}
              className="!mb-0"
              rules={[{ required: true, message: "لطفاً شماره کارت را وارد کنید" }]}
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
                fileName={`card-events-report-${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace(/:/g, "-")}`}
                disabled={!gridApi || isLoading}
                tooltip="دانلود گزارش Excel"
                className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
              />
            )}
          </div>
        </div>
      </Form>

      {isMobile ? (
        <div className="!space-y-4 !mt-6">
          {!hasSearched ? (
            <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900!border-dashed !border-2 !border-gray-300 dark:!border-gray-250">
              <div className="!text-gray-500 dark:!text-gray-400 !text-lg !mb-2">
                📋 موردی برای نمایش وجود ندارد
              </div>
              <div className="!text-gray-400 !text-sm">
                لطفاً ابتدا جستجو انجام دهید
              </div>
            </Card>
          ) : mobileEvents.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              {mobileEvents.map((event, index) =>
                renderMobileCard(event, index)
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
                  هیچ رخدادی یافت نشد
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
            rowData={allEvents}
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

export default CardEventsReportView;
