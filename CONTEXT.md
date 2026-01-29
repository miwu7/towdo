# TwoDo 项目上下文摘要

## 项目目标与设计规范
- 技术栈：React (Hooks) + Electron + Tailwind CSS + Lucide-react。
- 视觉风格：强烈排版对比、玻璃拟态、超大圆角、深邃阴影。
- 主色已统一为 `#8c397d`；浅背景为 `#f7f1f8`。
- 字体：西文/数字 Inter，中文 Noto Sans SC。
- 交互：按钮 active 缩放、切换视图淡入、滚动条隐藏。
- 组件需自适应，最小窗口为 1024×700。

## 入口与核心文件
- 主应用：`src/App.jsx`
- Sidebar：`src/components/Sidebar.jsx`
- List：`src/components/ListView.jsx`
- Kanban：`src/components/KanbanView.jsx`
- Calendar：`src/components/CalendarView.jsx`
- 日程弹窗：`src/components/CalendarDayModal.jsx`
- 任务详情弹窗：`src/components/TaskDetailModal.jsx`
- 快速添加弹窗：`src/components/QuickAddModal.jsx`
- 设置页：`src/components/SettingsView.jsx`
- 小组件视图：`src/components/WidgetView.jsx`
- Electron 主进程：`electron/main.cjs`
- Preload：`electron/preload.cjs`

## 已实现功能
- Sidebar + Main 布局骨架。
- 视图切换：今日待办 / 日程安排 / 看板管理 / 设置。
- 任务 CRUD + localStorage 持久化。
- 看板拖拽改状态；列内“+”触发快速添加。
- 日历 6x7 网格；当日高亮；点击日期弹出当日任务列表。
- 日历任务超过 2 条显示“···”。
- 节假日/节气显示（仅 2026 内置）：
  - 节假日颜色 `#8c397d`
  - 节气颜色 `#1c8d41`
- 快捷键：
  - Cmd/Ctrl + K：回到“今日待办”
  - N：快速新建（已 preventDefault）
  - Alt + O：切换“逾期过滤”
- “今日待办”仅显示当日任务，可包含逾期未完成（开关可切）。
- 所有弹窗支持 ESC 关闭。

## 系统集成（Electron）
- 开机自启：已接入 `app.setLoginItemSettings`。
- 托盘运行：关闭窗口隐藏到托盘。
- 全局快捷键：Alt + Space 唤起并打开快速添加。
- 原生通知：逾期提醒。
- 跨平台小组件替代：Always-on-top 小窗（通过 `?widget=1` 渲染）。

## 主题色替换说明
- 原 `violet-*` 已整体替换为主色 `#8c397d` 及相关浅色。
- Electron 窗口背景与 HTML body 背景同步为 `#f7f1f8`。

## 已知注意事项
- 节假日/节气数据仅覆盖 2026 年，需要扩展年份。
- “磁贴/小组件”目前为 Electron 小窗替代，并非系统原生 Widget。

## 构建与打包
- dev：`npm run dev`
- build：`npm run build`
- dist：`npm run dist`

## 最近修改偏好
- “今日焦点”已更名为“今日待办”。
- 删除左下角“桌面专业版”。
- 顶部菜单栏隐藏（Windows/Linux）。

---
此文件用于新会话快速恢复上下文。
