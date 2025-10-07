import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const BusinessManagementList = lazy(
  () => import("@/pages/business-management/BusinessManagementList")
);

const AddBusinessManagement = lazy(
  () => import("@/pages/business-management/AddBusinessManagement")
);

const BusinessManagementRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`${UrlRoutes.businessManagement}${UrlRoutes.businessManagementList}`}
            replace
          />
        }
      />
      <Route
        path={`${UrlRoutes.businessManagementList}`}
        element={<BusinessManagementList />}
      />
      <Route
        path={`${UrlRoutes.addBusinessManagement}`}
        element={<AddBusinessManagement />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to={`${UrlRoutes.businessManagement}${UrlRoutes.businessManagementList}`}
            replace
          />
        }
      />
    </Routes>
  );
};

export default BusinessManagementRoutes;
