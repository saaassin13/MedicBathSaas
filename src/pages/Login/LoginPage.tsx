import LoginForm from './LoginForm'
import styles from './Login.module.css'

export default function LoginPage() {
  return (
    <>
      <div className={styles['login-logo']}>
        <div className={styles['login-logo-icon']}>S</div>
        <span className={styles['login-logo-text']}>Scaling Robotics</span>
      </div>
      <div className={styles['login-container']}>
        <LoginForm />
      </div>
      <div className={styles['login-hint']}>
        建议使用Chrome浏览器，在1920*1080分辨率下使用效果最佳
      </div>
    </>
  )
}
