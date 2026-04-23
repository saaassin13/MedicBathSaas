import ReactECharts from 'echarts-for-react'

interface DonutData {
  total: number
  categories: { name: string; count: number; percentage: string }[]
}

interface DonutChartProps {
  data: DonutData
}

const categoryColors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f']

export default function DonutChart({ data }: DonutChartProps) {
  const option = {
    title: { text: '识别率与覆盖率分析', left: 0, top: 0, textStyle: { fontSize: 14, fontWeight: 500 } },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 0, top: 'center' },
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
        top: '45%',
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
        top: '55%',
        style: {
          text: '总数',
          fill: '#999',
          fontSize: 12,
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 250 }} />
}
