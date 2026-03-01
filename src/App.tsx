import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/StudentHome";
import StudentWorkouts from "./pages/student/StudentWorkouts";
import WorkoutDetail from "./pages/student/WorkoutDetail";
import WorkoutExecution from "./pages/student/WorkoutExecution";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentSearch from "./pages/student/StudentSearch";
import StudentProfile from "./pages/student/StudentProfile";
import StudentProgress from "./pages/student/StudentProgress";
import StudentPayments from "./pages/student/StudentPayments";
import StudentCredential from "./pages/student/StudentCredential";
import StudentSettings from "./pages/student/StudentSettings";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminProgramDetail from "./pages/admin/AdminProgramDetail";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAccessControl from "./pages/admin/AdminAccessControl";
import AdminReports from "./pages/admin/AdminReports";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Student App — protected */}
            <Route path="/app" element={<ProtectedRoute><StudentLayout><StudentHome /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/workouts" element={<ProtectedRoute><StudentLayout><StudentWorkouts /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/workouts/:id" element={<ProtectedRoute><StudentLayout><WorkoutDetail /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/workouts/:id/execute" element={<ProtectedRoute><WorkoutExecution /></ProtectedRoute>} />
            <Route path="/app/schedule" element={<ProtectedRoute><StudentLayout><StudentSchedule /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/search" element={<ProtectedRoute><StudentLayout><StudentSearch /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/profile" element={<ProtectedRoute><StudentLayout><StudentProfile /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/profile/progress" element={<ProtectedRoute><StudentLayout><StudentProgress /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/profile/payments" element={<ProtectedRoute><StudentLayout><StudentPayments /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/profile/credential" element={<ProtectedRoute><StudentLayout><StudentCredential /></StudentLayout></ProtectedRoute>} />
            <Route path="/app/profile/settings" element={<ProtectedRoute><StudentLayout><StudentSettings /></StudentLayout></ProtectedRoute>} />

            {/* Admin ERP — protected + staff */}
            <Route path="/admin" element={<ProtectedRoute requireStaff><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="programs/:id" element={<AdminProgramDetail />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="access" element={<AdminAccessControl />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="integrations" element={<AdminIntegrations />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
