// @ts-nocheck
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login"

const AuthRoutes = () => (
  <Routes>
      <Route path="login" element={<Login />} />
      <Route index element={<Login />} />
  </Routes>
);

export default AuthRoutes;