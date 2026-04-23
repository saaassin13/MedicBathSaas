import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import LoginPage from './pages/Login/LoginPage'
import UserManagePage from './pages/UserManagement/UserManagePage'
import MonitoringPage from './pages/Monitoring/MonitoringPage'

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/statistics" element={<MainLayout><div>数据统计信息占位</div></MainLayout>}>
          <Route index element={<Navigate to="/statistics/current" replace />} />
          <Route path="current" element={<div>当班数据统计占位</div>} />
          <Route path="history" element={<div>历史数据统计占位</div>} />
        </Route>
        <Route path="/maintenance" element={<MainLayout><div>设备维保信息占位</div></MainLayout>}>
          <Route index element={<Navigate to="/maintenance/plan" replace />} />
          <Route path="plan" element={<div>维保计划与任务占位</div>} />
          <Route path="record" element={<div>维保记录占位</div>} />
        </Route>
        <Route
          path="/fault-log"
          element={
            <MainLayout>
              <div>故障日志信息占位</div>
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
    </BrowserRouter>
  )
}

export default App
