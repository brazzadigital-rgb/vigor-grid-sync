import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/StudentHome";
import StudentWorkouts from "./pages/student/StudentWorkouts";
import WorkoutDetail from "./pages/student/WorkoutDetail";
import WorkoutExecution from "./pages/student/WorkoutExecution";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentSearch from "./pages/student/StudentSearch";
import StudentProfile from "./pages/student/StudentProfile";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPrograms from "./pages/admin/AdminPrograms";
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
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Student App */}
          <Route path="/app" element={<StudentLayout><StudentHome /></StudentLayout>} />
          <Route path="/app/workouts" element={<StudentLayout><StudentWorkouts /></StudentLayout>} />
          <Route path="/app/workouts/:id" element={<StudentLayout><WorkoutDetail /></StudentLayout>} />
          <Route path="/app/workouts/:id/execute" element={<WorkoutExecution />} />
          <Route path="/app/schedule" element={<StudentLayout><StudentSchedule /></StudentLayout>} />
          <Route path="/app/search" element={<StudentLayout><StudentSearch /></StudentLayout>} />
          <Route path="/app/profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />

          {/* Admin ERP */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="access" element={<AdminAccessControl />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
