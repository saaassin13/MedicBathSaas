import MonitorCard from './MonitorCard'
import { MonitorCard as MonitorCardType } from '../../types'
import styles from './Monitoring.module.css'

interface MonitorGridProps {
  cards: MonitorCardType[]
}

export default function MonitorGrid({ cards }: MonitorGridProps) {
  return (
    <div className={styles['monitor-grid']}>
      {cards.map((card) => (
        <MonitorCard key={card.id} data={card} />
      ))}
    </div>
  )
}
