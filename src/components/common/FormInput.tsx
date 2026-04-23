import { UserOutlined, LockOutlined } from '@ant-design/icons'
import styles from './FormInput.module.css'

interface FormInputProps {
  type: 'text' | 'password'
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  prefixIcon?: React.ReactNode
}

export default function FormInput({
  type,
  placeholder,
  value,
  onChange,
  error,
  prefixIcon,
}: FormInputProps) {
  const Icon = type === 'password' ? LockOutlined : UserOutlined

  return (
    <div>
      <div className={styles['input-wrapper']}>
        <span className={styles['input-icon']}>
          {prefixIcon || <Icon />}
        </span>
        <input
          type={type}
          className={styles['input-field']}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={error ? { borderColor: '#ff4d4f' } : {}}
        />
      </div>
      {error && <div className={styles['error-text']}>{error}</div>}
    </div>
  )
}
