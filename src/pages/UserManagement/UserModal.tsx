import { useState, useEffect } from 'react'
import { Modal, Form, Input, Switch, Tree } from 'antd'
import type { TreeDataNode } from 'antd'
import { User } from '../../types'

interface UserModalProps {
  visible: boolean
  mode: 'create' | 'edit'
  user: User | null
  onClose: () => void
  onSubmit: () => void
}

const permissionTreeData: TreeDataNode[] = [
  {
    title: '用户管理',
    key: 'user-management',
  },
  {
    title: '奶厅作业监控及数据统计',
    key: 'monitoring',
    children: [
      { title: '东北大区', key: 'region-northeast', children: [
        { title: '双城牧场', key: 'farm-shuangcheng', children: [
          { title: '1期奶厅', key: 'hall-1' },
          { title: '2期奶厅', key: 'hall-2' },
        ]},
      ]},
      { title: '华北大区', key: 'region-north' },
    ],
  },
]

export default function UserModal({ visible, mode, user, onClose, onSubmit }: UserModalProps) {
  const [form] = Form.useForm()
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && user) {
        form.setFieldsValue({
          username: user.username,
          realName: user.realName,
          phone: user.phone,
          email: user.email,
          status: user.status === 'enabled',
        })
      } else {
        form.resetFields()
      }
      setCheckedKeys([])
    }
  }, [visible, mode, user, form])

  const handleSubmit = () => {
    form.validateFields().then(() => {
      onSubmit()
    })
  }

  return (
    <Modal
      title={mode === 'create' ? '新增用户' : '编辑用户'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={800}
      okText="提交"
      cancelText="取消"
    >
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Form form={form} layout="vertical">
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="请输入用户名，3-20字符" disabled={mode === 'edit'} />
            </Form.Item>
            <Form.Item name="realName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
              <Input placeholder="请输入电话" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            {mode === 'create' && (
              <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            )}
            <Form.Item name="status" label="状态" valuePropName="checked">
              <Switch checkedChildren="启用" unCheckedChildren="停用" />
            </Form.Item>
          </Form>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>* 权限树</div>
          <Tree
            checkable
            defaultExpandAll
            treeData={permissionTreeData}
            checkedKeys={checkedKeys}
            onCheck={(keys) => setCheckedKeys(keys as string[])}
          />
        </div>
      </div>
    </Modal>
  )
}
