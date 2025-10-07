import {
  AllCommunityModule,
  themeBalham,
  colorSchemeDark,
  colorSchemeLight,
  type ColDef,
  type GridOptions,
  type GridReadyEvent,
  type PaginationChangedEvent,
} from "ag-grid-community";
import {
  AllEnterpriseModule,
  LicenseManager,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { AG_GRID_LOCALE_FA } from "./locale.fa";

LicenseManager.setLicenseKey(
  "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f"
);

const PAGE_SIZE_OPTIONS = [10, 15, 20, 50];

export type AgGridClientProps = {
  columnDefs: ColDef[];
  className?: string;
  defaultColDef?: ColDef;
  gridOptions?: GridOptions;
  pagination?: boolean;
  paginationPageSize?: number;
  loading?: boolean;
  rowData?: any[];
  onGridReady?: (params: GridReadyEvent) => void;
  onPageSizeChanged?: (newSize: number) => void;
  onPaginationChanged?: (params: PaginationChangedEvent) => void;
  hasError?: boolean;
};

const AgGridClientComponent: React.FC<AgGridClientProps> = ({
  columnDefs,
  className = "",
  defaultColDef,
  gridOptions = {},
  pagination = false,
  paginationPageSize = 10,
  loading = false,
  rowData = [],
  onGridReady,
  onPageSizeChanged,
  onPaginationChanged,
  hasError = false,
}) => {
  const [gridApi, setGridApi] = useState<any>();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const mergedDefaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      reorder: false,
      lockPosition: true,
      minWidth: 100,
      maxWidth: 300,
      suppressSizeToFit: false,
      filter: true,
      ...defaultColDef,
    }),
    [defaultColDef]
  );

  const processedColumns = useMemo(
    () =>
      columnDefs.map((col) =>
        col.width || col.minWidth ? col : { ...col, flex: 1 }
      ),
    [columnDefs]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      onPageSizeChanged?.(size);
    },
    [onPageSizeChanged]
  );

  useEffect(() => {
    if (!gridApi) return;
    if (loading) {
      gridApi.showLoadingOverlay();
    } else {
      gridApi.hideOverlay();
      const rowCount = gridApi.getDisplayedRowCount();
      if (rowCount === 0) {
        gridApi.showNoRowsOverlay();
      }
    }
  }, [loading, gridApi]);

  useEffect(() => {
    if (gridApi && hasError) {
      gridApi.showNoRowsOverlay();
    }
  }, [gridApi, hasError]);

  // Handle window resize to auto-fit columns
  useEffect(() => {
    const handleResize = () => {
      if (gridApi) {
        setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridApi]);

  const agGridTheme = useMemo(() => {
    return currentTheme === 'dark' 
      ? themeBalham.withPart(colorSchemeDark)
      : themeBalham.withPart(colorSchemeLight);
  }, [currentTheme]);

  return (
    <div className={`ag-grid-container w-full h-full ${className} rt`}>
      <AgGridReact
        theme={agGridTheme}
        columnDefs={processedColumns}
        defaultColDef={mergedDefaultColDef}
        rowData={rowData}
        animateRows
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        enableRtl={true}
        modules={[
          AllCommunityModule,
          AllEnterpriseModule,
        ]}
        localeText={AG_GRID_LOCALE_FA}
        paginationPageSizeSelector={PAGE_SIZE_OPTIONS}
        overlayLoadingTemplate={`<span class="ag-overlay-loading-center">در حال بارگذاری...</span>`}
        overlayNoRowsTemplate={`<span class="ag-overlay-loading-center">هیچ داده‌ای یافت نشد</span>`}
        onGridReady={(params) => {
          setGridApi(params.api);
          // Auto-size columns to fit container width
          setTimeout(() => {
            params.api.sizeColumnsToFit();
          }, 100);
          onGridReady?.(params);
        }}
        onPaginationChanged={(params) => {
          const newSize = params.api.paginationGetPageSize();
          if (newSize !== paginationPageSize) {
            handlePageSizeChange(newSize);
          }
          onPaginationChanged?.(params);
        }}
        {...gridOptions}
      />
    </div>
  );
};

export default AgGridClientComponent;

