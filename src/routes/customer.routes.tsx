import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const CustomerManagement = lazy(
  () => import("@/pages/customer/CustomerManagement")
);
const BulkCustomerRegistration = lazy(
  () => import("@/pages/customer/BulkCustomerRegistration")
);

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`${UrlRoutes.baseInfoManagement}${UrlRoutes.customers}`}
            replace
          />
        }
      />
      <Route path={UrlRoutes.customers} element={<CustomerManagement />} />
      <Route
        path={UrlRoutes.groupCustomerRegistration}
        element={<BulkCustomerRegistration />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to={`${UrlRoutes.baseInfoManagement}${UrlRoutes.customers}`}
            replace
          />
        }
      />
    </Routes>
  );
};

export default CustomerRoutes;
