import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import InputNumber from "@/components/kits/number-input/NumberInput";
import { ResultType } from "@/models/enum/enum";
import {
  type CustomerSearchResponse,
  PersonTypeLabels,
  GenderLabels,
} from "@/models/customer.model";
import { useSearchCustomer } from "@/services/hook/customerService.hook";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { Button, Card, Form, Input, Spin, Tag } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdEdit, MdDelete, MdPerson, MdMoreVert, MdAdd } from "react-icons/md";
import SimpleBar from "simplebar-react";

interface SearchCustomerForm {
  personId?: number;
  name?: string;
  lastName?: string;
}

interface CustomersViewProps {
  onAddCustomer?: () => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({ onAddCustomer }) => {
  const [form] = Form.useForm<SearchCustomerForm>();
  const [isMobile, setIsMobile] = useState(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { mutate: mutateSearchCustomer, isLoading } = useSearchCustomer();
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [mobileCustomers, setMobileCustomers] = useState<any[]>([]);
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

  const loadMobileCustomers = useCallback(
    (offset: number = 0, append: boolean = false) => {
      if (mobileLoading) return;

      setMobileLoading(true);
      const { personId, name, lastName } = form.getFieldsValue();

      mutateSearchCustomer(
        {
          offset: offset + 1,
          count: 10,
          personId: personId ? +personId : undefined,
          name,
          lastName,
        },
        {
          onSuccess: (res: CustomerSearchResponse) => {
            if (res.resultCode === ResultType.Success) {
              if (append) {
                setMobileCustomers((prev) => [...prev, ...res.personList]);
              } else {
                setMobileCustomers(res.personList);
              }
              setMobileHasMore(res.personList.length === 10);
              setMobileOffset(offset + res.personList.length);
            }
          },
          onError: () => {
            if (append) {
              setMobileCustomers((prev) => prev);
            } else {
              setMobileCustomers([]);
            }
          },
          onSettled: () => {
            setMobileLoading(false);
          },
        }
      );
    },
    [mutateSearchCustomer, form]
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
            loadMobileCustomers(mobileOffset, true);
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
    loadMobileCustomers,
  ]);

  const fetchAllCustomers = useCallback(() => {
    if (isLoading) return;

    const { personId, name, lastName } = form.getFieldsValue();

    mutateSearchCustomer(
      {
        offset: 1,
        count: 999,
        personId: personId ? +personId : undefined,
        name,
        lastName,
      },
      {
        onSuccess: (res: CustomerSearchResponse) => {
          if (res.resultCode === ResultType.Success) {
            setAllCustomers(res.personList);
          }
        },
        onError: () => {
          setAllCustomers([]);
        },
      }
    );
  }, [mutateSearchCustomer, form, isLoading]);

  const onFinish = () => {
    if (isMobile) {
      setHasSearched(true);
      setMobileOffset(0);
      loadMobileCustomers(0, false);
    } else {
      fetchAllCustomers();
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
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["REAL", "LEGAL", "FOREIGN"],
        valueFormatter: (params: any) =>
          PersonTypeLabels[params.value] || params.value,
      },
    },
    {
      headerName: "کد مشخصه مشتری",
      field: "personId",
      width: 150,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "نام",
      field: "name",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "نام خانوادگی",
      field: "lastName",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "نام پدر",
      field: "fatherName",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "نام انگلیسی",
      field: "nameEN",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "نام خانوادگی انگلیسی",
      field: "lastNameEN",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "نام پدر انگلیسی",
      field: "fatherNameEN",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "جنسیت",
      field: "gender",
      width: 100,
      cellRenderer: (params: ICellRendererParams) => (
        <span>
          {params.value ? GenderLabels[params.value] || params.value : "-"}
        </span>
      ),
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["MALE", "FEMALE"],
        valueFormatter: (params: any) =>
          GenderLabels[params.value] || params.value,
      },
    },
    {
      headerName: "موبایل",
      field: "mobile",
      width: 120,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "ایمیل",
      field: "email",
      width: 180,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "تاریخ تولد",
      field: "birthDate",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "عملیات",
      field: "actions",
      width: 100,
      cellRenderer: (_params: ICellRendererParams) => (
        <div className="flex items-center justify-center">
          <Button
            type="text"
            icon={<MdMoreVert />}
            className="!text-gray-600 hover:!text-green-500"
            onClick={() => {
              // Handle actions dropdown
            }}
          />
        </div>
      ),
      sortable: false,
      filter: false,
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const renderMobileCustomer = (customer: any, index: number) => (
    <Card
      key={index}
      className="!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-700 !mb-4 !shadow-sm"
    >
      <div className="!space-y-3">
        <div className="!flex !items-center !justify-between">
          <div className="!flex !items-center !gap-2">
            <MdPerson className="!text-green-500 !text-lg" />
            <span className="!font-medium !text-gray-900 dark:!text-gray-50">
              {customer.name} {customer.lastName}
            </span>
          </div>
          <Tag
            color={
              customer.personType === "REAL"
                ? "blue"
                : customer.personType === "LEGAL"
                ? "green"
                : "orange"
            }
          >
            {PersonTypeLabels[customer.personType] || customer.personType}
          </Tag>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <span className="!text-xs !text-gray-500 dark:!text-gray-400">
              کد مشخصه
            </span>
            <span className="!text-sm !font-medium">{customer.personId}</span>
          </div>
          <div className="!flex !items-center !gap-2">
            <span className="!text-xs !text-gray-500 dark:!text-gray-400">
              جنسیت
            </span>
            <span className="!text-sm !font-medium">
              {customer.gender ? GenderLabels[customer.gender] : "-"}
            </span>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <span className="!text-xs !text-gray-500 dark:!text-gray-400">
              موبایل
            </span>
            <span className="!text-sm !font-medium">
              {customer.mobile || "-"}
            </span>
          </div>
          <div className="!flex !items-center !gap-2">
            <span className="!text-xs !text-gray-500 dark:!text-gray-400">
              ایمیل
            </span>
            <span className="!text-sm !font-medium">
              {customer.email || "-"}
            </span>
          </div>
        </div>

        <div className="!flex !items-center !gap-2">
          <span className="!text-xs !text-gray-500 dark:!text-gray-400">
            تاریخ تولد
          </span>
          <span className="!text-sm !font-medium">
            {customer.birthDate || "-"}
          </span>
        </div>

        <div className="!flex !gap-2 !pt-2">
          <Button
            type="primary"
            size="small"
            icon={<MdEdit />}
            className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
          >
            ویرایش
          </Button>
          <Button
            size="small"
            icon={<MdDelete />}
            className="!text-red-500 hover:!text-red-600 !border-red-500 hover:!border-red-600"
          >
            حذف
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      <div className="!bg-white dark:!bg-gray-800 !rounded-lg !shadow-md !p-6 !border !border-gray-100 dark:!border-gray-400">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="!flex !items-end !gap-4 !mb-7">
            <div className="!flex-1 !grid !grid-cols-1 md:!grid-cols-3 !gap-4">
              <Form.Item
                name="personId"
                label={
                  <span className="dark:!text-gray-50">کد مشخصه مشتری</span>
                }
                className="!mb-0"
              >
                <InputNumber className="!w-full dir-ltr" />
              </Form.Item>

              <Form.Item
                name="name"
                label={<span className="dark:!text-gray-50">نام</span>}
                className="!mb-0"
              >
                <Input className="!w-full dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className="dark:!text-gray-50">نام خانوادگی</span>}
                className="!mb-0"
              >
                <Input className="!w-full dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
              </Form.Item>
            </div>

            <Button
              type="primary"
              icon={<MdAdd className="!text-xl mt-1" />}
              onClick={onAddCustomer}
              className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white w-[180px]"
            >
              مشتری جدید
            </Button>
          </div>

          <div className="!flex !gap-3 !justify-end">
            <Button
              type="default"
              onClick={() => form.resetFields()}
              className="!px-6 !bg-white dark:!bg-gray-800 !border-green-500 dark:!border-green-500 !text-green-500 dark:!text-green-500 hover:!bg-green-50 dark:hover:!bg-gray-700"
            >
              حذف فیلتر
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || mobileLoading}
              className="!px-6 !bg-green-500 hover:!bg-green-600 !border-green-500"
            >
              جستجو
            </Button>
            {!isMobile && (
              <ExportButton
                gridApi={gridApi || undefined}
                fileName={`customers-${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace(/:/g, "-")}`}
                disabled={!gridApi || isLoading}
                tooltip="دانلود گزارش Excel"
                className="!bg-green-100 hover:!bg-green-200 !border-green-100 !text-green-500"
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
          ) : mobileCustomers.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              {mobileCustomers.map(renderMobileCustomer)}
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
                  هیچ مشتری یافت نشد
                </div>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="!h-[calc(100vh-280px)] sm:!h-[calc(100vh-300px)] md:!h-[calc(100vh-320px)] !mt-6">
          <AgGridClientComponent
            className="ag-theme-balham !w-full !h-full"
            columnDefs={columnDefs}
            rowData={allCustomers}
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

export default CustomersView;
