import { useState, useMemo } from 'react'
import { Table, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface DetailRecord {
  id: string
  startTime: string
  endTime: string
  duration: string
  recognizedCows: number
  recognizedNipples: number
  unrecognizedNipples: number
  recognitionRate: number
  recognizedCowCount: number
  notCupRemoved: number
}

interface DetailTableProps {
  data: DetailRecord[]
}

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

export default function DetailTable({ data }: DetailTableProps) {
  const [dateRange, setDateRange] = useState<DateRange>(null)

  const columns: ColumnsType<DetailRecord> = [
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 120 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 120 },
    { title: '运行时长', dataIndex: 'duration', key: 'duration', width: 80 },
    { title: '识别牛数', dataIndex: 'recognizedCows', key: 'recognizedCows', width: 70 },
    { title: '识别乳头', dataIndex: 'recognizedNipples', key: 'recognizedNipples', width: 70 },
    { title: '未识别乳头', dataIndex: 'unrecognizedNipples', key: 'unrecognizedNipples', width: 80 },
    { title: '识别率', dataIndex: 'recognitionRate', key: 'recognitionRate', width: 70, render: (v) => `${v.toFixed(2)}%` },
    { title: '识别牛只', dataIndex: 'recognizedCowCount', key: 'recognizedCowCount', width: 70 },
    { title: '未脱杯', dataIndex: 'notCupRemoved', key: 'notCupRemoved', width: 60 },
  ]

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return data
    return data.filter(record => {
      const recordDate = dayjs(record.startTime)
      return !recordDate.isBefore(dateRange[0]) && !recordDate.isAfter(dateRange[1])
    })
  }, [data, dateRange])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>详细列表统计</h4>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as DateRange)}
          size="small"
          style={{ width: 220 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </div>
  )
}
