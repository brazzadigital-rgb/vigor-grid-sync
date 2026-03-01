import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  requireStaff?: boolean;
}

export default function ProtectedRoute({ children, requireStaff }: Props) {
  const { session, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (requireStaff && !isStaff) return <Navigate to="/app" replace />;

  return <>{children}</>;
}
