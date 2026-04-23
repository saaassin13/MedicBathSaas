import { useState, useMemo } from 'react'
import { Select, DatePicker, Empty } from 'antd'
import dayjs from 'dayjs'
import { MaintenanceRecord } from '../../types'
import styles from './Maintenance.module.css'

const mockRecords: MaintenanceRecord[] = [
  { id: '1', timestamp: '2026/03/07 00:00:00.000', status: 'completed', content: '更换机器人编码器电池', category: '维保任务', hallId: 'hall-1' },
  { id: '2', timestamp: '2026/03/07 00:00:00.000', status: 'completed', content: '喷枪固定螺栓紧固', category: '维保任务', hallId: 'hall-1' },
  { id: '3', timestamp: '2026/03/07 00:00:00.000', status: 'completed', content: '清洗喷头', category: '维保任务', hallId: 'hall-2' },
  { id: '4', timestamp: '2026/03/08 00:00:00.000', status: 'completed', content: '更换编码器电池', category: '维保任务', hallId: 'hall-1' },
]

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

export default function MaintenanceRecordPage() {
  const [selectedHall, setSelectedHall] = useState('all')
  const [selectedContent, setSelectedContent] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>(null)
  const [records] = useState<MaintenanceRecord[]>(mockRecords)

  // 根据筛选条件过滤记录
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 奶厅筛选
      if (selectedHall !== 'all' && record.hallId !== selectedHall) return false
      // 维保内容筛选
      if (selectedContent !== 'all' && record.content !== selectedContent) return false
      // 日期范围筛选
      if (dateRange && dateRange[0] && dateRange[1]) {
        const recordDate = dayjs(record.timestamp)
        if (recordDate.isBefore(dateRange[0]) || recordDate.isAfter(dateRange[1])) return false
      }
      return true
    })
  }, [records, selectedHall, selectedContent, dateRange])

  return (
    <div className={styles['maintenance-page']}>
      <div className={styles['page-header']}>
        <h2>维保记录</h2>
      </div>
      <div className={styles['content-card']}>
        <div className={styles['filter-bar']}>
          <Select
            value={selectedHall}
            onChange={setSelectedHall}
            options={[
              { value: 'all', label: '全部奶厅' },
              { value: 'hall-1', label: '1号奶厅' },
              { value: 'hall-2', label: '2号奶厅' },
            ]}
            style={{ width: 150 }}
          />
          <Select
            value={selectedContent}
            onChange={setSelectedContent}
            options={[
              { value: 'all', label: '全部维保内容' },
              { value: '更换机器人编码器电池', label: '更换机器人编码器电池' },
              { value: '喷枪固定螺栓紧固', label: '喷枪固定螺栓紧固' },
            ]}
            style={{ width: 180 }}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as DateRange)}
          />
        </div>
        <div className={styles['record-list']}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div key={record.id} className={styles['record-item']}>
                <span className={styles['timestamp']}>{record.timestamp}</span>
                <span className={styles['status']}>完成</span>
                <span className={styles['content']}>{record.content}</span>
                <span className={styles['category']}>{record.category}</span>
              </div>
            ))
          ) : (
            <Empty description="暂无维保记录" />
          )}
        </div>
      </div>
    </div>
  )
}
