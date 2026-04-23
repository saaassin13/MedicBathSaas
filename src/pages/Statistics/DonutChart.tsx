import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import styles from './Statistics.module.css'

interface DonutData {
  total: number
  categories: { name: string; count: number; percentage: string }[]
}

interface DonutChartProps {
  data: DonutData
}

const categoryColors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f']

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

export default function DonutChart({ data }: DonutChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>(null)

  const option = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '50%'],
        label: { show: false },
        data: data.categories.map((c, i) => ({
          name: `${c.name} (${c.percentage})`,
          value: c.count,
          itemStyle: { color: categoryColors[i % categoryColors.length] },
        })),
      },
    ],
    graphic: [
      {
        type: 'text',
        left: '26%',
        top: '42%',
        style: {
          text: String(data.total),
          fill: '#333',
          fontSize: 24,
          fontWeight: 'bold',
        },
      },
      {
        type: 'text',
        left: '25%',
        top: '52%',
        style: {
          text: '总数',
          fill: '#999',
          fontSize: 12,
        },
      },
    ],
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>识别率与覆盖率分析</h4>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as DateRange)}
          size="small"
          style={{ width: 220 }}
        />
      </div>
      <div className={styles['chart-wrapper']} style={{ height: 220 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  )
}
