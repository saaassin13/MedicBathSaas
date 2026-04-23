import { useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { MaintenancePlan } from '../../types'
import Cascader from '../../components/common/Cascader'
import styles from './Maintenance.module.css'

const mockPlans: MaintenancePlan[] = [
  { id: '1', serialNumber: 1, content: '喷枪固定螺栓紧固', cycleHours: 168, lastMaintenanceTime: '2026/04/07 00:48:22' },
  { id: '2', serialNumber: 2, content: '更换机器人润滑脂', cycleHours: 720, lastMaintenanceTime: '2026/04/01 10:20:00' },
  { id: '3', serialNumber: 3, content: '清洗喷头', cycleHours: 24, lastMaintenanceTime: '2026/04/22 08:00:00' },
]

function calculateRemainingTime(lastTime: string, cycleHours: number): string {
  const last = new Date(lastTime.replace(/\//g, '-'))
  const next = new Date(last.getTime() + cycleHours * 60 * 60 * 1000)
  const now = new Date()
  const diff = next.getTime() - now.getTime()

  if (diff <= 0) return '已到期'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  return days > 0 ? `${days}天${remainingHours}小时` : `${hours}小时`
}

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

export default function MaintenancePlanPage() {
  const [selectedHall, setSelectedHall] = useState<string[]>([])
  const [plans] = useState<MaintenancePlan[]>(mockPlans)

  const columns: ColumnsType<MaintenancePlan> = [
    { title: '序号', dataIndex: 'serialNumber', key: 'serialNumber', width: 80 },
    { title: '维保内容', dataIndex: 'content', key: 'content' },
    { title: '维保周期(小时)', dataIndex: 'cycleHours', key: 'cycleHours', width: 120 },
    { title: '最后一次维保时间', dataIndex: 'lastMaintenanceTime', key: 'lastMaintenanceTime', width: 180 },
    {
      title: '剩余时间',
      key: 'remainingTime',
      width: 150,
      render: (_, record) => {
        const remaining = calculateRemainingTime(record.lastMaintenanceTime, record.cycleHours)
        return (
          <span className={`${styles['remaining-time']} ${remaining === '已到期' ? styles.warning : ''}`}>
            {remaining}
          </span>
        )
      },
    },
  ]

  return (
    <div className={styles['maintenance-page']}>
      <div className={styles['page-header']}>
        <h2>维保计划与任务</h2>
      </div>
      <div className={styles['content-card']}>
        <div className={styles['filter-bar']}>
          <Cascader
            options={hallOptions}
            mode="single"
            placeholder="选择奶厅"
            value={selectedHall}
            onChange={(values) => setSelectedHall(values)}
            width={200}
          />
        </div>
        <Table
          className={styles['maintenance-table']}
          columns={columns}
          dataSource={plans}
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  )
}
