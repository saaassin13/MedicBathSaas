import { useState } from 'react'
import KpiCards from './KpiCards'
import TrendChart from './TrendChart'
import DonutChart from './DonutChart'
import DetailTable from './DetailTable'
import StatusSidebar from './StatusSidebar'
import Cascader from '../../components/common/Cascader'
import { KpiData } from '../../types'
import styles from './Statistics.module.css'

// 模拟数据
const mockKpiData: KpiData = {
  cowCount: 425,
  recognitionRate: 98.64,
  solutionUsage: 145.15,
  solutionAvgPerCow: 10.97,
}

const mockTrendData = {
  cowTrend: Array.from({ length: 29 }, (_, i) => ({ date: `4/${i + 1}`, value: Math.floor(Math.random() * 8000 + 2000) })),
  recognitionTrend: Array.from({ length: 29 }, (_, i) => ({ date: `4/${i + 1}`, value: 95 + Math.random() * 5 })),
  usageTrend: Array.from({ length: 29 }, (_, i) => ({ date: `4/${i + 1}`, value: Math.floor(Math.random() * 250 + 50) })),
  avgTrend: Array.from({ length: 29 }, (_, i) => ({ date: `4/${i + 1}`, value: 10 + Math.random() * 5 })),
}

const mockDonutData = {
  total: 140,
  categories: [
    { name: '未脱杯', count: 50, percentage: '35%' },
    { name: '防褪链', count: 40, percentage: '26%' },
    { name: '牛腿过窄', count: 20, percentage: '15%' },
    { name: '异常跳过', count: 15, percentage: '10%' },
  ],
}

const deviceStatus = [
  { name: '药浴', status: 'warning' as const },
  { name: '相机', status: 'normal' as const },
  { name: '机器人', status: 'error' as const },
  { name: '光源', status: 'error' as const },
  { name: '图像质量', status: 'normal' as const },
]

const maintenanceStatus = [
  { name: '喷枪固定螺栓', status: 'normal' as const },
  { name: '喷头更换', status: 'normal' as const },
  { name: '跟随编码器更换', status: 'normal' as const },
  { name: '喷头清洗', status: 'expired' as const },
]

const runtimeStats = {
  total: '3649天23小时59分',
  shift: '02小时21分钟49秒',
}

// 详细表格模拟数据
const mockDetailData = [
  { id: '1', startTime: '2026-04-22 08:00', endTime: '2026-04-22 12:00', duration: '04:00:00', recognizedCows: 120, recognizedNipples: 480, unrecognizedNipples: 10, recognitionRate: 97.85, recognizedCowCount: 118, notCupRemoved: 5 },
  { id: '2', startTime: '2026-04-22 14:00', endTime: '2026-04-22 18:00', duration: '04:00:00', recognizedCows: 115, recognizedNipples: 460, unrecognizedNipples: 12, recognitionRate: 97.45, recognizedCowCount: 113, notCupRemoved: 4 },
]

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

export default function StatisticsPage() {
  const [selectedHall, setSelectedHall] = useState<string[]>([])

  return (
    <div className={styles['statistics-page']}>
      {/* 页面标题行 */}
      <div className={styles['page-header']}>
        <h2>数据统计分析</h2>
        <Cascader
          options={hallOptions}
          mode="single"
          placeholder="选择奶厅"
          value={selectedHall}
          onChange={(values) => setSelectedHall(values)}
          width={200}
        />
      </div>

      {/* 主网格布局 */}
      <div className={styles['main-grid']}>
        {/* 第一行：KPI */}
        <div className={styles['kpi-area']}>
          <KpiCards data={mockKpiData} />
        </div>

        {/* 第一二行右侧：设备状态 - 跨越两行 */}
        <div className={styles['status-area']}>
          <StatusSidebar
            deviceStatus={deviceStatus}
            maintenanceStatus={maintenanceStatus}
            runtimeStats={runtimeStats}
          />
        </div>

        {/* 第二行：图表 */}
        <div className={styles['chart-area']}>
          <div className={styles['chart-card']}>
            <TrendChart
              title="药浴牛数/识别率统计分析"
              barData={mockTrendData.cowTrend}
              lineData={mockTrendData.recognitionTrend}
              barColor="#1890ff"
              lineColor="#ff8c00"
              leftUnit="牛数"
              rightUnit="%"
              leftMax={10000}
              rightMax={100}
            />
          </div>
          <div className={styles['chart-card']}>
            <TrendChart
              title="药液用量/均量统计分析"
              barData={mockTrendData.usageTrend}
              lineData={mockTrendData.avgTrend}
              barColor="#52c41a"
              lineColor="#722ed1"
              leftUnit="L"
              rightUnit="ML"
              leftMax={300}
              rightMax={20}
            />
          </div>
        </div>

        {/* 第三行：环形图和表格 */}
        <div className={styles['detail-area']}>
          <div className={styles['donut-card']}>
            <DonutChart data={mockDonutData} />
          </div>
          <div className={styles['table-card']}>
            <h4 className={styles['card-title']}>详细列表统计</h4>
            <DetailTable data={mockDetailData} />
          </div>
        </div>
      </div>
    </div>
  )
}
