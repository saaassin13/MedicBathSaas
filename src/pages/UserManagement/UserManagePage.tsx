import { useState, useEffect, useRef } from 'react'
import { Input, Button, Table, Switch, Popconfirm, message } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { User } from '../../types'
import UserModal from './UserModal'
import styles from './UserManage.module.css'

// 模拟数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin123',
    realName: '张三',
    email: '9728317238@qq.com',
    phone: '18789213123',
    department: 'XX部门',
    status: 'enabled',
    permissions: [],
    createdAt: '2026-04-01 10:00:00',
  },
  {
    id: '2',
    username: 'user001',
    realName: '李四',
    email: 'li@example.com',
    phone: '13912345678',
    department: '运维部',
    status: 'disabled',
    permissions: [],
    createdAt: '2026-04-02 14:30:00',
  },
]

export default function UserManagePage() {
  const [users] = useState<User[]>(mockUsers)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // 搜索防抖 500ms
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 500)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchKeyword])

  const columns: ColumnsType<User> = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Switch
          checked={status === 'enabled'}
          checkedChildren="启用"
          unCheckedChildren="停用"
        />
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>编辑</a>
          <Popconfirm
            title="确定删除该用户？"
            onConfirm={() => handleDelete(record.id)}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setModalVisible(true)
  }

  const handleDelete = (_id: string) => {
    message.success('删除成功')
  }

  const handleBatchDelete = () => {
    message.success(`批量删除 ${selectedRowKeys.length} 条`)
    setSelectedRowKeys([])
  }

  const filteredUsers = users.filter((user) =>
    user.username.includes(debouncedKeyword) ||
    user.realName.includes(debouncedKeyword)
  )

  return (
    <div className={styles['user-manage-page']}>
      <div className={styles['page-header']}>
        <h2>用户管理</h2>
      </div>
      <div className={styles['content-card']}>
        <div className={styles['toolbar']}>
          <Input
            placeholder="搜索"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 240 }}
          />
          <div className={styles['toolbar-buttons']}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              新增用户
            </Button>
            <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
              删除
            </Button>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div className={styles['floating-action-bar']}>
            <span>已选中 {selectedRowKeys.length} 项</span>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>取消</Button>
            <Button size="small" danger onClick={handleBatchDelete}>删除</Button>
          </div>
        )}

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
        />
      </div>

      <UserModal
        visible={modalVisible}
        mode={editingUser ? 'edit' : 'create'}
        user={editingUser}
        onClose={() => {
          setModalVisible(false)
          setEditingUser(null)
        }}
        onSubmit={() => {
          setModalVisible(false)
          setEditingUser(null)
          message.success(editingUser ? '更新成功' : '新增成功')
        }}
      />
    </div>
  )
}
