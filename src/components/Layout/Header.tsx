import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

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
    <div className="header">
      <div className="header-logo">
        <div
          style={{
            width: 32,
            height: 32,
            background: '#FF8C00',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          S
        </div>
        <span>奶牛药浴大数据管理中心</span>
      </div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <div className="header-user">
          <UserOutlined />
          <span>Admin</span>
        </div>
      </Dropdown>
    </div>
  )
}
