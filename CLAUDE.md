# 奶牛药浴大数据管理中心 - 前端架构文档

**项目**：yaoyu
**前端框架**：React 18 + TypeScript
**状态管理**：React Router v6（路由）、React State（组件状态）
**UI库**：Ant Design 5
**图表库**：ECharts (echarts-for-react)
**样式**：CSS Module

---

## 1. 项目结构

```
src/
├── components/
│   ├── common/
│   │   ├── Cascader.tsx      # 五级级联选择器
│   │   ├── Cascader.module.css
│   │   └── FormInput.tsx     # 表单输入组件
│   └── Layout/
│       ├── MainLayout.tsx     # 主布局（侧边栏+内容区）
│       ├── Header.tsx         # 顶部导航栏
│       ├── Sidebar.tsx        # 左侧导航菜单
│       └── Layout.module.css
├── pages/
│   ├── Login/
│   │   ├── LoginPage.tsx      # 登录页
│   │   └── LoginForm.tsx      # 登录表单
│   ├── Monitoring/
│   │   ├── MonitoringPage.tsx  # 奶厅作业监控主页
│   │   ├── MonitorGrid.tsx     # 监控卡片网格
│   │   └── MonitorCard.tsx     # 单个监控卡片
│   ├── Statistics/
│   │   ├── StatisticsPage.tsx          # 当班数据统计
│   │   ├── HistoryStatisticsPage.tsx   # 历史数据统计
│   │   ├── KpiCards.tsx               # KPI指标卡片组
│   │   ├── TrendChart.tsx             # 双轴趋势图表
│   │   ├── DonutChart.tsx             # 环形图
│   │   ├── DetailTable.tsx            # 详细数据表格
│   │   ├── StatusSidebar.tsx          # 设备状态侧边栏
│   │   └── Statistics.module.css
│   ├── Maintenance/
│   │   ├── MaintenancePlanPage.tsx    # 维保计划
│   │   └── MaintenanceRecordPage.tsx   # 维保记录
│   ├── FaultLog/
│   │   └── FaultLogPage.tsx           # 故障日志
│   └── UserManagement/
│       ├── UserManagePage.tsx          # 用户管理列表
│       └── UserModal.tsx               # 用户新增/编辑弹窗
├── types/
│   └── index.ts                       # 所有数据类型定义
├── App.tsx                            # 路由配置
└── main.tsx                           # 应用入口
```

---

## 2. 路由结构

| 路径 | 页面 | 布局 |
|------|------|------|
| `/login` | 登录页 | 无 |
| `/monitoring` | 奶厅作业监控 | MainLayout |
| `/statistics/current` | 当班数据统计 | MainLayout |
| `/statistics/history` | 历史数据统计 | MainLayout |
| `/maintenance/plan` | 维保计划 | MainLayout |
| `/maintenance/record` | 维保记录 | MainLayout |
| `/fault-log` | 故障日志 | MainLayout |
| `/user-management` | 用户管理 | MainLayout |

---

## 3. 数据结构（对接后端参考）

### 3.1 用户相关

```typescript
interface User {
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

interface PermissionNode {
  key: string
  title: string
  children?: PermissionNode[]
}

// 登录请求/响应
interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
}
```

### 3.2 奶厅级联结构

```typescript
// 五级级联数据（用于Cascader组件）
interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
}

// 完整路径示例：蒙牛集团 > 东北大区 > 双城牧场 > 1期奶厅 > 1号转盘 > 后药浴
```

### 3.3 监控相关

```typescript
interface MonitorCard {
  id: string
  location: {
    group: string       // 集团
    region: string       // 大区
    farm: string         // 牧场
    milkingHall: string  // 奶厅
    equipment: string    // 设备/转盘
    process: string      // 工序
    viewType: string     // 视角
  }
  status: 'normal' | 'error' | 'stopped'
  thumbnail: string      // 缩略图URL
}

// API: GET /api/monitoring/cards
// 响应: MonitorCard[]
```

### 3.4 维保相关

```typescript
interface MaintenancePlan {
  id: string
  serialNumber: number
  content: string        // 维保内容
  cycleHours: number      // 周期（小时）
  lastMaintenanceTime: string  // 上次维保时间
}

interface MaintenanceRecord {
  id: string
  timestamp: string      // 执行时间
  status: 'completed'
  content: string
  category: '维保任务'
  hallId: string         // 奶厅ID
}

// API:
// GET /api/maintenance/plans
// POST /api/maintenance/records
// GET /api/maintenance/records?hallId=xxx
```

### 3.5 故障日志

