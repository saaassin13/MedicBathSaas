import { useState, useMemo } from 'react'
import { Select, DatePicker, Empty } from 'antd'
import { FaultLog, LogLevel } from '../../types'
import Cascader from '../../components/common/Cascader'
import styles from './FaultLog.module.css'
import dayjs from 'dayjs'

const mockLogs: FaultLog[] = [
  { id: '1', timestamp: '2026/03/07 11:49:55.099', level: 'info', content: '药浴任务开始', hallId: 'hall-1' },
  { id: '2', timestamp: '2026/03/07 11:49:55.123', level: 'warning', content: '机器人编码器电池已过期', hallId: 'hall-1' },
  { id: '3', timestamp: '2026/03/07 11:49:55.145', level: 'error', content: '光源异常', hallId: 'hall-1' },
  { id: '4', timestamp: '2026/03/07 11:49:55.167', level: 'error', content: '相机连接断开', hallId: 'hall-2' },
  { id: '5', timestamp: '2026/03/07 11:49:55.189', level: 'info', content: '药浴任务结束', hallId: 'hall-1' },
]

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

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

const getLogLevelText = (level: LogLevel) => {
  switch (level) {
    case 'info': return '提示'
    case 'warning': return '警告'
    case 'error': return '错误'
  }
}

export default function FaultLogPage() {
  const [selectedHall, setSelectedHall] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>(null)
  const [logs] = useState<FaultLog[]>(mockLogs)

  // 根据筛选条件过滤日志
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 奶厅筛选
      if (selectedHall.length > 0 && !selectedHall.includes(log.hallId)) return false
      // 故障等级筛选
      if (selectedLevel !== 'all' && log.level !== selectedLevel) return false
      // 日期范围筛选
      if (dateRange && dateRange[0] && dateRange[1]) {
        const logDate = dayjs(log.timestamp)
        if (logDate.isBefore(dateRange[0]) || logDate.isAfter(dateRange[1])) return false
      }
      return true
    }).sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()) // 按时间倒序
  }, [logs, selectedHall, selectedLevel, dateRange])

  return (
    <div className={styles['fault-log-page']}>
      <div className={styles['page-header']}>
        <h2>故障日志信息</h2>
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
          <Select
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={[
              { value: 'all', label: '全部故障等级' },
              { value: 'info', label: '提示' },
              { value: 'warning', label: '警告' },
              { value: 'error', label: '错误' },
            ]}
            style={{ width: 150 }}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as DateRange)}
          />
        </div>
        <div className={styles['log-list']}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className={styles['log-item']}>
                <span className={styles['timestamp']}>{log.timestamp}</span>
                <span className={`${styles['log-level']} ${styles[log.level]}`}>
                  [{getLogLevelText(log.level)}]
                </span>
                <span className={styles['log-content']}>{log.content}</span>
              </div>
            ))
          ) : (
            <Empty description="暂无日志记录" />
          )}
        </div>
      </div>
    </div>
  )
}
