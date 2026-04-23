import { useState, useMemo } from 'react'
import { Select, DatePicker, Button, Table, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import { HistoryRecord } from '../../types'
import styles from './Statistics.module.css'

const mockRecords: HistoryRecord[] = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  hall: '双城-1期奶厅-1号转盘-后药浴',
  startTime: `2026-04-${String((i % 28) + 1).padStart(2, '0')} 08:00`,
  endTime: `2026-04-${String((i % 28) + 1).padStart(2, '0')} 12:00`,
  duration: '04:00:00',
  recognizedCows: 120 + i,
  recognizedNipples: 480 + i * 4,
  unrecognizedNipples: 10 + Math.floor(i / 2),
  recognitionRate: 97.85 + Math.random() * 2,
  recognizedCowCount: 118 + i,
  notCupRemoved: 5 + Math.floor(i / 3),
  antiFadeChain: 3 + Math.floor(i / 4),
  narrowCowLeg: 2 + Math.floor(i / 5),
  abnormalSkip: 1 + Math.floor(i / 6),
  missedSprayCows: 1 + Math.floor(i / 7),
}))

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

// 导出为 Excel
const exportToExcel = (data: HistoryRecord[], filename: string) => {
  const exportData = data.map(record => ({
    '奶厅': record.hall,
    '开始时间': record.startTime,
    '结束时间': record.endTime,
    '运行时长': record.duration,
    '识别牛数': record.recognizedCows,
    '识别乳头': record.recognizedNipples,
    '未识别乳头': record.unrecognizedNipples,
    '乳头识别率': `${record.recognitionRate.toFixed(2)}%`,
    '识别牛只': record.recognizedCowCount,
    '未脱杯': record.notCupRemoved,
    '防褪链': record.antiFadeChain,
    '牛腿过窄': record.narrowCowLeg,
    '异常跳过': record.abnormalSkip,
    '漏喷牛只': record.missedSprayCows,
  }))
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '历史数据')
  XLSX.writeFile(wb, `${filename}_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`)
  message.success(`已导出 ${data.length} 条数据`)
}

export default function HistoryStatisticsPage() {
  const [selectedHall, setSelectedHall] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 根据筛选条件过滤数据
  const filteredRecords = useMemo(() => {
    return mockRecords.filter(record => {
      if (selectedHall !== 'all' && !record.hall.includes(selectedHall)) return false
      if (dateRange && dateRange[0] && dateRange[1]) {
        const recordDate = dayjs(record.startTime)
        if (recordDate.isBefore(dateRange[0]) || recordDate.isAfter(dateRange[1])) return false
      }
      return true
    })
  }, [selectedHall, dateRange])

  const columns: ColumnsType<HistoryRecord> = [
    { title: '奶厅', dataIndex: 'hall', key: 'hall', width: 200 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 150 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 150 },
    { title: '运行时长', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: '识别牛数', dataIndex: 'recognizedCows', key: 'recognizedCows', width: 80 },
    { title: '识别乳头', dataIndex: 'recognizedNipples', key: 'recognizedNipples', width: 80 },
    { title: '未识别乳头', dataIndex: 'unrecognizedNipples', key: 'unrecognizedNipples', width: 80 },
    { title: '乳头识别率', dataIndex: 'recognitionRate', key: 'recognitionRate', width: 100, render: (v) => `${v.toFixed(2)}%` },
    { title: '识别牛只', dataIndex: 'recognizedCowCount', key: 'recognizedCowCount', width: 80 },
    { title: '未脱杯', dataIndex: 'notCupRemoved', key: 'notCupRemoved', width: 80 },
    { title: '防褪链', dataIndex: 'antiFadeChain', key: 'antiFadeChain', width: 80 },
    { title: '牛腿过窄', dataIndex: 'narrowCowLeg', key: 'narrowCowLeg', width: 80 },
    { title: '异常跳过', dataIndex: 'abnormalSkip', key: 'abnormalSkip', width: 80 },
    { title: '漏喷牛只', dataIndex: 'missedSprayCows', key: 'missedSprayCows', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" icon={<DownloadOutlined />}
          onClick={() => exportToExcel([record], '单条导出')}>
          导出
        </Button>
      ),
    },
  ]

  // 批量导出选中数据
  const handleBatchExport = () => {
    const selectedRecords = mockRecords.filter(r => selectedRowKeys.includes(r.id))
    exportToExcel(selectedRecords, '批量导出')
  }

  // 全量导出
  const handleExportAll = () => {
    exportToExcel(filteredRecords, '全量导出')
  }

  return (
    <div className={styles['history-page']}>
      <div className={styles['filter-bar']}>
        <Select
          value={selectedHall}
          onChange={(val) => { setSelectedHall(val); setCurrentPage(1) }}
          options={[
            { value: 'all', label: '全部' },
            { value: '双城-1期奶厅', label: '双城-1期奶厅' },
            { value: '双城-2期奶厅', label: '双城-2期奶厅' },
          ]}
          style={{ width: 150 }}
        />
        <RangePicker
          value={dateRange}
          onChange={(dates) => { setDateRange(dates as DateRange); setCurrentPage(1) }}
        />
        <div className={styles['export-buttons']}>
          <Button
            icon={<DownloadOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchExport}
          >
            导出 ({selectedRowKeys.length})
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ background: '#1890ff' }}
            onClick={handleExportAll}
          >
            导出全部
          </Button>
        </div>
      </div>
      <div className={styles['data-table']}>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredRecords.length,
            onChange: (page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            },
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </div>
    </div>
  )
}
