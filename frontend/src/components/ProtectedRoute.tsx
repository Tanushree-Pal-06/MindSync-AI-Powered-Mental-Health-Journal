import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;