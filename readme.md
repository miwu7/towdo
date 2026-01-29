1. 角色设定
你是一位顶级全栈工程师和 UI/UX 设计专家，擅长“压迫感排版（Aggressive Typography）”和现代极简主义设计。你的目标是基于 React +Electron和Tailwind CSS 开发一款Mac+windows双端，名为 TowDo 的待办事项的桌面应用。

2. 视觉哲学 (Visual Philosophy)
原型在根目录，文件名叫PM.jsx，只可以参考原型来开发，不可以修改原型本身代码！！！
色彩主题：皇家紫（Royal Violet）。使用 violet-600 为动作色，violet-50 为背景色，配合 zinc-900 的超粗体文字。

排版风格：

标题采用极大的负间距（Negative Tracking），字重为 900。

强调对比：极大的标题与极小的、全大写的、加宽字间距的副标题（Uppercase Tracking Widest）形成强烈对比。

材质：大量使用玻璃拟态（Glassmorphism）、巨大的圆角（容器 40px+）、以及深邃的投影（Shadow-2xl）。

3. 技术栈要求
框架：React (Hooks 模式)

样式：Tailwind CSS

图标：Lucide-react

状态管理：本地持久化（localStorage），未来需预留 Firestore 接口。

动画：使用 Tailwind 原生动画类（animate-in, fade-in, slide-in-from-bottom 等）。

4. 核心功能实现清单
A. 智能多视图系统
今日焦点 (List View)：

展示巨大的日期标题。

任务卡片：悬停时向右微移并产生深度投影。

点击 Checkbox 触发缩放回弹动画，任务进入完成态（置底、灰色、删除线）。

看板管理 (Kanban View)：

三栏布局：待处理、进行中、已完成。

每一栏顶部显示任务统计计数器。

日程安排 (Calendar View)：

7列网格布局。

自动标记“今天”的高亮状态（紫色背景 + 投影）。

单元格内简洁展示前 3 条任务摘要。

B. 清单管理
侧边栏支持动态创建和删除“自定义清单”。

清单项显示未完成任务数量的 Badge。

删除清单时需同步处理该清单下的所有任务。

C. 交互组件
快速添加 (Quick Add)：按下 + 号或快捷键，弹出全屏模糊的 Modal，聚焦于一个巨大的无边框输入框。

侧边栏：毛玻璃材质，支持 Active 状态的平移动画。

5. 交互规范 (Micro-interactions)
滚动条：全应用隐藏原生滚动条。

反馈：所有按钮点击必须有缩放反馈（active:scale-95）。

加载：切换视图时必须有优雅的平滑淡入效果。

6. 初始数据模型 (Schema)
JavaScript
{
  id: number,
  title: string,
  date: string,
  priority: 'high' | 'medium' | 'low',
  completed: boolean,
  listId: string,
  status: 'todo' | 'doing' | 'done',
  desc: string
}
7. 开发要求
请先构建核心布局骨架（Sidebar + Main Panel），然后实现视图切换逻辑，最后完善任务的 CRUD（增删改查）和本地存储功能。代码必须整洁、模块化，并包含详尽的中文注释。