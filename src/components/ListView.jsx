import React from 'react';
import { CheckCircle2, Circle, Clock, Hash, AlertTriangle, Filter } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

// 单个任务卡片
const TaskCard = ({ task, listName, onToggle, onOpen }) => (
  <div
    className={`group flex items-center gap-6 p-7 bg-white border-2 transition-all duration-300 rounded-[32px] cursor-pointer hover:translate-x-1 active:scale-[0.99] ${
      task.completed
        ? 'border-transparent bg-zinc-50/50 opacity-60 shadow-none'
        : 'border-zinc-50 hover:border-[#8c397d]/20 shadow-sm hover:shadow-2xl hover:shadow-[#8c397d]/5'
    }`}
    onClick={() => onOpen(task)}
  >
    <button
      onClick={(event) => {
        event.stopPropagation();
        onToggle(task.id);
      }}
      className={`transition-all duration-500 ${
        task.completed ? 'text-[#8c397d] scale-110' : 'text-zinc-200 group-hover:text-[#8c397d]'
      } active:scale-95`}
    >
      {task.completed ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <Circle size={32} strokeWidth={2.5} />}
    </button>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1 gap-4">
        <h3
          className={`font-black text-xl tracking-tight transition-all truncate ${
            task.completed ? 'line-through text-zinc-400 font-bold' : 'text-zinc-800'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl shrink-0 ${
            task.priority === 'high'
              ? 'bg-red-50 text-red-500'
              : task.priority === 'medium'
              ? 'bg-amber-50 text-amber-500'
              : 'bg-[#f7f1f8] text-[#8c397d]'
          }`}
        >
          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-1">
        <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
          <Hash size={12} /> {listName}
        </span>
        <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
          <Clock size={12} /> {formatDateLabel(task.date)}
        </span>
      </div>
    </div>
  </div>
);

// 列表视图
const ListView = ({
  title,
  subtitle,
  dateLabel,
  tasks,
  lists,
  onToggleTask,
  onOpenTask,
  showOverdueToggle,
  includeOverdue,
  onToggleOverdue,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-5xl w-full mx-auto py-16 md:py-24 px-6 md:px-12">
        <header className="mb-16 md:mb-20">
          <div className="flex flex-wrap items-center gap-3 text-[#8c397d] font-black text-xs mb-4 uppercase tracking-[0.2em]">
            {dateLabel}
            {showOverdueToggle && (
              <button
                onClick={onToggleOverdue}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border backdrop-blur-md transition-all duration-700 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                  includeOverdue
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-black/10'
                    : 'bg-white/80 text-red-500 border-red-200'
                }`}
              >
                {includeOverdue ? <Filter size={12} /> : <AlertTriangle size={12} />}
                <span>逾期未完成</span>
                {!includeOverdue && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            )}
          </div>
          <h2 className="text-5xl md:text-7xl font-[900] tracking-[-0.06em] leading-[0.9] text-zinc-900">
            {title}
          </h2>
          <p className="mt-6 text-zinc-400 font-bold text-lg md:text-xl tracking-tight">{subtitle}</p>
        </header>

        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                listName={lists.find((list) => list.id === task.listId)?.name || '未归档'}
                onToggle={onToggleTask}
                onOpen={onOpenTask}
              />
            ))
          ) : (
            <div className="py-32 text-center border-4 border-dashed border-[#f7f1f8] rounded-[60px]">
              <p className="text-[#e6cfe1] font-[900] tracking-[0.2em] uppercase text-sm">
                开始记录你的伟大想法
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListView;
