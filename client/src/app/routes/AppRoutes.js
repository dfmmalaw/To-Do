import { useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import App from "../App";
import AuthRoutes from "./AuthRoutes.js";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<App />}>
          {user && isAuthenticated ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="user/profile" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthRoutes />} />
              <Route path="*" element={<Navigate to="auth/login" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
