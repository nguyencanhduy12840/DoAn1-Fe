/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }: { requiredRole: string }) => {
  const { isAuthenticated, user } = useSelector((state: any) => state.user);

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (user.roleEntity.name !== requiredRole) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
