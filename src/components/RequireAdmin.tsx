import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

const ADMIN_EMAIL = "styleandglitz@gmail.com";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream">Loading...</div>;
  if (!session || session.user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}