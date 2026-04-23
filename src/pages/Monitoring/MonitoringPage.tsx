import { useState } from 'react'
import { Empty } from 'antd'
import MonitorGrid from './MonitorGrid'
import { MonitorCard } from '../../types'
import Cascader from '../../components/common/Cascader'
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

// 级联下拉数据
const hallOptions = [
  {
    value: 'mengniu',
    label: '蒙牛集团',
    children: [
      {
        value: 'northeast',
        label: '东北大区',
        children: [
          {
            value: 'shuangcheng',
            label: '双城牧场',
            children: [
              { value: 'hall-1', label: '1期奶厅' },
              { value: 'hall-2', label: '2期奶厅' },
            ],
          },
        ],
      },
    ],
  },
]

export default function MonitoringPage() {
  const [selectedHall, setSelectedHall] = useState<string[]>([])

  // 根据选中奶厅过滤监控卡片
  const filteredCards = mockMonitorCards.filter(card => {
    if (selectedHall.length === 0) return true
    // 只根据奶厅级别过滤
    const hallMap: Record<string, string> = {
      'hall-1': '1期奶厅',
      'hall-2': '2期奶厅',
    }
    return selectedHall.some(v => hallMap[v] === card.location.milkingHall)
  })

  return (
    <div className={styles['monitoring-page']}>
      <div className={styles['page-header']}>
        <h2>奶厅作业监控</h2>
        <Cascader
          options={hallOptions}
          mode="single"
          placeholder="选择奶厅"
          value={selectedHall}
          onChange={(values) => setSelectedHall(values)}
          width={200}
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
