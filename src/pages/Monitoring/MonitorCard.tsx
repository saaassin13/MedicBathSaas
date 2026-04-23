import { MonitorCard as MonitorCardType } from '../../types'
import styles from './Monitoring.module.css'

interface MonitorCardProps {
  data: MonitorCardType
}

export default function MonitorCard({ data }: MonitorCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal': return styles.normal
      case 'error': return styles.error
      case 'stopped': return styles.stopped
      default: return ''
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '运行正常'
      case 'error': return '异常中断'
      case 'stopped': return '未启动'
      default: return ''
    }
  }

  const locationText = [
    data.location.group,
    data.location.region,
    data.location.farm,
    `${data.location.milkingHall}-${data.location.equipment}`,
    data.location.process,
    data.location.viewType,
  ].join('-')

  return (
    <div className={styles['monitor-card']}>
      {data.status === 'stopped' ? (
        <div className={styles['no-signal']}>无信号</div>
      ) : (
        <div className={styles.placeholder}>
          {/* 后续接入实时视频 */}
        </div>
      )}
      <div className={`${styles['status-badge']} ${getStatusClass(data.status)}`}>
        <span className={`${styles['status-dot']} ${getStatusClass(data.status).split(' ')[0]}`} />
        {getStatusText(data.status)}
      </div>
      <div className={styles['location-bar']}>
        {locationText}
      </div>
    </div>
  )
}
