# TwoDo 项目上下文摘要

## 项目目标与设计规范
- 技术栈：React (Hooks) + Electron + Tailwind CSS + Lucide-react。
- 视觉风格：强烈排版对比、玻璃拟态、超大圆角、深邃阴影。
- 主色已统一为 `#8c397d`；浅背景为 `#f7f1f8`。
- 字体：西文/数字 Inter，中文 Noto Sans SC。
- 交互：按钮 active 缩放、切换视图淡入、滚动条隐藏。
- 组件需自适应，主界面最小窗口为 1024×700；迷你模式可缩窗。

## 入口与核心文件
- 主应用：`src/App.jsx`
- Sidebar：`src/components/Sidebar.jsx`
- List：`src/components/ListView.jsx`
- Kanban：`src/components/KanbanView.jsx`
- Calendar：`src/components/CalendarView.jsx`
- 日程弹窗：`src/components/CalendarDayModal.jsx`
- 任务详情弹窗：`src/components/TaskDetailModal.jsx`
- 快速添加弹窗：`src/components/QuickAddModal.jsx`
- 新建清单弹窗：`src/components/NewListModal.jsx`
- 设置页：`src/components/SettingsView.jsx`
- 迷你看板：`src/components/MiniModeView.jsx`
- 日期工具：`src/utils/date.js`
- 节假日/节气数据：`src/data/calendarLabels.js`
- Electron 主进程：`electron/main.cjs`
- Preload：`electron/preload.cjs`

## 已实现功能
- Sidebar + Main 布局骨架；智能视图 + 自定义清单；清单可新增/删除（系统/未归档不可删）。
- 视图切换：今日待办 / 日程安排 / 看板管理 / 设置 / 迷你看板。
- 任务 CRUD + localStorage 持久化；默认列表为系统级“未归档”。
- 看板拖拽改状态；列内“+”触发快速添加；任务详情支持改状态/日期/优先级/清单。
- 快速添加：主悬浮按钮/看板列内/快捷键 N；支持选择清单，按列进入可带状态。
- “今日待办”仅显示当日任务，可包含逾期未完成（开关可切）；Alt + O 切换逾期过滤。
- 自动延期：开启后，逾期未完成任务会在日期变更时自动顺延至今日。
- 完成音效：可开关的简短提示音。
- 日历 6x7 网格；周日开头；当日高亮；点击日期弹出当日任务列表。
- 日历任务以彩色条展示，最多显示 6 条，超出显示“···”；点击任务可切换完成；标题过长省略。
- 节假日/节气显示（仅 2026 内置）：
  - 节假日颜色 `#8c397d`
  - 节气颜色 `#1c8d41`
- 所有弹窗支持 ESC 关闭。
- 迷你看板模式（Mini Mode）：显示今日待办/今日已办（可折叠）/逾期未办；支持勾选完成与快速新增；可 Pin 置顶、手柄拖拽调整大小，尺寸持久化。
- 任务完成态降噪（整体透明/灰度）。
- 设置页提供：高对比度、字体渲染、开机自启、托盘运行、自动延期、完成音效、快捷键开关、数据导入/导出。

## 系统集成（Electron）
- 开机自启：已接入 `app.setLoginItemSettings`。
- 托盘运行：关闭窗口隐藏到托盘（托盘菜单支持打开/退出）。
- 应用内置最小化/最大化/关闭按钮（主窗口右上角），通过 preload IPC 控制。
- 迷你看板：主窗口进入 mini 模式后自动缩窗；Pin 可置顶（always-on-top）。
- 窗口已改为无标题栏（frameless），拖拽区在侧边栏品牌区与 Mini 模式标题区。
- 自动更新：集成 `electron-updater`，支持检查/下载/安装，设置页可手动触发，生产环境启动后会自动检查。

## 主题色替换说明
- 原 `violet-*` 已整体替换为主色 `#8c397d` 及相关浅色。
- Electron 窗口背景与 HTML body 背景同步为 `#f7f1f8`。

## 已知注意事项
- 节假日/节气数据仅覆盖 2026 年，需要扩展年份。
- “磁贴/小组件”功能已移除。
- 系统级“未归档”分类（不可删除），新增任务默认归入该分类。

## 构建与打包
- dev：`npm run dev`
- build：`npm run build`
- dist：`npm run dist`

## 版本发布（GitHub Actions + OSS）
> workflow 仅在 push tag `v*` 或手动触发时执行（见 `.github/workflows/build.yml`）。
- 示例（建议）：升版本 + 推送 + tag 触发
  - `npm version 0.1.3`
  - `git push origin main`
  - `git push origin v0.1.3`

## 最近修改偏好
- “今日焦点”已更名为“今日待办”。
- 删除左下角“桌面专业版”。
- 顶部菜单栏隐藏（Windows/Linux）。
- dev 启动脚本使用 `127.0.0.1` + `wait-on http-get` 防止 localhost 卡住。

---
此文件用于新会话快速恢复上下文。
