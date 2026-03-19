import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  //   const { user, isLoading } = authStore;

  //   if (isLoading) return <LoadingScreen />;

  // if (!user)
  return <Navigate to={"/login"} />;

  return <>{children}</>;
};

export default ProtectedRoute;
