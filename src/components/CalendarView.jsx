import React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { buildMonthGrid, formatDateLabel, formatMonthLabel, getTodayISO, isSameDay } from '../utils/date';
import { getHolidayLabel, getSolarTermLabel } from '../data/calendarLabels';

const CalendarView = ({
  monthDate,
  onPrevMonth,
  onNextMonth,
  onResetToday,
  tasks,
  onOpenTask,
  onOpenDay,
  onToggleTask,
  pulseTaskId,
  isCompact = false,
}) => {
  const days = buildMonthGrid(monthDate);
  const todayISO = getTodayISO();
  const weekLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const MAX_ITEMS = 6;
  const colorPalette = [
    { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
    { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  ];

  const getColorIndex = (seed) => {
    const str = String(seed ?? '');
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = (hash * 31 + str.charCodeAt(i)) % 2147483647;
    }
    return hash % colorPalette.length;
  };


  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
      <header
        className={`flex justify-between items-center border-b border-zinc-100 bg-white ${
          isCompact ? 'px-5 lg:px-6 py-4 lg:py-5' : 'px-6 lg:px-8 py-5 lg:py-6'
        }`}
      >
        <div className="flex items-center gap-6 xl:gap-8">
          <h2
            className={`font-[900] tracking-[-0.04em] text-zinc-900 ${
              isCompact ? 'text-xl lg:text-2xl xl:text-3xl' : 'text-2xl lg:text-3xl xl:text-4xl'
            }`}
          >
            {formatMonthLabel(monthDate)}
          </h2>
          <div className={`flex bg-zinc-100 p-1.5 ${isCompact ? 'rounded-[16px]' : 'rounded-[20px]'}`}>
            <button
              className="p-2.5 hover:bg-white rounded-xl shadow-sm transition-all active:scale-95"
              onClick={onPrevMonth}
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button
              className={`uppercase text-zinc-500 hover:text-[#8c397d] transition-colors active:scale-95 ${
                isCompact ? 'px-4 py-1 text-[9px] font-semibold tracking-[0.22em]' : 'px-5 py-1 text-[10px] font-[900] tracking-[0.25em]'
              }`}
              onClick={onResetToday}
            >
              Today
            </button>
            <button
              className="p-2.5 hover:bg-white rounded-xl shadow-sm transition-all active:scale-95"
              onClick={onNextMonth}
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-7 bg-white border-b border-zinc-100">
        {weekLabels.map((day) => (
          <div
            key={day}
            className={`text-zinc-400 text-center ${
              isCompact ? 'py-1.5 text-[10px] font-medium tracking-[0.16em]' : 'py-2 text-[11px] font-semibold tracking-[0.18em]'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 h-full grid grid-cols-7 grid-rows-6 auto-rows-fr bg-zinc-50">
        {days.map((item) => {
          const tasksThisDay = Array.isArray(tasks) ? tasks.filter((task) => task.date === item.iso) : [];
          const isToday = isSameDay(item.iso, todayISO);
          const holiday = getHolidayLabel(item.iso);
          const solar = getSolarTermLabel(item.iso);
          const showMonthLabel = item.day === 1;
          const monthLabel = item.day;
          const visibleTasks = tasksThisDay.slice(0, MAX_ITEMS);
          const showOverflow = tasksThisDay.length > MAX_ITEMS;

          return (
            <div
              key={item.iso}
              className={`group min-h-0 h-full flex flex-col border-r border-b border-zinc-100 bg-white transition-colors ${
                isCompact ? 'p-2.5' : 'p-3'
              } ${item.inMonth ? '' : 'bg-zinc-50/60 text-zinc-300'}`}
              onClick={() => onOpenDay?.(item.iso)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDay?.(item.iso);
                }
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center justify-center ${
                      isCompact ? 'text-[10px] font-medium' : 'text-[11px] font-semibold'
                    } ${showMonthLabel ? 'px-2 py-0.5 rounded-full' : 'w-7 h-7 rounded-full'} ${
                      isToday
                        ? 'bg-[#4f6fff] text-white shadow-lg shadow-[#4f6fff]/30'
                        : 'text-zinc-400'
                    }`}
                  >
                    {showMonthLabel ? monthLabel : item.day}
                  </span>
                  {(holiday || solar) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {Array.isArray(holiday) &&
                        holiday.map((label) => (
                          <span
                            key={`${item.iso}-${label}`}
                            className={`px-2 py-0.5 rounded-full ${
                              isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
                            } bg-[#f7f1f8]`}
                            style={{ color: '#8c397d' }}
                          >
                            {label}
                          </span>
                        ))}
                      {!Array.isArray(holiday) && holiday && (
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
                          } bg-[#f7f1f8]`}
                          style={{ color: '#8c397d' }}
                        >
                          {holiday}
                        </span>
                      )}
                      {solar && (
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
                          } bg-emerald-50`}
                          style={{ color: '#1c8d41' }}
                        >
                          {solar}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={`mt-2 overflow-hidden ${isCompact ? 'space-y-0.5' : 'space-y-1'}`}>
                {visibleTasks.map((task) => {
                  const color = colorPalette[getColorIndex(task.listId || task.id)];
                  const timeLabel = task.time || task.timeLabel || '';
                  return (
                    <button
                      key={task.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleTask?.(task.id);
                      }}
                      className={`w-full h-5 flex items-center justify-between gap-2 px-2 rounded-md border whitespace-nowrap overflow-hidden leading-[10px] transition-all duration-200 ${
                        isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
                      } ${
                        task.completed
                          ? 'bg-white/70 border-zinc-200 text-zinc-300'
                          : `${color.bg} ${color.text} ${color.border}`
                      } ${pulseTaskId === task.id ? 'task-toggle-bounce' : ''}`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[#8c397d]">
                          {task.completed ? (
                            <CheckCircle2 size={11} strokeWidth={2.6} />
                          ) : (
                            <Circle size={11} strokeWidth={2.6} />
                          )}
                        </span>
                        <span className="truncate min-w-0">{task.title}</span>
                      </span>
                      {timeLabel && (
                        <span className="text-[9px] font-bold opacity-60 whitespace-nowrap shrink-0">{timeLabel}</span>
                      )}
                    </button>
                  );
                })}
                {showOverflow && (
                  <div className="text-[10px] font-black text-zinc-300 tracking-[0.2em]">···</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
