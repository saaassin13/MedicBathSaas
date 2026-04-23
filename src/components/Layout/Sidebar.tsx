import { useState } from 'react'
import { Menu } from 'antd'
import {
  DashboardOutlined,
  BarChartOutlined,
  ToolOutlined,
  AlertOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  activePath: string
  onNavigate: (path: string) => void
}

const menuItems: MenuProps['items'] = [
  {
    key: '/monitoring',
    icon: <DashboardOutlined />,
    label: '奶厅作业监控',
  },
  {
    key: '/statistics',
    icon: <BarChartOutlined />,
    label: '数据统计信息',
    children: [
      { key: '/statistics/current', label: '数据统计分析' },
      { key: '/statistics/history', label: '历史数据统计' },
    ],
  },
  {
    key: '/maintenance',
    icon: <ToolOutlined />,
    label: '设备维保信息',
    children: [
      { key: '/maintenance/plan', label: '维保计划与任务' },
      { key: '/maintenance/record', label: '维保记录' },
    ],
  },
  {
    key: '/fault-log',
    icon: <AlertOutlined />,
    label: '故障日志信息',
  },
  {
    key: '/user-management',
    icon: <UserOutlined />,
    label: '用户管理',
  },
]

export default function Sidebar({ collapsed, onCollapse, activePath, onNavigate }: SidebarProps) {
  const [openKeys, setOpenKeys] = useState<string[]>(['/statistics', '/maintenance'])

  const onClick: MenuProps['onClick'] = (e) => {
    onNavigate(e.key)
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
        <button onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activePath]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        items={menuItems}
        onClick={onClick}
        style={{ borderRight: 0 }}
      />
    </div>
  )
}
