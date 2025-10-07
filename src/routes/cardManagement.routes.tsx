import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UrlRoutes } from "./url.routes";

const CardManagementList = lazy(
  () => import("@/pages/card-management/CardManagementList")
);

const CardManagementRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`${UrlRoutes.cardManagement}${UrlRoutes.cardManagementList}`}
            replace
          />
        }
      />
      <Route
        path={`${UrlRoutes.cardManagementList}`}
        element={<CardManagementList />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to={`${UrlRoutes.cardManagement}${UrlRoutes.cardManagementList}`}
            replace
          />
        }
      />
    </Routes>
  );
};

export default CardManagementRoutes;
