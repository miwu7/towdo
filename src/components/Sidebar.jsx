import React from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Hash,
  Layout,
  Plus,
  Settings,
  Trash2,
  Zap,
} from 'lucide-react';

const SidebarItem = ({ id, icon: Icon, label, badge, isActive, onClick, onDelete }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group active:scale-95 ${
      isActive
        ? 'bg-[#8c397d] text-white shadow-xl shadow-[#8c397d]/30 translate-x-1'
        : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-800'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} strokeWidth={isActive ? 3 : 2} />
      <span className="truncate max-w-[140px] tracking-tight">{label}</span>
    </div>
    <div className="flex items-center">
      {badge !== undefined && !onDelete && (
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-500'
          }`}
        >
          {badge}
        </span>
      )}
      {onDelete && !isActive && (
        <Trash2
          size={14}
          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer ml-2"
          onClick={(e) => onDelete(e, id)}
        />
      )}
    </div>
  </button>
);

// 侧边栏：智能视图 + 自定义清单
const Sidebar = ({
  activeTab,
  onChangeTab,
  onOpenNewList,
  lists,
  tasks,
  onDeleteList,
}) => {
  const smartViews = [
    { id: 'list', label: '今日待办', icon: Zap },
    { id: 'calendar', label: '日程安排', icon: CalendarIcon },
    { id: 'kanban', label: '看板管理', icon: Layout },
  ];

  return (
    <aside className="w-60 lg:w-72 bg-white/90 backdrop-blur-3xl border-r border-[#eddde9] flex flex-col h-full z-10">
      <div
        className="p-6 lg:p-10 flex items-center gap-3 lg:gap-4"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#8c397d] rounded-[14px] flex items-center justify-center shadow-2xl shadow-[#8c397d]/40 rotate-3">
          <CheckCircle2 className="text-white w-7 h-7" strokeWidth={3} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#8c397d] font-black">TwoDo</p>
          <h1 className="font-[900] text-xl lg:text-2xl tracking-[-0.06em]">TwoDo</h1>
        </div>
      </div>

      <div className="flex-1 px-4 lg:px-6 space-y-6 lg:space-y-8 overflow-y-auto no-scrollbar">
        <section>
          <p className="px-5 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">智能视图</p>
          <nav className="space-y-1.5">
            {smartViews.map((view) => (
              <SidebarItem
                key={view.id}
                id={view.id}
                icon={view.icon}
                label={view.label}
                badge={view.id === 'list' ? tasks.filter((t) => !t.completed).length : undefined}
                isActive={activeTab === view.id}
                onClick={onChangeTab}
              />
            ))}
          </nav>
        </section>

        <section>
          <div className="px-5 mb-4 flex items-center justify-between">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">分类清单</p>
            <button
              onClick={onOpenNewList}
              className="p-1.5 hover:bg-zinc-200 rounded-xl transition-all text-zinc-400 hover:text-[#8c397d] active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
          <nav className="space-y-1.5">
            {lists.map((list) => (
              <SidebarItem
                key={list.id}
                id={list.id}
                icon={Hash}
                label={list.name}
                badge={tasks.filter((t) => t.listId === list.id && !t.completed).length}
                isActive={activeTab === list.id}
                onClick={onChangeTab}
                onDelete={list.locked ? null : onDeleteList}
              />
            ))}
          </nav>
        </section>

        <section>
          <p className="px-5 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">设置</p>
          <nav className="space-y-1.5">
            <SidebarItem
              id="settings"
              icon={Settings}
              label="功能设置"
              isActive={activeTab === 'settings'}
              onClick={onChangeTab}
            />
          </nav>
        </section>
      </div>

      <div className="p-6 lg:p-8"></div>
    </aside>
  );
};

export default Sidebar;
