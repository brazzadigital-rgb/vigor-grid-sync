import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ExerciseTimerPage from "./pages/app/ExerciseTimerPage";
import RoutinePage from "./pages/app/RoutinePage";
import RoutineExecutionPage from "./pages/app/RoutineExecutionPage";
import GoalsPage from "./pages/app/GoalsPage";
import NewGoalPage from "./pages/app/NewGoalPage";
import AICoachPage from "./pages/app/AICoachPage";
import AIChatPage from "./pages/app/AIChatPage";
import AICoachDashboardPage from "./pages/app/AICoachDashboardPage";
import AIFeedbackPage from "./pages/app/AIFeedbackPage";
import ProfilePage from "./pages/app/ProfilePage";
import EditProfilePage from "./pages/app/EditProfilePage";
import MeasurementsPage from "./pages/app/MeasurementsPage";
import BadgesPage from "./pages/app/BadgesPage";
import NotificationsPage from "./pages/app/NotificationsPage";
import PremiumPage from "./pages/app/PremiumPage";
import TalkToPTPage from "./pages/app/TalkToPTPage";
import SettingsPage from "./pages/app/SettingsPage";
import ChangePasswordPage from "./pages/app/settings/ChangePasswordPage";
import AIStylePage from "./pages/app/settings/AIStylePage";
import UnitsPage from "./pages/app/settings/UnitsPage";
import ManageDataPage from "./pages/app/settings/ManageDataPage";
import PrivacyPolicyPage from "./pages/app/settings/PrivacyPolicyPage";
import TermsPage from "./pages/app/settings/TermsPage";
import DeleteAccountPage from "./pages/app/settings/DeleteAccountPage";

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

            {/* Main App — protected, with bottom nav */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="routine" element={<RoutinePage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="ai-coach" element={<AICoachPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/settings" element={<SettingsPage />} />
              <Route path="profile/edit" element={<EditProfilePage />} />
              <Route path="profile/measurements" element={<MeasurementsPage />} />
              <Route path="profile/badges" element={<BadgesPage />} />
              <Route path="profile/talk-pt" element={<TalkToPTPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="premium" element={<PremiumPage />} />
              <Route path="goals/new" element={<NewGoalPage />} />
              <Route path="ai-coach/dashboard" element={<AICoachDashboardPage />} />
              <Route path="ai-coach/feedback" element={<AIFeedbackPage />} />
              <Route path="profile/settings/password" element={<ChangePasswordPage />} />
              <Route path="profile/settings/ai-style" element={<AIStylePage />} />
              <Route path="profile/settings/units" element={<UnitsPage />} />
              <Route path="profile/settings/data" element={<ManageDataPage />} />
              <Route path="profile/settings/privacy" element={<PrivacyPolicyPage />} />
              <Route path="profile/settings/terms" element={<TermsPage />} />
              <Route path="profile/settings/delete" element={<DeleteAccountPage />} />
            </Route>

            {/* Full-screen routes (no bottom nav) */}
            <Route path="/app/exercises/timer" element={<ProtectedRoute><ExerciseTimerPage /></ProtectedRoute>} />
            <Route path="/app/routine/execute" element={<ProtectedRoute><RoutineExecutionPage /></ProtectedRoute>} />
            <Route path="/app/ai-coach/chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />

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
