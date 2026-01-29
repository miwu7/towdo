import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}) => {
  const days = buildMonthGrid(monthDate);
  const todayISO = getTodayISO();
  const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

  const MAX_ITEMS = 2;

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
      <header className="px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center border-b border-zinc-50">
        <div className="flex items-center gap-6 xl:gap-8">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-[900] tracking-[-0.06em] text-zinc-900">
            {formatMonthLabel(monthDate)}
          </h2>
          <div className="flex bg-zinc-100 p-1.5 rounded-[20px]">
            <button
              className="p-2.5 hover:bg-white rounded-xl shadow-sm transition-all active:scale-95"
              onClick={onPrevMonth}
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button
              className="px-6 py-1 text-xs font-[900] uppercase tracking-widest text-zinc-500 hover:text-[#8c397d] transition-colors active:scale-95"
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

      <div className="grid grid-cols-7 bg-white border-b border-zinc-50">
        {weekLabels.map((day) => (
          <div
            key={day}
            className="p-2 lg:p-3 text-[11px] font-[900] tracking-[0.3em] text-zinc-400 text-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 h-full grid grid-cols-7 grid-rows-6 auto-rows-fr bg-zinc-50 gap-px">
        {days.map((item) => {
          const tasksThisDay = Array.isArray(tasks) ? tasks.filter((task) => task.date === item.iso) : [];
          const isToday = isSameDay(item.iso, todayISO);
          const label = formatDateLabel(item.iso);
          const showOverflow = tasksThisDay.length > MAX_ITEMS;
          const holiday = getHolidayLabel(item.iso);
          const solar = getSolarTermLabel(item.iso);

          return (
            <div
              key={item.iso}
              className={`group bg-white p-2 sm:p-2.5 lg:p-3 min-h-0 h-full flex flex-col transition-all duration-300 overflow-hidden relative text-left ${
                item.inMonth ? '' : 'opacity-30'
              }`}
              onClick={() => onOpenDay?.(item.iso)}
              title={label}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDay?.(item.iso);
                }
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-2 rounded-2xl border border-[#e6cfe1]/80 bg-[#f7f1f8]/30 shadow-sm"></div>
              </div>

              <div className="relative flex justify-between items-center mb-1.5 lg:mb-2 gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] sm:text-xs lg:text-sm font-black w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-[12px] ${
                      isToday
                        ? 'bg-[#8c397d] text-white shadow-xl shadow-[#8c397d]/40'
                        : 'text-zinc-500'
                    }`}
                  >
                    {item.day}
                  </span>
                  {(holiday || solar) && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        holiday ? 'bg-[#f7f1f8]' : 'bg-emerald-50'
                      }`}
                      style={
                        holiday ? { color: '#8c397d' } : { color: '#1c8d41' }
                      }
                    >
                      {holiday || solar}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest group-hover:text-[#8c397d] transition-colors ml-2">
                  {tasksThisDay.length}项
                </span>
              </div>

              <div className="space-y-1 relative flex-1 min-h-0 overflow-hidden">
                {tasksThisDay.slice(0, MAX_ITEMS).map((task) => (
                  <button
                    key={task.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenTask?.(task);
                    }}
                    className="w-full text-left px-2 py-1 sm:px-2.5 bg-[#f7f1f8] border-l-[3px] border-[#8c397d]/80 rounded-lg text-[9px] sm:text-[10px] font-semibold text-[#6f2d63]/90 truncate tracking-tight hover:bg-[#eddde9] transition-colors active:scale-[0.99]"
                  >
                    {task.title}
                  </button>
                ))}
                {showOverflow && (
                  <div className="px-2.5 text-[10px] font-black text-zinc-300 tracking-[0.2em]">···</div>
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
