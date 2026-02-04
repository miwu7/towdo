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

const SidebarItem = ({ id, icon: Icon, label, badge, isActive, onClick, onDelete, isCompact }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between transition-all duration-300 group active:scale-95 ${
      isCompact ? 'px-3.5 py-2 rounded-lg text-[12px]' : 'px-4 py-2.5 rounded-xl text-[13px]'
    } font-semibold ${
      isActive
        ? 'bg-[#8c397d] text-white shadow-lg shadow-[#8c397d]/25 translate-x-0.5'
        : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-800'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={isCompact ? 15 : 16} strokeWidth={isActive ? 2.5 : 2} />
      <span className="truncate max-w-[140px] tracking-tight">{label}</span>
    </div>
    <div className="flex items-center">
      {badge !== undefined && !onDelete && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-500'
          }`}
        >
          {badge}
        </span>
      )}
      {onDelete && !isActive && (
        <Trash2
          size={13}
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
  isCompact = false,
}) => {
  const smartViews = [
    { id: 'list', label: '今日待办', icon: Zap },
    { id: 'calendar', label: '日程安排', icon: CalendarIcon },
    { id: 'kanban', label: '看板管理', icon: Layout },
  ];

  return (
    <aside
      className={`bg-white/90 backdrop-blur-3xl border-r border-[#eddde9] flex flex-col h-full z-10 ${
        isCompact ? 'w-52 lg:w-56' : 'w-60 lg:w-64'
      }`}
    >
      <div
        className={`flex items-center gap-3 ${isCompact ? 'p-4 lg:p-5' : 'p-5 lg:p-6'}`}
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div
          className={`bg-[#8c397d] flex items-center justify-center shadow-xl shadow-[#8c397d]/30 rotate-3 ${
            isCompact ? 'w-8 h-8 rounded-[10px]' : 'w-9 h-9 lg:w-10 lg:h-10 rounded-[12px]'
          }`}
        >
          <CheckCircle2 className="text-white w-6 h-6" strokeWidth={3} />
        </div>
        <div>
          <p
            className={`uppercase text-[#8c397d] font-black ${
              isCompact ? 'text-[8px] tracking-[0.36em]' : 'text-[9px] tracking-[0.4em]'
            }`}
          >
            TwoDo
          </p>
          <h1 className={`font-[900] tracking-[-0.05em] ${isCompact ? 'text-base' : 'text-lg lg:text-xl'}`}>
            TwoDo
          </h1>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto no-scrollbar ${
          isCompact ? 'px-3.5 lg:px-4 space-y-4 lg:space-y-5' : 'px-4 lg:px-5 space-y-5 lg:space-y-6'
        }`}
      >
        <section>
          <p
            className={`mb-3 font-black text-zinc-400 uppercase ${
              isCompact ? 'px-3 text-[8px] tracking-[0.16em]' : 'px-4 text-[9px] tracking-[0.18em]'
            }`}
          >
            智能视图
          </p>
          <nav className={isCompact ? 'space-y-0.5' : 'space-y-1'}>
            {smartViews.map((view) => (
              <SidebarItem
                key={view.id}
                id={view.id}
                icon={view.icon}
                label={view.label}
                badge={view.id === 'list' ? tasks.filter((t) => !t.completed).length : undefined}
                isActive={activeTab === view.id}
                onClick={onChangeTab}
                isCompact={isCompact}
              />
            ))}
          </nav>
        </section>

        <section>
          <div className={`mb-3 flex items-center justify-between ${isCompact ? 'px-3' : 'px-4'}`}>
            <p
              className={`font-black text-zinc-400 uppercase ${
                isCompact ? 'text-[8px] tracking-[0.16em]' : 'text-[9px] tracking-[0.18em]'
              }`}
            >
              分类清单
            </p>
            <button
              onClick={onOpenNewList}
              className={`hover:bg-zinc-200 transition-all text-zinc-400 hover:text-[#8c397d] active:scale-95 ${
                isCompact ? 'p-1 rounded-md' : 'p-1.5 rounded-lg'
              }`}
            >
              <Plus size={isCompact ? 12 : 13} strokeWidth={3} />
            </button>
          </div>
          <nav className={isCompact ? 'space-y-0.5' : 'space-y-1'}>
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
                isCompact={isCompact}
              />
            ))}
          </nav>
        </section>

        <section>
          <p
            className={`mb-3 font-black text-zinc-400 uppercase ${
              isCompact ? 'px-3 text-[8px] tracking-[0.16em]' : 'px-4 text-[9px] tracking-[0.18em]'
            }`}
          >
            设置
          </p>
          <nav className={isCompact ? 'space-y-0.5' : 'space-y-1'}>
            <SidebarItem
              id="settings"
              icon={Settings}
              label="功能设置"
              isActive={activeTab === 'settings'}
              onClick={onChangeTab}
              isCompact={isCompact}
            />
          </nav>
        </section>
      </div>

      <div className={isCompact ? 'p-4 lg:p-5' : 'p-5 lg:p-6'}></div>
    </aside>
  );
};

export default Sidebar;
