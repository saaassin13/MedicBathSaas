import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import LoginPage from './pages/Login/LoginPage'
import UserManagePage from './pages/UserManagement/UserManagePage'
import MonitoringPage from './pages/Monitoring/MonitoringPage'
import MaintenancePlanPage from './pages/Maintenance/MaintenancePlanPage'
import MaintenanceRecordPage from './pages/Maintenance/MaintenanceRecordPage'
import FaultLogPage from './pages/FaultLog/FaultLogPage'
import StatisticsPage from './pages/Statistics/StatisticsPage'
import HistoryStatisticsPage from './pages/Statistics/HistoryStatisticsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/monitoring"
          element={
            <MainLayout>
              <MonitoringPage />
            </MainLayout>
          }
        />
        {/* statistics 父路由承载子路由，避免占位符覆盖子路由 */}
        <Route path="/statistics" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Navigate to="/statistics/current" replace />} />
          <Route path="current" element={<StatisticsPage />} />
          <Route path="history" element={<HistoryStatisticsPage />} />
        </Route>
        <Route path="/maintenance" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Navigate to="/maintenance/plan" replace />} />
          <Route path="plan" element={<MaintenancePlanPage />} />
          <Route path="record" element={<MaintenanceRecordPage />} />
        </Route>
        <Route
          path="/fault-log"
          element={
            <MainLayout>
              <FaultLogPage />
            </MainLayout>
          }
        />
        <Route
          path="/user-management"
          element={
            <MainLayout>
              <UserManagePage />
            </MainLayout>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
