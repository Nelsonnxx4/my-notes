import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // TODO: replace with your real auth check (e.g. from a store or context)
  // e.g. const { user, isLoading } = useAuthStore();
  // if (isLoading) return <LoadingScreen />;

  const token = localStorage.getItem("token"); // swap with your actual auth source

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
