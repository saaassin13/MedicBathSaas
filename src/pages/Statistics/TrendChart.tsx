import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import styles from './Statistics.module.css'

interface TrendPoint {
  date: string
  value: number
}

interface TrendChartProps {
  title: string
  barData: TrendPoint[]
  lineData: TrendPoint[]
  barColor: string
  lineColor: string
  leftUnit: string
  rightUnit: string
  leftMax?: number
  rightMax?: number
}

const { RangePicker } = DatePicker
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null

// 数值超过1000时用1k表示
const formatValue = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  }
  return String(value)
}

export default function TrendChart({
  title,
  barData,
  lineData,
  barColor,
  lineColor,
  leftUnit,
  rightUnit,
  leftMax,
  rightMax,
}: TrendChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>(null)

  const filteredBarData = dateRange && dateRange[0] && dateRange[1]
    ? barData.filter((d) => {
        const date = dayjs(d.date)
        return !date.isBefore(dateRange[0]) && !date.isAfter(dateRange[1])
      })
    : barData

  const filteredLineData = dateRange && dateRange[0] && dateRange[1]
    ? lineData.filter((d) => {
        const date = dayjs(d.date)
        return !date.isBefore(dateRange[0]) && !date.isAfter(dateRange[1])
      })
    : lineData

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { show: false },
    grid: { left: 35, right: 35, bottom: 30, top: 15 },
    xAxis: {
      type: 'category',
      data: filteredBarData.map((d) => d.date),
    },
    yAxis: [
      {
        type: 'value',
        max: leftMax,
        axisLabel: { formatter: (value: number) => formatValue(value) },
      },
      {
        type: 'value',
        max: rightMax,
        axisLabel: { formatter: (value: number) => formatValue(value) },
      },
    ],
    series: [
      {
        name: '柱状',
        type: 'bar',
        data: filteredBarData.map((d) => d.value),
        itemStyle: { color: barColor },
      },
      {
        name: '折线',
        type: 'line',
        yAxisIndex: 1,
        data: filteredLineData.map((d) => d.value),
        itemStyle: { color: lineColor },
        smooth: true,
      },
    ],
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{title}</h4>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as DateRange)}
          size="small"
          style={{ width: 220 }}
        />
      </div>
      {/* 单位标签 - 向两侧对齐坐标轴 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 5, marginRight: 5, marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>{leftUnit}</span>
        <span style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>{rightUnit}</span>
      </div>
      <div className={styles['chart-wrapper']} style={{ height: 220 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  )
}
