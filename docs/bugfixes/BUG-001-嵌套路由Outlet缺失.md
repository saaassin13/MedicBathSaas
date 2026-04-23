# Bug #001：嵌套路由子页面不显示

**现象**：访问 `/maintenance/plan` 和 `/maintenance/record` 时只显示"设备维保信息占位"，实际页面内容不显示。

**根因**：在 React Router v6 嵌套路由中，父路由需要使用 `<Outlet />` 来渲染子路由内容。App.tsx 中 `/maintenance` 和 `/statistics` 父路由使用了 `<div>占位</div>` 而没有 `<Outlet />`。

```tsx
// 错误写法
<Route path="/maintenance" element={<MainLayout><div>占位</div></MainLayout>}>

// 正确写法
<Route path="/maintenance" element={<MainLayout><Outlet /></MainLayout>}>
```

**修复方案**：
1. 引入 `Outlet` 组件
2. 将父路由 element 中的占位 div 替换为 `<Outlet />`

**验证方法**：
- 访问 `/maintenance/plan` 显示维保计划页面
- 访问 `/maintenance/record` 显示维保记录页面
- 访问 `/statistics/current` 显示数据统计页面

**防止复发**：
- 后续创建嵌套路由时，父路由必须使用 `<Outlet />` 而非占位元素
- 可以在代码审查清单中添加此项检查
