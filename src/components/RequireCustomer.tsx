import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function RequireCustomer({ children }: { children: React.ReactNode }) {
  const { session, loading } = useCustomerAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}