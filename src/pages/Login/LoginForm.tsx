import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../../components/common/FormInput'
import styles from './Login.module.css'

interface FormErrors {
  username?: string
  password?: string
}

export default function LoginForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!username.trim()) {
      newErrors.username = '请输入用户名'
    } else if (username.length < 3) {
      newErrors.username = '用户名至少3个字符'
    }

    if (!password.trim()) {
      newErrors.password = '请输入密码'
    } else if (password.length < 6) {
      newErrors.password = '密码至少6个字符'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false)
      // 登录成功，跳转到用户管理页
      navigate('/user-management')
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={styles['login-card']}>
      <h1 className={styles['login-title']}>奶牛药浴大数据管理中心</h1>
      <div className={styles['login-form']} onKeyDown={handleKeyDown}>
        <FormInput
          type="text"
          placeholder="用户名"
          value={username}
          onChange={setUsername}
          error={errors.username}
        />
        <FormInput
          type="password"
          placeholder="密码"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <button
          className={styles['login-button']}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>
    </div>
  )
}
