import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Maximize, Pin, Plus } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const MiniModeView = ({
  todayTodo = [],
  todayDone = [],
  overdueTodo = [],
  lists,
  dateISO,
  isPinned,
  onTogglePin,
  onExit,
  onToggleTask,
  onAddTask,
}) => {
  const inputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [miniSize, setMiniSize] = useState({ width: 0, height: 0 });

  const MINI_SIZE_KEY = 'towdo_mini_size';
  const MIN_WIDTH = 280;
  const MIN_HEIGHT = 240;
  const MAX_WIDTH = 520;
  const MAX_HEIGHT = 1200;

  useEffect(() => {
    const handleResize = () => {
      const width = Math.round(window.innerWidth);
      const height = Math.round(window.innerHeight);
      if (!width || !height) return;
      setMiniSize({ width, height });
      try {
        localStorage.setItem(MINI_SIZE_KEY, JSON.stringify({ width, height }));
      } catch (error) {
        console.warn('写入迷你尺寸失败', error);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const applyMiniSize = (width, height) => {
    const nextWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(width)));
    const nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, Math.round(height)));
    setMiniSize({ width: nextWidth, height: nextHeight });
    try {
      localStorage.setItem(MINI_SIZE_KEY, JSON.stringify({ width: nextWidth, height: nextHeight }));
    } catch (error) {
      console.warn('写入迷你尺寸失败', error);
    }
    window.towdo?.setMiniWindowSize?.({ width: nextWidth, height: nextHeight });
  };

  const handleResizePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = miniSize.width || window.innerWidth;
    const startHeight = miniSize.height || window.innerHeight;

    const handleMove = (moveEvent) => {
      const nextWidth = startWidth + (moveEvent.clientX - startX);
      const nextHeight = startHeight + (moveEvent.clientY - startY);
      applyMiniSize(nextWidth, nextHeight);
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      window.removeEventListener('blur', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    window.addEventListener('blur', handleUp);
  };

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

  const getTone = (task, isOverdue) => {
    if (isOverdue) {
      return {
        ring: 'ring-red-300/60 border-red-200',
        dot: 'bg-red-400',
        pill: 'bg-red-50 text-red-500',
        accent: 'text-red-500',
      };
    }

    if (task.priority === 'high') {
      return {
        ring: 'ring-red-200/70 border-red-100',
        dot: 'bg-[#ff6b6b]',
        pill: 'bg-red-50 text-red-500',
        accent: 'text-red-500',
      };
    }

    if (task.priority === 'medium') {
      return {
        ring: 'ring-amber-200/70 border-amber-100',
        dot: 'bg-[#f7b52c]',
        pill: 'bg-amber-50 text-amber-500',
        accent: 'text-amber-500',
      };
    }

    return {
      ring: 'ring-[#8c397d]/20 border-[#8c397d]/10',
      dot: 'bg-[#8c397d]',
      pill: 'bg-[#f7f1f8] text-[#8c397d]',
      accent: 'text-[#8c397d]',
    };
  };

  const renderTask = (task, { isOverdue = false } = {}) => {
    const listName = lists.find((list) => list.id === task.listId)?.name || '未归档';
    const timeLabel = task.time || task.timeLabel || '';
    const tone = getTone(task, isOverdue);
    return (
      <div
        key={task.id}
        className={`relative flex items-center gap-2.5 rounded-[20px] border border-white/70 bg-white/90 px-3.5 py-2.5 shadow-[0_10px_20px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] ${
          task.completed ? 'opacity-60' : ''
        }`}
      >
        {isOverdue && (
          <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-full bg-red-400/70" />
        )}
        <button
          type="button"
          onClick={() => {
            onToggleTask?.(task.id);
            if (!task.completed && task.date === dateISO) {
              setShowDone(true);
            }
          }}
          className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white shadow-[0_6px_12px_rgba(140,57,125,0.12)] ring-2 transition-all duration-200 active:scale-95 ${tone.ring}`}
        >
          {task.completed ? (
            <Check size={14} strokeWidth={3} className="text-zinc-400" />
          ) : (
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black text-zinc-800 leading-snug break-words line-clamp-2">
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
            <span className={`rounded-full px-2 py-0.5 ${tone.pill}`}>{listName}</span>
            {timeLabel && <span className="text-zinc-300">{timeLabel}</span>}
            <span className={isOverdue ? 'text-red-400' : 'text-zinc-300'}>{formatDateLabel(task.date)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, items, tone = 'text-zinc-400') => (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${tone}`}>{title}</p>
        <span className="text-[10px] font-black text-zinc-300">{items.length}</span>
      </div>
      {items.length > 0 ? (
        items.map((task) => renderTask(task))
      ) : (
        <div className="rounded-[22px] border border-white/60 bg-white/80 px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#d7c8d9] backdrop-blur-2xl">
          暂无任务
        </div>
      )}
    </section>
  );

  const renderOverdueSection = (items) => (
    <section className="space-y-3 rounded-[28px] border border-red-100 bg-red-50/70 p-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">逾期未办</p>
        <span className="text-[10px] font-black text-red-400">{items.length}</span>
      </div>
      {items.map((task) => renderTask(task, { isOverdue: true }))}
    </section>
  );

  return (
    <div className="w-full h-full p-3">
      <div className="group relative w-full h-full rounded-[48px] border border-white/60 bg-white/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-2xl flex flex-col">
        <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-gradient-to-b from-white/80 via-white/40 to-white/60" />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4" style={{ WebkitAppRegion: 'drag' }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8c397d]">TWODO MINI</p>
              <h2 className="mt-3 text-3xl font-[900] tracking-[-0.03em] text-zinc-900">迷你看板</h2>
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

          <div className="mt-6 space-y-6 app-no-drag flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
            {overdueTodo.length > 0 && renderOverdueSection(overdueTodo)}
            {renderSection('今日待办', todayTodo, 'text-[#8c397d]')}

            <section className="space-y-3">
              <button
                type="button"
                onClick={() => setShowDone((prev) => !prev)}
                className="flex w-full items-center justify-between px-1 text-left"
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  今日已办
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showDone ? 'rotate-180' : ''}`}
                  />
                </div>
                <span className="text-[10px] font-black text-zinc-300">{todayDone.length}</span>
              </button>
              {showDone ? (
                todayDone.length > 0 ? (
                  todayDone.map((task) => renderTask(task))
                ) : (
                  <div className="rounded-[22px] border border-white/60 bg-white/80 px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#d7c8d9] backdrop-blur-2xl">
                    暂无任务
                  </div>
                )
              ) : (
                <div className="px-2 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300">
                  已完成 {todayDone.length} 项
                </div>
              )}
            </section>
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

        <div
          className="app-no-drag absolute bottom-4 right-4 h-4 w-4 cursor-se-resize touch-none select-none"
          onPointerDown={handleResizePointerDown}
          title="拖拽调整大小"
        >
          <span className="absolute bottom-0 right-0 h-1 w-3 rounded-full bg-zinc-200" />
          <span className="absolute bottom-1.5 right-0 h-1 w-2 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
};

export default MiniModeView;
