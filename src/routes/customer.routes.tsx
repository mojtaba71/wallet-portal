import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const CustomerManagement = lazy(
  () => import("@/pages/customer/CustomerManagement")
);

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path={UrlRoutes.customers} element={<CustomerManagement />} />
      <Route path="*" element={<CustomerManagement />} />
    </Routes>
  );
};

export default CustomerRoutes;
