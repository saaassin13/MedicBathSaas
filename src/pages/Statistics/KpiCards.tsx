import { KpiData } from '../../types'
import styles from './Statistics.module.css'

interface KpiCardsProps {
  data: KpiData
}

export default function KpiCards({ data }: KpiCardsProps) {
  const cards = [
    { label: '当班药浴牛数', value: `${data.cowCount}头`, icon: '🐄', color: '#ff8c00' },
    { label: '当班乳头识别率', value: `${data.recognitionRate}%`, icon: '👁', color: '#1890ff' },
    { label: '当班药液用量', value: `${data.solutionUsage} L`, icon: '💧', color: '#52c41a' },
    { label: '当班药液均量', value: `${data.solutionAvgPerCow} ML/头`, icon: '📊', color: '#722ed1' },
  ]

  return (
    <div className={styles['kpi-cards']}>
      {cards.map((card, index) => (
        <div key={index} className={styles['kpi-card']}>
          <div className={styles['kpi-icon']} style={{ background: card.color + '20', color: card.color }}>
            {card.icon}
          </div>
          <div className={styles['kpi-value']}>{card.value}</div>
          <div className={styles['kpi-label']}>{card.label}</div>
        </div>
      ))}
    </div>
  )
}
