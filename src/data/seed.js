import { addDaysISO } from '../utils/date';

export const initialLists = [
  { id: 'list_1', name: '系统开发' },
  { id: 'list_2', name: '视觉设计' },
  { id: 'list_3', name: '个人生活' },
];

export const initialTasks = [
  {
    id: 1,
    title: '重构系统底层动画引擎',
    date: addDaysISO(0),
    priority: 'high',
    completed: false,
    listId: 'list_1',
    status: 'todo',
    desc: '处理 120Hz 刷新率同步与渲染稳定性。',
  },
  {
    id: 2,
    title: '紫色主题视觉规范建立',
    date: addDaysISO(1),
    priority: 'medium',
    completed: false,
    listId: 'list_2',
    status: 'doing',
    desc: '定义深紫到亮紫的渐变色阶。',
  },
  {
    id: 3,
    title: '购置新的工作站',
    date: addDaysISO(4),
    priority: 'low',
    completed: true,
    listId: 'list_3',
    status: 'done',
    desc: 'Mac Studio 配置确认与采购。',
  },
  {
    id: 4,
    title: '看板模式高级排版优化',
    date: addDaysISO(0),
    priority: 'high',
    completed: false,
    listId: 'list_2',
    status: 'todo',
    desc: '处理拖拽反馈与分栏材质。',
  },
];
