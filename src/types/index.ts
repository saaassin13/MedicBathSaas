// 用户相关类型
export interface User {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  department: string
  status: 'enabled' | 'disabled'
  permissions: PermissionNode[]
  createdAt: string
}

export interface PermissionNode {
  key: string
  title: string
  children?: PermissionNode[]
}

// 监控相关类型
export interface MonitorCard {
  id: string
  location: {
    group: string
    region: string
    farm: string
    milkingHall: string
    equipment: string
    process: string
    viewType: string
  }
  status: 'normal' | 'error' | 'stopped'
  thumbnail: string
}

// 维保相关类型
export interface MaintenancePlan {
  id: string
  serialNumber: number
  content: string
  cycleHours: number
  lastMaintenanceTime: string
}

export interface MaintenanceRecord {
  id: string
  timestamp: string
  status: 'completed'
  content: string
  category: '维保任务'
  hallId: string
}

// 故障日志相关类型
export type LogLevel = 'info' | 'warning' | 'error'

export interface FaultLog {
  id: string
  timestamp: string
  level: LogLevel
  content: string
  hallId: string
}

// 统计数据类型
export interface KpiData {
  cowCount: number
  recognitionRate: number
  solutionUsage: number
  solutionAvgPerCow: number
}

export interface HistoryRecord {
  id: string
  hall: string
  startTime: string
  endTime: string
  duration: string
  recognizedCows: number
  recognizedNipples: number
  unrecognizedNipples: number
  recognitionRate: number
  recognizedCowCount: number
  notCupRemoved: number
  antiFadeChain: number
  narrowCowLeg: number
  abnormalSkip: number
  missedSprayCows: number
}
