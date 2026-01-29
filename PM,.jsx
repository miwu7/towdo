import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Layout, 
  List, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Hash, 
  GripVertical, 
  Trash2,
  Sparkles,
  Zap
} from 'lucide-react';

const App = () => {
  // --- 状态初始化 ---
  const [activeTab, setActiveTab] = useState('list'); 
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  const initialTasks = [
    { id: 1, title: '重构系统底层动画引擎', date: '1月20日', priority: 'high', completed: false, listId: 'list_1', desc: '处理 120Hz 刷新率同步', status: 'todo' },
    { id: 2, title: '紫色主题视觉规范建立', date: '1月21日', priority: 'medium', completed: false, listId: 'list_2', desc: '定义深紫到亮紫的渐变色阶', status: 'doing' },
    { id: 3, title: '购买新的工作站设备', date: '1月24日', priority: 'low', completed: true, listId: 'list_3', desc: 'Mac Studio 配置确认', status: 'done' },
    { id: 4, title: '看板模式高级排版优化', date: '1月20日', priority: 'high', completed: false, listId: 'list_2', desc: '处理拖拽反馈和分栏材质', status: 'todo' },
  ];

  const initialLists = [
    { id: 'list_1', name: '系统开发' },
    { id: 'list_2', name: '视觉设计' },
    { id: 'list_3', name: '个人生活' },
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('puretask_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [customLists, setCustomLists] = useState(() => {
    const saved = localStorage.getItem('puretask_lists');
    return saved ? JSON.parse(saved) : initialLists;
  });

  useEffect(() => {
    localStorage.setItem('puretask_tasks', JSON.stringify(tasks));
    localStorage.setItem('puretask_lists', JSON.stringify(customLists));
  }, [tasks, customLists]);

  // --- 逻辑辅助 ---
  const smartViews = ['list', 'calendar', 'kanban'];

  const getFilteredTasks = () => {
    if (activeTab === 'list') return tasks;
    if (activeTab === 'calendar' || activeTab === 'kanban') return tasks; 
    return tasks.filter(t => t.listId === activeTab);
  };

  const filteredTasks = getFilteredTasks();

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'done' : 'todo' } : t));
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    const newList = { id: `list_${Date.now()}`, name: newListName };
    setCustomLists([...customLists, newList]);
    setNewListName("");
    setShowNewListModal(false);
    setActiveTab(newList.id);
  };

  const handleDeleteList = (e, id) => {
    e.stopPropagation();
    if (customLists.length <= 1) return;
    setCustomLists(customLists.filter(l => l.id !== id));
    setTasks(tasks.filter(t => t.listId !== id));
    if (activeTab === id) setActiveTab('list');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const currentListId = smartViews.includes(activeTab) ? customLists[0].id : activeTab;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      date: '1月20日',
      priority: 'medium',
      completed: false,
      listId: currentListId,
      desc: '',
      status: 'todo'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setShowQuickAdd(false);
  };

  // --- 子组件 ---

  const SidebarItem = ({ id, icon: Icon, label, badge, onDelete }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
        activeTab === id 
        ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/30 translate-x-1' 
        : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={activeTab === id ? 3 : 2} />
        <span className="truncate max-w-[120px] tracking-tight">{label}</span>
      </div>
      <div className="flex items-center">
        {badge !== undefined && !onDelete && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
            {badge}
          </span>
        )}
        {onDelete && activeTab !== id && (
          <Trash2 size={14} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer ml-2" onClick={(e) => onDelete(e, id)} />
        )}
      </div>
    </button>
  );

  const KanbanCard = ({ task }) => (
    <div className="group bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
          task.priority === 'high' ? 'bg-red-50 text-red-500' : 
          task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-violet-50 text-violet-500'
        }`}>
          {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Low'}
        </span>
        <GripVertical size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h4 className="font-black text-base leading-tight text-zinc-800 mb-4 tracking-tight">{task.title}</h4>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <Clock size={12} /> {task.date}
        </div>
        <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center text-[8px] font-black text-violet-600">PT</div>
      </div>
    </div>
  );

  const KanbanColumn = ({ title, status, color }) => (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-zinc-50/50 rounded-[40px] p-5 border border-zinc-100/50">
      <div className="px-3 py-2 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">{title}</h3>
          <span className="text-[10px] font-black bg-white shadow-sm text-zinc-500 px-2 py-0.5 rounded-lg ml-1">
            {tasks.filter(t => t.status === status).length}
          </span>
        </div>
        <Plus size={16} className="text-zinc-300 hover:text-violet-600 cursor-pointer transition-colors" />
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-1">
        {tasks.filter(t => t.status === status).map(task => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  // --- 主渲染 ---

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F3FF] text-zinc-900 selection:bg-violet-100">
      
      {/* 侧边栏 */}
      <aside className="w-72 bg-white/90 backdrop-blur-3xl border-r border-violet-100 flex flex-col h-full z-10">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-600 rounded-[14px] flex items-center justify-center shadow-2xl shadow-violet-500/40 rotate-3">
            <CheckCircle2 className="text-white w-7 h-7" strokeWidth={3} />
          </div>
          <h1 className="font-[900] text-2xl tracking-[-0.06em]">PureTask</h1>
        </div>
        
        <div className="flex-1 px-6 space-y-8 overflow-y-auto no-scrollbar">
          <section>
            <p className="px-5 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">智能视图</p>
            <nav className="space-y-1.5">
              <SidebarItem id="list" icon={Zap} label="今日焦点" badge={tasks.filter(t => !t.completed).length} />
              <SidebarItem id="calendar" icon={CalendarIcon} label="日程安排" />
              <SidebarItem id="kanban" icon={Layout} label="看板管理" />
            </nav>
          </section>

          <section>
            <div className="px-5 mb-4 flex items-center justify-between">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">分类清单</p>
              <button onClick={() => setShowNewListModal(true)} className="p-1.5 hover:bg-zinc-200 rounded-xl transition-all text-zinc-400 hover:text-violet-600">
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <nav className="space-y-1.5">
              {customLists.map(list => (
                <SidebarItem 
                  key={list.id} 
                  id={list.id} 
                  icon={Hash} 
                  label={list.name} 
                  badge={tasks.filter(t => t.listId === list.id && !t.completed).length}
                  onDelete={handleDeleteList}
                />
              ))}
            </nav>
          </section>
        </div>

        <div className="p-8">
          <div className="bg-violet-50 rounded-[24px] p-5 border border-violet-100 shadow-sm">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-400 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-violet-500/20">PT</div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black text-xs truncate text-violet-900">桌面专业版</p>
                <p className="text-[9px] text-violet-400 font-bold uppercase tracking-widest">Local Session</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* 主面板 */}
      <main className="flex-1 flex flex-col relative bg-white overflow-hidden">
        
        {/* VIEW 1: LIST */}
        {(activeTab === 'list' || !smartViews.includes(activeTab)) && (
          <div className="flex-1 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto py-24 px-12">
              <header className="mb-20">
                <div className="flex items-center gap-2 text-violet-600 font-black text-xs mb-4 uppercase tracking-[0.2em]">
                   <Sparkles size={14} /> {activeTab === 'list' ? 'Performance Focus' : 'Category view'}
                </div>
                <h2 className="text-7xl font-[900] tracking-[-0.06em] leading-[0.9] text-zinc-900">
                  {activeTab === 'list' ? '今日焦点' : customLists.find(l => l.id === activeTab)?.name}
                </h2>
                <p className="mt-6 text-zinc-400 font-bold text-xl tracking-tight">你有 {filteredTasks.filter(t => !t.completed).length} 个待办事项需要处理。</p>
              </header>

              <div className="space-y-4">
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group flex items-center gap-6 p-7 bg-white border-2 transition-all duration-300 rounded-[32px] cursor-pointer ${
                      task.completed ? 'border-transparent bg-zinc-50/50 opacity-60 shadow-none scale-[0.98]' : 'border-zinc-50 hover:border-violet-500/20 shadow-sm hover:shadow-2xl hover:shadow-violet-500/5 hover:-translate-y-1'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`transition-all duration-500 ${task.completed ? 'text-violet-600 scale-110' : 'text-zinc-200 group-hover:text-violet-400'}`}>
                      {task.completed ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <Circle size={32} strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-black text-xl tracking-tight transition-all ${task.completed ? 'line-through text-zinc-400 font-bold' : 'text-zinc-800'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl ${
                          task.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-violet-50 text-violet-500'
                        }`}>
                          {task.priority === 'high' ? 'Urgent' : 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 mt-1">
                        <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                          <Hash size={12}/> {customLists.find(l => l.id === task.listId)?.name}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                          <Clock size={12}/> {task.date}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-32 text-center border-4 border-dashed border-violet-50 rounded-[60px]">
                    <p className="text-violet-200 font-[900] tracking-[0.2em] uppercase text-sm">开始记录你的伟大想法</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: KANBAN */}
        {activeTab === 'kanban' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="px-12 py-12 flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-[900] tracking-[-0.06em]">看板管理</h2>
                <p className="text-zinc-400 font-bold mt-2 uppercase tracking-widest text-xs">Visual Workflow Management</p>
              </div>
            </header>
            <div className="flex-1 overflow-x-auto no-scrollbar px-12 pb-12 flex gap-8">
              <KanbanColumn title="待处理" status="todo" color="bg-red-400" />
              <KanbanColumn title="进行中" status="doing" color="bg-amber-400" />
              <KanbanColumn title="已完成" status="done" color="bg-violet-400" />
            </div>
          </div>
        )}

        {/* VIEW 3: CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="px-12 py-10 flex justify-between items-center border-b border-zinc-50">
              <div className="flex items-center gap-8">
                <h2 className="text-5xl font-[900] tracking-[-0.06em]">2026年 1月</h2>
                <div className="flex bg-zinc-100 p-1.5 rounded-[20px]">
                  <button className="p-2.5 hover:bg-white rounded-xl shadow-sm transition-all"><ChevronLeft size={18} strokeWidth={3}/></button>
                  <button className="px-6 py-1 text-xs font-[900] uppercase tracking-widest text-zinc-500 hover:text-violet-600 transition-colors">Today</button>
                  <button className="p-2.5 hover:bg-white rounded-xl shadow-sm transition-all"><ChevronRight size={18} strokeWidth={3}/></button>
                </div>
              </div>
            </header>
            
            <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-zinc-50 gap-px overflow-y-auto no-scrollbar">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="bg-white p-6 text-[10px] font-[900] uppercase tracking-[0.2em] text-zinc-300 text-center">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3; 
                const isToday = day === 20;
                const tasksThisDay = day > 0 && day <= 31 ? tasks.filter(t => t.date.includes(day + '日')) : [];
                
                return (
                  <div key={i} className={`bg-white p-5 min-h-[160px] hover:bg-violet-50/30 transition-all duration-300 border-t border-zinc-50 ${day < 1 || day > 31 ? 'opacity-20' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-sm font-black w-9 h-9 flex items-center justify-center rounded-[14px] ${isToday ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/40' : 'text-zinc-400'}`}>
                        {day < 1 ? 30 + day : day > 31 ? day - 31 : day}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {tasksThisDay.slice(0, 3).map(t => (
                        <div key={t.id} className="px-3 py-1.5 bg-violet-50 border-l-[3px] border-violet-600 rounded-lg text-[10px] font-black text-violet-700 truncate tracking-tight">
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 悬浮添加按钮 */}
        <button 
          onClick={() => setShowQuickAdd(true)}
          className="absolute bottom-12 right-12 w-20 h-20 bg-violet-600 text-white rounded-[28px] shadow-[0_25px_50px_-12px_rgba(124,58,237,0.5)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20"
        >
          <Plus size={36} strokeWidth={4} />
        </button>
      </main>

      {/* 弹窗：新建清单 */}
      {showNewListModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowNewListModal(false)}>
          <div className="w-[450px] bg-white rounded-[40px] p-12 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-[900] mb-8 tracking-tighter text-violet-900">新建分类</h3>
            <input 
              autoFocus
              className="w-full bg-violet-50 border-none outline-none px-8 py-6 rounded-[24px] font-black text-lg mb-8 placeholder-violet-200 text-violet-900"
              placeholder="清单名称..."
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddList()}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowNewListModal(false)} className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors">取消</button>
              <button onClick={handleAddList} className="flex-[2] py-5 bg-violet-600 text-white rounded-[24px] text-sm font-black shadow-2xl shadow-violet-500/20">创建分类</button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗：快速添加任务 */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-violet-900/20 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowQuickAdd(false)}>
          <div className="w-[700px] bg-white rounded-[48px] p-14 shadow-2xl animate-in slide-in-from-bottom-12 duration-500" onClick={e => e.stopPropagation()}>
            <input 
              autoFocus
              className="w-full bg-transparent border-none outline-none text-5xl font-[900] mb-12 text-zinc-900 tracking-[-0.06em] placeholder-zinc-100"
              placeholder="添加新任务..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <div className="flex justify-between items-center border-t border-zinc-50 pt-10">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-violet-50 rounded-2xl text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">
                <Hash size={14} strokeWidth={3}/> {smartViews.includes(activeTab) ? customLists[0].name : customLists.find(l => l.id === activeTab)?.name}
              </div>
              <div className="flex gap-6 items-center">
                <button onClick={() => setShowQuickAdd(false)} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800">放弃</button>
                <button onClick={handleAddTask} className="px-12 py-5 rounded-[24px] bg-violet-600 text-white text-sm font-black shadow-2xl shadow-violet-500/30">立即保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;