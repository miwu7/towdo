import React, { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const CalendarDayModal = ({ isOpen, dateISO, holiday, solar, tasks, lists, onClose, onOpenTask, onAddTask }) => {
  const [draftTitle, setDraftTitle] = useState('');
  const [listId, setListId] = useState('');
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (!isOpen) {
      setDraftTitle('');
      return;
    }
    if (lists?.length) {
      setListId((prev) => prev || lists[0].id);
    }
  }, [isOpen, lists]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!draftTitle.trim()) {
      inputRef.current?.focus();
      return;
    }
    onAddTask?.(draftTitle.trim(), listId);
    setDraftTitle('');
    inputRef.current?.focus();
  };

  return (
    <div
      className="app-no-drag fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-[680px] max-h-[80vh] bg-white rounded-[36px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-zinc-400">日程详情</p>
            <h3 className="text-2xl font-[900] tracking-tighter text-zinc-900 mt-2">
              {formatDateLabel(dateISO)}
            </h3>
            {(holiday || solar) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {holiday && (
                  <span
                    className="px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] rounded-full bg-[#f7f1f8]"
                    style={{ color: '#8c397d' }}
                  >
                    {holiday}
                  </span>
                )}
                {solar && (
                  <span
                    className="px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] rounded-full bg-emerald-50"
                    style={{ color: '#1c8d41' }}
                  >
                    {solar}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors active:scale-95"
              title="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-[20px] bg-[#f7f1f8] px-4 py-3">
              <Plus size={14} className="text-[#8c397d]" />
              <input
                ref={inputRef}
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleAdd();
                }}
                placeholder="新增该日任务..."
                className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-zinc-800 placeholder:text-zinc-300"
              />
            </div>
            <select
              value={listId}
              onChange={(event) => setListId(event.target.value)}
              className="appearance-none rounded-[16px] bg-white border border-zinc-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500"
            >
              {(lists || []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-[16px] bg-[#8c397d] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:opacity-90 active:scale-95"
            >
              新增
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="w-full text-left p-4 rounded-[20px] border border-zinc-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-[15px] text-zinc-800 truncate">{task.title}</h4>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                    {lists.find((l) => l.id === task.listId)?.name || '未归档'}
                  </span>
                </div>
                {task.desc && (
                  <p className="text-[13px] text-zinc-500 mt-2 line-clamp-2">{task.desc}</p>
                )}
              </button>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-[28px]">
              <p className="text-zinc-300 font-semibold tracking-[0.18em] uppercase text-[10px]">该日暂无任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayModal;
