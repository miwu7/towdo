import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const CalendarDayModal = ({ isOpen, dateISO, holiday, solar, tasks, lists, onClose, onOpenTask }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-[720px] max-h-[80vh] bg-white rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">日程详情</p>
            <h3 className="text-3xl font-[900] tracking-tighter text-zinc-900 mt-2">
              {formatDateLabel(dateISO)}
            </h3>
            {(holiday || solar) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {holiday && (
                  <span
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-[#f7f1f8]"
                    style={{ color: '#8c397d' }}
                  >
                    {holiday}
                  </span>
                )}
                {solar && (
                  <span
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-emerald-50"
                    style={{ color: '#1c8d41' }}
                  >
                    {solar}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors active:scale-95"
            title="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="w-full text-left p-5 rounded-[24px] border border-zinc-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-black text-base text-zinc-800 truncate">{task.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {lists.find((l) => l.id === task.listId)?.name || '未归档'}
                  </span>
                </div>
                {task.desc && (
                  <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{task.desc}</p>
                )}
              </button>
            ))
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-zinc-100 rounded-[32px]">
              <p className="text-zinc-300 font-black tracking-[0.2em] uppercase text-xs">该日暂无任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayModal;
