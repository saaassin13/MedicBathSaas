import styles from './Statistics.module.css'

interface DeviceStatus {
  name: string
  status: 'normal' | 'warning' | 'error'
}

interface MaintenanceStatus {
  name: string
  status: 'normal' | 'expired'
}

interface RuntimeStats {
  total: string
  shift: string
}

interface StatusSidebarProps {
  deviceStatus: DeviceStatus[]
  maintenanceStatus: MaintenanceStatus[]
  runtimeStats: RuntimeStats
}

export default function StatusSidebar({ deviceStatus, maintenanceStatus, runtimeStats }: StatusSidebarProps) {
  return (
    <div className={styles['status-sidebar']}>
      <div className={styles['status-card']}>
        <h4>当班设备状态</h4>
        {deviceStatus.map((device) => (
          <div key={device.name} className={styles['status-item']}>
            <span>{device.name}</span>
            <span className={`${styles['status-dot']} ${styles[device.status]}`} />
          </div>
        ))}
      </div>
      <div className={styles['status-card']}>
        <h4>维保状态</h4>
        {maintenanceStatus.map((item) => (
          <div key={item.name} className={styles['status-item']}>
            <span>{item.name}</span>
            <span className={`${styles['status-dot']} ${styles[item.status === 'expired' ? 'error' : 'normal']}`} />
          </div>
        ))}
      </div>
      <div className={styles['status-card']}>
        <h4>运行时间统计</h4>
        <div className={styles['status-item']}>
          <span>累计运行时长</span>
          <span className={styles['value']}>{runtimeStats.total}</span>
        </div>
        <div className={styles['status-item']}>
          <span>当班运行时长</span>
          <span className={styles['value']}>{runtimeStats.shift}</span>
        </div>
      </div>
    </div>
  )
}
