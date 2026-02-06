import React, { useMemo } from 'react';
import { CheckCircle2, Circle, Clock, Hash, AlertTriangle, Filter } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

// 单个任务卡片
const TaskCard = ({ task, listName, onToggle, onOpen, isCompact }) => (
  <div
    className={`group flex items-center bg-white border transition-all duration-300 cursor-pointer hover:translate-x-0.5 active:scale-[0.99] ${
      isCompact ? 'gap-4 p-4 rounded-[20px]' : 'gap-5 p-5 rounded-[24px]'
    } ${
      task.completed
        ? 'border-transparent bg-zinc-50/60 opacity-60 shadow-none'
        : 'border-zinc-100 hover:border-[#8c397d]/20 shadow-sm hover:shadow-xl hover:shadow-[#8c397d]/5'
    }`}
    onClick={() => onOpen(task)}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen(task);
      }
    }}
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
      {task.completed ? (
        <CheckCircle2 size={isCompact ? 22 : 26} strokeWidth={2.4} />
      ) : (
        <Circle size={isCompact ? 22 : 26} strokeWidth={2.4} />
      )}
    </button>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1 gap-4">
        <h3
          className={`tracking-tight transition-all truncate ${
            isCompact ? 'font-semibold text-[15px]' : 'font-bold text-base'
          } ${
            task.completed ? 'line-through text-zinc-400' : 'text-zinc-800'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`px-2.5 py-1 uppercase tracking-widest rounded-lg shrink-0 ${
            isCompact ? 'text-[8px] font-semibold' : 'text-[9px] font-bold'
          } ${
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
        <span
          className={`text-zinc-400 flex items-center gap-1.5 uppercase ${
            isCompact ? 'text-[8px] font-medium tracking-[0.12em]' : 'text-[9px] font-semibold tracking-[0.12em]'
          }`}
        >
          <Hash size={12} /> {listName}
        </span>
        <span
          className={`text-zinc-400 flex items-center gap-1.5 uppercase ${
            isCompact ? 'text-[8px] font-medium tracking-[0.12em]' : 'text-[9px] font-semibold tracking-[0.12em]'
          }`}
        >
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
  isCompact = false,
}) => {
  const isEmpty = tasks.length === 0;
  const pendingTasks = tasks.filter((task) => !task.completed);
  const doneTasks = tasks.filter((task) => task.completed);
  const listNameById = useMemo(
    () => new Map((lists || []).map((list) => [list.id, list.name])),
    [lists],
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className={`w-full mx-0 ${
          isCompact
            ? `max-w-[760px] px-5 md:px-8 ${isEmpty ? 'py-8 md:py-10' : 'py-10 md:py-12'}`
            : `max-w-[880px] px-6 md:px-10 ${isEmpty ? 'py-10 md:py-12' : 'py-12 md:py-16'}`
        }`}
      >
        <header
          className={
            isCompact ? (isEmpty ? 'mb-6 md:mb-8' : 'mb-8 md:mb-10') : isEmpty ? 'mb-8 md:mb-10' : 'mb-10 md:mb-12'
          }
        >
          <div
            className={`flex flex-wrap items-center gap-3 text-[#8c397d] uppercase ${
              isCompact ? 'font-medium text-[9px] mb-2 tracking-[0.16em]' : 'font-semibold text-[10px] mb-3 tracking-[0.18em]'
            }`}
          >
            {dateLabel}
            {showOverdueToggle && (
              <button
                onClick={onToggleOverdue}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-all duration-700 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                  isCompact ? 'text-[8px] font-medium tracking-[0.16em]' : 'text-[9px] font-semibold tracking-[0.18em]'
                } ${
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
          <h2
            className={`font-[900] tracking-[-0.04em] leading-[1.05] text-zinc-900 ${
              isCompact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-zinc-400 tracking-tight ${
              isCompact ? 'mt-2 text-[13px] font-medium' : 'mt-3 text-sm md:text-base font-semibold'
            }`}
          >
            {subtitle}
          </p>
        </header>

        <div className={isCompact ? 'space-y-2.5' : 'space-y-3'}>
          {tasks.length > 0 ? (
            <>
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  listName={listNameById.get(task.listId) || '未归档'}
                  onToggle={onToggleTask}
                  onOpen={onOpenTask}
                  isCompact={isCompact}
                />
              ))}

              {doneTasks.length > 0 && (
                <div className={isCompact ? 'pt-2' : 'pt-3'}>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className={`uppercase ${isCompact ? 'text-[9px] font-medium tracking-[0.18em]' : 'text-[10px] font-semibold tracking-[0.2em]'}`}>
                      今日已完成
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-300">{doneTasks.length}</span>
                    <span className="flex-1 h-px bg-zinc-100"></span>
                  </div>
                  <div className={isCompact ? 'mt-2 space-y-2.5' : 'mt-3 space-y-3'}>
                    {doneTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        listName={listNameById.get(task.listId) || '未归档'}
                        onToggle={onToggleTask}
                        onOpen={onOpenTask}
                        isCompact={isCompact}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className={`text-center border-2 border-dashed border-[#f7f1f8] ${
                isCompact ? 'py-10 rounded-[26px] max-w-[520px]' : 'py-14 rounded-[32px] max-w-[600px]'
              }`}
            >
              <p
                className={`text-[#e6cfe1] font-[900] uppercase ${
                  isCompact ? 'tracking-[0.16em] text-[10px]' : 'tracking-[0.18em] text-xs'
                }`}
              >
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
