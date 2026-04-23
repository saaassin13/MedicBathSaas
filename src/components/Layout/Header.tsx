import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import styles from './Layout.module.css'

export default function Header() {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.headerLogo}>
        <div className={styles.logoIcon}>
          S
        </div>
        <span>奶牛药浴大数据管理中心</span>
      </div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <div className={styles.headerUser}>
          <UserOutlined />
          <span>Admin</span>
        </div>
      </Dropdown>
    </header>
  )
}
