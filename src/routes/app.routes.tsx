import MainLayout from "@/components/layout/Layout";
import type { RootState } from "@/store";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import BusinessManagementRoutes from "./businessManagement.routes";
import CardManagementRoutes from "./cardManagement.routes";
import CustomerRoutes from "./customer.routes";
import { UrlRoutes } from "./url.routes";
import ReportsRoutes from "./reports.routes";

const Login = lazy(() => import("@/pages/login/Login"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));

const AppRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Suspense
      fallback={<div className="text-center mt-10">در حال بارگذاری...</div>}
    >
      <Routes>
        {/* صفحه لاگین همیشه در دسترس */}
        <Route path={UrlRoutes.login} element={<Login />} />

        {token ? (
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={<Navigate to={UrlRoutes.dashboard} replace />}
            />
            <Route path={UrlRoutes.dashboard} element={<Dashboard />} />
            <Route
              path={`${UrlRoutes.businessManagement}/*`}
              element={<BusinessManagementRoutes />}
            />
            <Route
              path={`${UrlRoutes.cardManagement}/*`}
              element={<CardManagementRoutes />}
            />
            <Route
              path={`${UrlRoutes.baseInfoManagement}/*`}
              element={<CustomerRoutes />}
            />
            <Route
              path={`${UrlRoutes.reports}/*`}
              element={<ReportsRoutes />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route
              path="*"
              element={<Navigate to={UrlRoutes.login} replace />}
            />
            <Route
              path="/"
              element={<Navigate to={UrlRoutes.login} replace />}
            />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default AppRoute;
