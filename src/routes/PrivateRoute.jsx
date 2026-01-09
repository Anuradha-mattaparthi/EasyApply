import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  return localStorage.getItem("access")
    ? children
    : <Navigate to="/signin" />;
}
