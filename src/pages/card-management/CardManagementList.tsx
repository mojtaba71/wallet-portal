import AgGridClientComponent from "@/components/ag-grid/AgGridClient";
import ExportButton from "@/components/common/ExportButton";
import InputNumber from "@/components/kits/number-input/NumberInput";
import type {
  CardItem,
  GetSearchCardListResponse,
} from "@/models/cardManagement.model";
import { ResultType } from "@/models/enum/enum";
import { useCardList } from "@/services/hook/cardManagementService.hook";
import { getCardStatusText, getCardTypeText } from "@/utils/utils";
import type {
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";
import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdCalendarToday,
  MdCreditCard,
  MdOutlineInfo,
  MdPerson,
  MdBusiness,
} from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";
import CardDetailsModal from "./modals/CardDetailsModal";
import ChangeCardStatusModal from "./modals/ChangeCardStatusModal";


interface SearchCardForm {
  personId?: string;
  name?: string;
  lastName?: string;
  cif?: number;
  mobile?: number;
  pan?: number;
}

const CardManagementListView: React.FC = () => {
  const [form] = Form.useForm<SearchCardForm>();

  const [gridApi, setGridApi] = useState<any>(null);
  const { mutate: mutateCardsList, isLoading } = useCardList();
  const [allCards, setAllCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem>();
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [openChangeStatusModal, setOpenChangeStatusModal] =
    useState<boolean>(false);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileCards, setMobileCards] = useState<CardItem[]>([]);
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

  const loadMobileCards = useCallback(
    (offset: number = 0, append: boolean = false) => {
      if (mobileLoading) return;

      setMobileLoading(true);
      const formValues = form.getFieldsValue();
      const { personId, pan } = formValues;

      mutateCardsList(
        {
          offset,
          count: 1000,
          ...formValues,
          personId: personId ? Number(personId) : undefined,
          pan: pan ? Number(pan) : undefined,
        },
        {
          onSuccess: (res: GetSearchCardListResponse) => {
            if (res.resultCode === ResultType.Success) {
              if (append) {
                setMobileCards((prev) => [...prev, ...res.cardList]);
              } else {
                setMobileCards(res.cardList);
              }
              setMobileHasMore(res.cardList.length === 10);
              setMobileOffset(offset + res.cardList.length);
            }
          },
          onError: () => {
            if (append) {
              setMobileCards((prev) => prev);
            } else {
              setMobileCards([]);
            }
          },
          onSettled: () => {
            setMobileLoading(false);
          },
        }
      );
    },
    [mutateCardsList, form]
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
            loadMobileCards(mobileOffset, true);
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
    loadMobileCards,
  ]);

  const fetchAllCards = useCallback(() => {
    if (isLoading) return;

        const { personId, pan } = form.getFieldsValue();

        mutateCardsList(
          {
        offset: 0,
        count: 999,
            ...form.getFieldsValue(),
            personId: personId ? Number(personId) : undefined,
            pan: pan ? Number(pan) : undefined,
          },
          {
            onSuccess: (res: GetSearchCardListResponse) => {
              if (res.resultCode === ResultType.Success) {
            setAllCards(res.cardList);
              }
            },
            onError: () => {
          setAllCards([]);
            },
          }
        );
  }, [isLoading, form, mutateCardsList]);

  const clearFilters = () => {
    form.resetFields();
    setHasSearched(false);
    setAllCards([]);
    setMobileCards([]);
  };

  const onFinish = (values: SearchCardForm) => {
    console.log(values)
    const rawPersonId = form.getFieldValue("personId");
    const hasPersonId = rawPersonId !== undefined && rawPersonId !== null && String(rawPersonId).trim().length > 0;
    const hasOtherFields = Object.entries(values).some(([key, v]) => {
      if (key === 'personId') return false;
      if (typeof v === "string") return v.trim().length > 0;
      return v !== undefined && v !== null;
    });
    
    if (!hasPersonId && !hasOtherFields) {
      toast.error("برای جستجو باید حداقل یکی از فیلدها را پر کنید.");    
      return;
    }

    if (isMobile) {
      setHasSearched(true);
      setMobileOffset(0);
      loadMobileCards(0, false);
    } else {
      fetchAllCards();
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "ردیف",
      field: "rowIndex",
      width: 80,
      valueGetter: (params) => (params.node?.rowIndex || 0) + 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center justify-center">
          <span className="text-gray-600 dark:!text-gray-400">
            {params.value}
          </span>
        </div>
      ),
      sortable: false,
      filter: false,
    },
    {
      headerName: "شماره کارت",
      field: "pan",
      width: 200,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2">
          <MdCreditCard className="text-blue-500" />
          <span>{params.value}</span>
        </div>
      ),
      filter: "agNumberColumnFilter",
    },
    {
      field: "personId",
      headerName: "کد مشخصه مشتری",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    { field: "name", headerName: "نام", flex: 1, filter: "agTextColumnFilter" },
    {
      field: "lastName",
      headerName: "نام خانوادگی",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      field: "cif",
      headerName: "شماره مشتری",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "expireDate",
      headerName: "تاریخ انقضاء کارت",
      flex: 1,
      filter: "agDateColumnFilter",
    },
    {
      field: "status",
      headerName: "وضعیت کارت",
      flex: 1,
      valueFormatter: (p) => getCardStatusText(p.value),
      filter: "agSetColumnFilter",
      filterParams: {
        values: [
          "ACTIVE",
          "INACTIVE",
          "ACTIVE_WARNING",
          "BLOCK_DEPOSIT",
          "BLOCK_WITHDRAW",
          "BLOCK",
          "CLOSE_TEMPORARY",
          "CLOSE_TEMPORARY_WARNING",
          "CLOSE",
        ],
        valueFormatter: (params: any) => getCardStatusText(params.value),
      },
    },
    {
      field: "cardType",
      headerName: "نوع کارت",
      flex: 1,
      valueFormatter: (p) => getCardTypeText(p.value),
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["BON_CARD", "DEBIT_CARD"],
        valueFormatter: (params: any) => getCardTypeText(params.value),
      },
    },
    {
      field: "businessId",
      headerName: "کد مشخصه کسب‌وکار",
      flex: 1,
      filter: "agNumberColumnFilter",
    },
    {
      field: "businessName",
      headerName: "نام کسب‌وکار",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "عملیات",
      flex: 1,
      sortable: false,
      filter: false,

      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center justify-center gap-2 h-full">
          <Tooltip placement="top" title="اطلاعات کارت" arrow>
            <button
              className="cursor-pointer"
              onClick={() => {
                setSelectedCard(params.data);
                setOpenDetailsModal(true);
              }}
            >
              <MdOutlineInfo className="text-blue-500 !h-4 !w-4" />
            </button>
          </Tooltip>
          <Tooltip placement="top" title="تغییر وضعیت کارت" arrow>
            <button
              className="cursor-pointer"
              onClick={() => {
                setSelectedCard(params.data);
                setOpenChangeStatusModal(true);
              }}
            >
              <TbStatusChange className="text-amber-500 !h-4 !w-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderMobileCard = (card: any, index: number) => (
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
            <MdCreditCard className="!text-blue-500 !text-xl" />
            <span className="!text-sm !text-gray-500 dark:!text-gray-400">
              شماره کارت
            </span>
          </div>
          <Tag color="blue" className="!text-xs">
            {getCardTypeText(card.cardType)}
          </Tag>
        </div>

        <div className="!text-lg !font-bold !text-gray-800 dark:!text-gray-200 !text-center !py-2 !bg-gray-50 dark:!bg-gray-800 !rounded-lg">
          {card.pan}
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdPerson className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                نام
              </div>
              <div className="!text-sm !font-medium dark:!text-gray-200">
                {card.name}
              </div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdPerson className="!text-green-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                نام خانوادگی
              </div>
              <div className="!text-sm !font-medium dark:!text-gray-200">
                {card.lastName}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdOutlineInfo className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                کد مشخصه مشتری
              </div>
              <div className="!text-sm !font-medium">{card.personId}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdOutlineInfo className="!text-purple-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                شماره مشتری
              </div>
              <div className="!text-sm !font-medium">{card.cif}</div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdCalendarToday className="!text-orange-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                تاریخ انقضاء کارت
              </div>
              <div className="!text-sm !font-medium">{card.expireDate}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <TbStatusChange className="!text-red-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                وضعیت کارت
              </div>
              <div className="!text-sm !font-medium">
                {getCardStatusText(card.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="!grid !grid-cols-2 !gap-3">
          <div className="!flex !items-center !gap-2">
            <MdBusiness className="!text-indigo-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                کد کسب‌وکار
              </div>
              <div className="!text-sm !font-medium">{card.businessId}</div>
            </div>
          </div>

          <div className="!flex !items-center !gap-2">
            <MdBusiness className="!text-indigo-500 !text-base" />
            <div>
              <div className="!text-xs !text-gray-500 dark:!text-gray-400">
                نام کسب‌وکار
              </div>
              <div className="!text-sm !font-medium">{card.businessName}</div>
            </div>
          </div>
        </div>

        <div className="!flex !gap-2 !mt-2">
          <Button
            type="primary"
            size="small"
            className="!flex-1"
            onClick={() => {
              setSelectedCard(card);
              setOpenDetailsModal(true);
            }}
          >
            جزئیات
          </Button>
          <Button
            type="default"
            size="small"
            className="!flex-1"
            onClick={() => {
              setSelectedCard(card);
              setOpenChangeStatusModal(true);
            }}
          >
            تغییر وضعیت
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="!p-2 sm:!p-3 md:!p-4 h-full flex flex-col">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-400">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col">
            <Form.Item name="personId" label={<span className="dark:text-gray-50">کد مشخصه مشتری</span>} className="!mb-0">
              <InputNumber 
                className="!w-full dir-ltr"
                allowLeadingZeros
              />
              
            </Form.Item>
            <div className="!text-xs !text-gray-500 dark:!text-gray-400 !mt-1">
                برای افراد حقیقی کد ملی، برای اتباع شناسه فراگیر و برای حقوقی شناسه ملی
              </div>
            </div>
           
            <Form.Item name="name" label={<span className="dark:text-gray-50">نام</span>} className="!mb-0">
              <Input className="!w-full dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
            </Form.Item>
            <Form.Item name="lastName" label={<span className="dark:text-gray-50">نام خانوادگی</span>} className="!mb-0">
              <Input className="!w-full dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
            </Form.Item>
            <Form.Item 
              name="mobile" 
              label={<span className="dark:text-gray-50">شماره موبایل</span>} 
              className="!mb-0"
              rules={[
                {
                  pattern: /^989\d{9}$/,
                  message: "شماره موبایل باید با فرمت 989000000000 باشد"
                }
              ]}
            >
              <InputNumber 
                className="!w-full dir-ltr" 
                placeholder="989000000000"
                maxLength={12}
              />
            </Form.Item>
            <Form.Item name="pan" label={<span className="dark:text-gray-50">شماره کارت</span>} className="!mb-0">
              <InputNumber 
                className="!w-full dir-ltr" 
                maxLength={16}
                placeholder="شماره کارت 16 رقمی"
              />
            </Form.Item>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 justify-end">
            <Button
              type="default"
              className="!px-6 !bg-white dark:!bg-gray-800 !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
              onClick={clearFilters}
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
                gridApi={gridApi}
                fileName={`card-management-${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace(/:/g, "-")}`}
                disabled={!gridApi || isLoading}
                tooltip="دانلود لیست کارت‌ها Excel"
                className="!bg-green-500 hover:!bg-green-600 !border-green-500 !text-white"
              />
            )}
          </div>
        </div>
      </Form>
      {isMobile ? (
        <div className="!space-y-4 !mt-6">
          {!hasSearched ? (
            <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900 !border-dashed !border-2 !border-gray-300 dark:!border-gray-250">
              <div className="!text-gray-500 dark:!text-gray-400 !text-lg !mb-2">
                🆔 موردی برای نمایش وجود ندارد
              </div>
              <div className="!text-gray-400 !text-sm">
                لطفاً ابتدا جستجو انجام دهید
              </div>
            </Card>
          ) : mobileCards.length > 0 ? (
            <SimpleBar className="!max-h-[calc(100vh-300px)]">
              <>
                {mobileCards.map(renderMobileCard)}
                {mobileHasMore && (
                  <div ref={mobileObserverRef} className="!text-center !py-4">
                    <Spin size="large" />
                    <div className="!text-sm !text-gray-500 dark:!text-gray-400 !mt-2">
                      در حال دریافت اطلاعات...
          </div>
        </div>
                )}
              </>
            </SimpleBar>
          ) : (
            !mobileLoading && (
              <Card className="!text-center !py-8 !bg-white dark:!bg-gray-900">
                <div className="!text-gray-500 dark:!text-gray-400">
                  هیچ کارتی یافت نشد
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
            rowData={allCards}
          loading={isLoading}
          pagination
          paginationPageSize={50}
          onGridReady={(params) => {
            setGridApi(params.api);
          }}
        />
      </div>
      )}

      {selectedCard && (
        <>
          {openDetailsModal && (
            <CardDetailsModal
              open={openDetailsModal}
              onCancel={() => setOpenDetailsModal(false)}
              card={selectedCard}
            />
          )}
          {openChangeStatusModal && (
            <ChangeCardStatusModal
              openModal={openChangeStatusModal}
              onClose={() => setOpenChangeStatusModal(false)}
              selectedCard={selectedCard}
              handleConfirm={() => {
                setOpenChangeStatusModal(false);
                if (isMobile && hasSearched) {
                  loadMobileCards(0, false);
                } else if (!isMobile) {
                  onFinish(form.getFieldsValue());
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CardManagementListView;
