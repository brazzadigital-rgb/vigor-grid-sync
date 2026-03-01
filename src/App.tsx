import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth
import OnboardingPage from "./pages/auth/OnboardingPage";
import OnboardingStepsPage from "./pages/auth/OnboardingStepsPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";

// App Layout + Pages
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/app/HomePage";
import ExercisesPage from "./pages/app/ExercisesPage";
import RoutinePage from "./pages/app/RoutinePage";
import GoalsPage from "./pages/app/GoalsPage";
import AICoachPage from "./pages/app/AICoachPage";
import ProfilePage from "./pages/app/ProfilePage";
import SettingsPage from "./pages/app/SettingsPage";

// Admin
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
            {/* Onboarding & Auth */}
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/onboarding" element={<OnboardingStepsPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Main App — protected */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="routine" element={<RoutinePage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="ai-coach" element={<AICoachPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/settings" element={<SettingsPage />} />
              {/* Placeholder routes for sub-pages */}
              <Route path="profile/edit" element={<ProfilePage />} />
              <Route path="profile/measurements" element={<ProfilePage />} />
              <Route path="profile/badges" element={<ProfilePage />} />
              <Route path="notifications" element={<HomePage />} />
              <Route path="goals/new" element={<GoalsPage />} />
              <Route path="ai-coach/chat" element={<AICoachPage />} />
              <Route path="ai-coach/dashboard" element={<AICoachPage />} />
              <Route path="ai-coach/feedback" element={<AICoachPage />} />
              <Route path="exercises/timer" element={<ExercisesPage />} />
            </Route>

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
