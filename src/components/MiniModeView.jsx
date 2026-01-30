import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, Maximize, Pin, Plus } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const priorityStyles = {
  high: 'bg-[#ff6b6b]',
  medium: 'bg-[#f7b52c]',
  low: 'bg-[#8c397d]',
};

const MiniModeView = ({ tasks, lists, dateISO, isPinned, onTogglePin, onExit, onToggleTask, onAddTask }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');

  useEffect(() => {
    if (!containerRef.current || !window.towdo?.setMiniWindowSize) return;
    const element = containerRef.current;
    const sendSize = () => {
      const rect = element.getBoundingClientRect();
      window.towdo.setMiniWindowSize({
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
      });
    };
    sendSize();
    if (!window.ResizeObserver) return;
    const observer = new ResizeObserver(sendSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAdding) return;
    inputRef.current?.focus();
  }, [isAdding]);

  const handleCreate = () => {
    if (!draftTitle.trim()) return;
    onAddTask?.(draftTitle);
    setDraftTitle('');
    setIsAdding(false);
  };

  return (
    <div ref={containerRef} className="inline-flex">
      <div className="group relative w-[300px] rounded-[48px] border border-white/60 bg-white/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-gradient-to-b from-white/80 via-white/40 to-white/60" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4" style={{ WebkitAppRegion: 'drag' }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8c397d]">TWODO MINI</p>
              <h2 className="mt-3 text-3xl font-[900] tracking-[-0.03em] text-zinc-900">今日焦点</h2>
              <p className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                {`TODAY · ${formatDateLabel(dateISO)}`}
              </p>
            </div>
            <div className="flex items-center gap-2 opacity-0 translate-y-1 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
              <button
                type="button"
                onClick={onTogglePin}
                title={isPinned ? '已锁定' : '置顶锁定'}
                style={{ WebkitAppRegion: 'no-drag' }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                  isPinned
                    ? 'text-[#8c397d] shadow-[0_12px_24px_rgba(140,57,125,0.18),0_1px_2px_rgba(0,0,0,0.04)]'
                    : ''
                }`}
              >
                <Pin size={16} strokeWidth={2.4} className={isPinned ? '' : 'rotate-45'} />
              </button>
              <button
                type="button"
                onClick={onExit}
                title="还原到完整视图"
                style={{ WebkitAppRegion: 'no-drag' }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-[#8c397d] active:scale-95"
              >
                <Maximize size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const listName = lists.find((list) => list.id === task.listId)?.name || '未归档';
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-[28px] border border-white/70 bg-white/85 px-5 py-4 shadow-[0_18px_36px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onToggleTask?.(task.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#8c397d] shadow-[0_8px_18px_rgba(140,57,125,0.18)] transition-all duration-200 active:scale-95"
                      >
                        {task.completed ? <CheckCircle2 size={16} strokeWidth={2.6} /> : <Circle size={16} strokeWidth={2.6} />}
                      </button>
                      <span
                        className={`h-3 w-3 rounded-full ${priorityStyles[task.priority] || 'bg-[#8c397d]'}`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-zinc-800">{task.title}</p>
                        <p className="truncate text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
                          {`${listName} · ${formatDateLabel(task.date)}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-zinc-300 text-lg">›</span>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[28px] border border-white/60 bg-white/80 px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#d7c8d9] backdrop-blur-2xl">
                暂无紧急任务
              </div>
            )}
          </div>

          <div className="mt-6">
            {!isAdding ? (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex w-full items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300 transition-all duration-200 hover:text-[#8c397d]"
              >
                新建任务
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-zinc-300 shadow-[0_8px_16px_rgba(0,0,0,0.05)]">
                  <Plus size={14} strokeWidth={2.6} />
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
                <input
                  ref={inputRef}
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleCreate();
                    if (event.key === 'Escape') {
                      setIsAdding(false);
                      setDraftTitle('');
                    }
                  }}
                  placeholder="输入任务标题..."
                  className="flex-1 bg-transparent text-sm font-bold text-zinc-700 outline-none placeholder:text-zinc-300"
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8c397d] text-white shadow-[0_10px_20px_rgba(140,57,125,0.25)] active:scale-95"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniModeView;
