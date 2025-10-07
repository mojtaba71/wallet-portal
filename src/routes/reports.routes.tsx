import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const ReportsCard = lazy(() => import("@/pages/reports/ReportsCard"));
const CardEventsReport = lazy(() => import("@/pages/reports/CardEventsReport"));
const BusinessDepositReport = lazy(() => import("@/pages/reports/BusinessDepositReport"));
const SettlementReport = lazy(() => import("@/pages/reports/SettlementReport"));

const ReportsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`${UrlRoutes.reports}${UrlRoutes.reportsCard}`}
            replace
          />
        }
      />
      <Route path={`${UrlRoutes.reportsCard}`} element={<ReportsCard />} />
      <Route path={`${UrlRoutes.reportsCardEvents}`} element={<CardEventsReport />} />
      <Route path={`${UrlRoutes.reportsBusinessDeposit}`} element={<BusinessDepositReport />} />
      <Route path={`${UrlRoutes.reportsSettlement}`} element={<SettlementReport />} />

      <Route
        path="*"
        element={
          <Navigate
            to={`${UrlRoutes.reports}${UrlRoutes.reportsCard}`}
            replace
          />
        }
      />
    </Routes>
  );
};

export default ReportsRoutes;
