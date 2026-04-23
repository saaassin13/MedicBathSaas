import ReactECharts from 'echarts-for-react'

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
  const option = {
    title: { text: title, left: 0, top: 0, textStyle: { fontSize: 14, fontWeight: 500 } },
    tooltip: { trigger: 'axis' },
    legend: { show: false },
    grid: { left: 50, right: 50, bottom: 30, top: 40 },
    xAxis: {
      type: 'category',
      data: barData.map((d) => d.date),
    },
    yAxis: [
      {
        type: 'value',
        name: leftUnit,
        max: leftMax,
        axisLabel: { formatter: `{value}` },
      },
      {
        type: 'value',
        name: rightUnit,
        max: rightMax,
        axisLabel: { formatter: `{value}` },
      },
    ],
    series: [
      {
        name: '柱状',
        type: 'bar',
        data: barData.map((d) => d.value),
        itemStyle: { color: barColor },
      },
      {
        name: '折线',
        type: 'line',
        yAxisIndex: 1,
        data: lineData.map((d) => d.value),
        itemStyle: { color: lineColor },
        smooth: true,
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 300 }} />
}
