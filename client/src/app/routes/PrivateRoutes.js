import { Route, Routes, Navigate } from "react-router-dom";

import Tasks from "../pages/Tasks";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<Navigate to="/user/tasks" />} />
      <Route path="user/tasks" element={<Tasks />} />
    </Routes>
  );
};

export default PrivateRoutes;
