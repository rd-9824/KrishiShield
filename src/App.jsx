import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'

import LandingPage     from './pages/LandingPage'
import LoginPage       from './pages/LoginPage'
import OnboardingPage  from './pages/OnboardingPage'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage        from './pages/HomePage'
import CropPlannerPage from './pages/CropPlannerPage'
import ScanCropPage    from './pages/ScanCropPage'
import SimulatorPage   from './pages/SimulatorPage'
import YieldPage       from './pages/YieldPage'
import InsightsPage    from './pages/InsightsPage'
import ReportPage      from './pages/ReportPage'
import ProfitReportsPage from './pages/ProfitReportsPage'
import DiseaseAlertPage from './pages/DiseaseAlertPage'
import HelpPage from './pages/HelpPage'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAppStore(s => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<LandingPage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="/app" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index              element={<Navigate to="/app/home" replace />} />
        <Route path="home"        element={<HomePage />} />
        <Route path="crop-planner" element={<CropPlannerPage />} />
        <Route path="scan-crop"   element={<ScanCropPage />} />
        <Route path="simulator"   element={<SimulatorPage />} />
        <Route path="yield"       element={<YieldPage />} />
        <Route path="insights"    element={<InsightsPage />} />
        <Route path="report"      element={<ReportPage />} />
        <Route path="profit-reports" element={<ProfitReportsPage />} />
        <Route path="disease-alert" element={<DiseaseAlertPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
