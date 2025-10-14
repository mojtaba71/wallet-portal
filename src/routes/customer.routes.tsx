import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const Customers = lazy(() => import("@/pages/customer/Customers"));

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path={UrlRoutes.customers} element={<Customers />} />
      <Route path="*" element={<Customers />} />
    </Routes>
  );
};

export default CustomerRoutes;
