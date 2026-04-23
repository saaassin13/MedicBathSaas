import { useState } from 'react'
import { Select, Empty } from 'antd'
import MonitorGrid from './MonitorGrid'
import { MonitorCard } from '../../types'
import styles from './Monitoring.module.css'

// 模拟12个监控卡片数据（包含1期和2期奶厅）
const mockMonitorCards: MonitorCard[] = Array.from({ length: 12 }, (_, i) => ({
  id: `monitor-${i}`,
  location: {
    group: '蒙牛集团',
    region: '东北大区',
    farm: '双城',
    milkingHall: i < 6 ? '1期奶厅' : '2期奶厅',
    equipment: `${i % 4 + 1}号转盘`,
    process: i % 2 === 0 ? '前药浴' : '后药浴',
    viewType: i % 2 === 0 ? '监控视角' : '作业视角',
  },
  status: i === 3 ? 'error' : i === 7 ? 'stopped' : 'normal',
  thumbnail: '',
}))

const hallOptions = [
  { value: 'all', label: '全部奶厅' },
  { value: '1期奶厅', label: '1期奶厅' },
  { value: '2期奶厅', label: '2期奶厅' },
]

export default function MonitoringPage() {
  const [selectedHall, setSelectedHall] = useState('all')

  // 根据选中奶厅过滤监控卡片
  const filteredCards = mockMonitorCards.filter(card =>
    selectedHall === 'all' || card.location.milkingHall === selectedHall
  )

  return (
    <div className={styles['monitoring-page']}>
      <div className={styles['page-header']}>
        <h2>奶厅作业监控</h2>
        <Select
          className={styles['hall-selector']}
          value={selectedHall}
          onChange={setSelectedHall}
          options={hallOptions}
        />
      </div>
      {filteredCards.length > 0 ? (
        <MonitorGrid cards={filteredCards} />
      ) : (
        <Empty description="暂无监控数据" />
      )}
    </div>
  )
}