```typescript
type LogLevel = 'info' | 'warning' | 'error'

interface FaultLog {
  id: string
  timestamp: string
  level: LogLevel
  content: string
  hallId: string
}

// API: GET /api/fault-logs?hallId=xxx&level=error&startTime=xxx&endTime=xxx
```

### 3.6 统计数据

```typescript
interface KpiData {
  cowCount: number           // 当班药浴牛数
  recognitionRate: number    // 乳头识别率 (%)
  solutionUsage: number      // 药液用量 (L)
  solutionAvgPerCow: number  // 药液均量 (ML/头)
}

interface TrendPoint {
  date: string
  value: number
}

interface DonutData {
  total: number
  categories: {
    name: string
    count: number
    percentage: string
  }[]
}

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

interface DeviceStatus {
  name: string
  status: 'normal' | 'warning' | 'error'
}

interface MaintenanceStatus {
  name: string
  status: 'normal' | 'expired'
}

// API:
// GET /api/statistics/kpi?hallId=xxx
// GET /api/statistics/trend?hallId=xxx&type=cow|recognition|usage|avg
// GET /api/statistics/donut?hallId=xxx
// GET /api/statistics/detail?hallId=xxx&startTime=xxx&endTime=xxx
// GET /api/statistics/device-status?hallId=xxx
// GET /api/statistics/maintenance-status?hallId=xxx
```

### 3.7 历史统计数据

```typescript
interface HistoryRecord {
  id: string
  hall: string              // 奶厅完整路径
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

// API: GET /api/statistics/history?hallId=xxx&startTime=xxx&endTime=xxx&page=1&pageSize=20
// 响应: { records: HistoryRecord[], total: number }
```

---

## 4. API 接口约定

### 4.1 通用规范

- Base URL: `/api`
- 认证方式: Bearer Token（在请求头 `Authorization: Bearer <token>`）
- 数据格式: JSON
- 时间格式: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.SSSZ`) 或简化格式 (`YYYY-MM-DD HH:mm:ss`)

### 4.2 错误响应格式

```typescript
interface ApiError {
  code: string    // 错误码，如 "AUTH_TOKEN_EXPIRED"
  message: string // 错误信息
}
```

### 4.3 分页响应格式

```typescript
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

---

## 5. 已实现的功能模块

### 5.1 登录模块
- 用户名密码登录
- Token 存储（localStorage）
- 登录状态校验

### 5.2 奶厅作业监控
- 监控卡片网格展示
- 奶厅级联筛选
- 设备状态指示（normal/error/stopped）
- 缩略图展示

### 5.3 数据统计分析（当班）
- KPI 指标卡片（4个）
- 双轴趋势图表（柱状+折线）
- 环形图（识别率分析）
- 详细数据表格
- 设备状态侧边栏
- 维保状态侧边栏
- 运行时间统计
- 日期范围筛选（每个图表独立）

### 5.4 数据统计分析（历史）
- 历史数据表格
- 奶厅级联筛选
- 日期范围筛选
- 导出功能（单条/批量/全量）
- 分页组件

### 5.5 维保管理
- 维保计划列表
- 维保记录列表
- 新增维保记录

### 5.6 故障日志
- 日志列表展示
- 等级筛选（info/warning/error）
- 日期范围筛选

### 5.7 用户管理
- 用户列表展示
- 新增/编辑用户弹窗
- 用户启用/禁用

### 5.8 通用组件
- Cascader（五级级联选择器，支持单选/多选，搜索功能）
- FormInput（表单输入组件）

---

## 6. 待后端对接事项

1. **登录接口** - 实现 Token 认证
2. **奶厅级联数据** - 获取完整的奶厅结构数据
3. **监控卡片数据** - 实时获取监控状态
4. **统计数据接口** - KPI、趋势图、环形图、详细表格
5. **设备状态接口** - 实时设备状态
6. **维保接口** - 计划列表、记录新增/查询
7. **故障日志接口** - 日志查询
8. **用户管理接口** - CRUD 操作
9. **历史统计接口** - 分页查询、导出

---

## 7. 技术规范

### 7.1 代码规范
- 组件文件后缀：`.tsx`
- 样式文件后缀：`.module.css`
- 类型定义统一放在 `src/types/index.ts`

### 7.2 样式规范
- 使用 CSS Module 避免样式冲突
- 品牌色：`#FF8C00`（橙色）
- 页面背景：`#F5F5F5`
- 卡片背景：`#FFFFFF`

### 7.3 组件规范
- 组件 Props 接口以 `XxxProps` 命名
- 数据接口以 `XxxData` 或具体业务名命名
- 回调函数用 `on` 前缀（如 `onChange`）
