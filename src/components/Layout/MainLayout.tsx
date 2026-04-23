import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import styles from './Layout.module.css'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const getActivePath = () => {
    const path = location.pathname
    // 使用路径映射表，更易维护
    const pathMap: Record<string, string> = {
      '/monitoring': '/monitoring',
      '/statistics/current': '/statistics/current',
      '/statistics/history': '/statistics/history',
      '/statistics': '/statistics',
      '/maintenance/plan': '/maintenance/plan',
      '/maintenance/record': '/maintenance/record',
      '/maintenance': '/maintenance',
      '/fault-log': '/fault-log',
      '/user-management': '/user-management',
    }
    // 优先精确匹配，再匹配前缀
    if (pathMap[path]) return pathMap[path]
    for (const [key, value] of Object.entries(pathMap)) {
      if (path.startsWith(key)) return value
    }
    return '/monitoring'
  }

  return (
    <div className={styles['main-layout']}>
      <div className={styles['top-bar']}>
        <Header />
      </div>
      <div className={styles['body']}>
        <div className={styles['sidebar-wrapper']}>
          <Sidebar
            collapsed={collapsed}
            onCollapse={setCollapsed}
            activePath={getActivePath()}
            onNavigate={(path) => navigate(path)}
          />
        </div>
        <div className={styles['content-wrapper']}>
          <main className={styles['main-content']}>{children}</main>
        </div>
      </div>
    </div>
  )
}
