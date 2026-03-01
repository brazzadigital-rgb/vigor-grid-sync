import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  requireStaff?: boolean;
}

export default function ProtectedRoute({ children, requireStaff }: Props) {
  const { session, user, loading, isStaff } = useAuth();
  const location = useLocation();

  const { data: onboardingData, isLoading: onboardingLoading } = useQuery({
    queryKey: ["onboarding-check", user?.id],
    enabled: !!user && !isStaff,
    queryFn: async () => {
      const { data } = await supabase
        .from("onboarding_data")
        .select("completed")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  if (loading || (!!user && !isStaff && onboardingLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;
  if (requireStaff && !isStaff) return <Navigate to="/app" replace />;

  // Redirect non-staff users to onboarding if not completed
  if (!isStaff && location.pathname !== "/onboarding" && (!onboardingData || !onboardingData.completed)) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
