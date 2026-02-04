import React, { useRef, useState } from 'react';
import { Clock, GripVertical, Plus } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const DRAG_THRESHOLD = 6;

const KanbanCard = ({
  task,
  onOpen,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  isCompact,
  isDragging,
}) => {
  const pointerRef = useRef(null);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    onPointerDown?.(event, task);
  };

  const handlePointerMove = (event) => {
    if (!pointerRef.current || pointerRef.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - pointerRef.current.startX;
    const dy = event.clientY - pointerRef.current.startY;
    if (!pointerRef.current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    pointerRef.current.moved = true;
    onPointerMove?.(event, task);
  };

  const handlePointerUp = (event) => {
    if (!pointerRef.current || pointerRef.current.pointerId !== event.pointerId) return;
    const moved = pointerRef.current.moved;
    pointerRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch (error) {
      // ignore release errors
    }
    onPointerUp?.(event, task, moved);
    if (!moved) onOpen(task);
  };

  const handlePointerCancel = (event) => {
    if (!pointerRef.current || pointerRef.current.pointerId !== event.pointerId) return;
    pointerRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch (error) {
      // ignore release errors
    }
    onPointerCancel?.(event, task);
  };

  return (
    <div
      className={`app-no-drag select-none group bg-white border border-zinc-100 shadow-sm transition-all duration-200 ${
        isCompact ? 'p-3.5 rounded-[16px]' : 'p-4 rounded-[18px]'
      } ${
        isDragging
          ? 'opacity-40'
          : 'hover:shadow-lg hover:-translate-y-0.5 cursor-grab'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(task);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2.5 py-1 rounded-lg uppercase tracking-widest ${
            isCompact ? 'text-[8px] font-semibold' : 'text-[9px] font-black'
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
        <GripVertical
          size={14}
          className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
      </div>
      <h4
        className={`leading-tight text-zinc-800 mb-3 tracking-tight truncate ${
          isCompact ? 'font-medium text-[12px]' : 'font-semibold text-sm'
        }`}
      >
        {task.title}
      </h4>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
        <div
          className={`flex items-center gap-2 text-zinc-400 uppercase tracking-widest ${
            isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
          }`}
        >
          <Clock size={12} /> {formatDateLabel(task.date)}
        </div>
        <div className="w-5 h-5" aria-hidden="true"></div>
      </div>
    </div>
  );
};

const KanbanColumn = ({
  title,
  status,
  color,
  tasks,
  onOpen,
  onAdd,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  isCompact,
  isDropTarget,
  draggingId,
}) => (
  <div
    data-kanban-status={status}
    className={`flex flex-col min-w-0 h-full border transition-all ${
      isCompact ? 'rounded-[22px] p-3.5' : 'rounded-[28px] p-4'
    } ${
      isDropTarget ? 'bg-[#f7f1f8]/70 border-[#e6cfe1] ring-2 ring-[#8c397d]/10' : 'bg-zinc-50/60 border-zinc-100/50'
    }`}
  >
    <div className="px-3 py-2 flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
        <h3
          className={`uppercase text-zinc-400 ${
            isCompact ? 'font-medium text-[10px] tracking-[0.16em]' : 'font-semibold text-[11px] tracking-[0.18em]'
          }`}
        >
          {title}
        </h3>
        <span
          className={`bg-white shadow-sm text-zinc-500 px-2 py-0.5 rounded-lg ml-1 ${
            isCompact ? 'text-[8px] font-medium' : 'text-[9px] font-semibold'
          }`}
        >
          {tasks.length}
        </span>
      </div>
      <button
        onClick={() => onAdd(status)}
        className="p-1 rounded-lg hover:bg-white/80 transition-colors active:scale-95"
        title="快速新增"
      >
        <Plus size={15} className="text-zinc-300 hover:text-[#8c397d] transition-colors" />
      </button>
    </div>
    <div className={`flex-1 overflow-y-auto no-scrollbar pr-1 ${isCompact ? 'space-y-3' : 'space-y-4'}`}>
      {tasks.map((task) => (
        <KanbanCard
          key={task.id}
          task={task}
          onOpen={onOpen}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          isCompact={isCompact}
          isDragging={draggingId === task.id}
        />
      ))}
    </div>
  </div>
);

const KanbanView = ({ tasks, onOpenTask, onAddTask, onMoveTask, isCompact = false }) => {
  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const doingTasks = tasks.filter((task) => task.status === 'doing');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  const dragRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [ghost, setGhost] = useState(null);
  const [hoverStatus, setHoverStatus] = useState(null);

  const getStatusFromPoint = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const column = el.closest('[data-kanban-status]');
    return column?.dataset?.kanbanStatus || null;
  };

  const scheduleGhostUpdate = (x, y) => {
    const ref = dragRef.current;
    if (!ref) return;
    ref.lastX = x;
    ref.lastY = y;
    if (ref.raf) return;
    ref.raf = requestAnimationFrame(() => {
      ref.raf = null;
      setGhost((prev) => (prev ? { ...prev, x: ref.lastX - ref.offsetX, y: ref.lastY - ref.offsetY } : prev));
    });
  };

  const handlePointerDown = (event, task) => {
    if (event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: task.id,
      status: task.status,
      task,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      isDragging: false,
      lastX: event.clientX,
      lastY: event.clientY,
      raf: null,
    };
  };

  const handlePointerMove = (event, task) => {
    const ref = dragRef.current;
    if (!ref || ref.id !== task.id) return;
    const dx = event.clientX - ref.startX;
    const dy = event.clientY - ref.startY;
    if (!ref.isDragging) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      ref.isDragging = true;
      setDraggingId(ref.id);
      setGhost({
        x: event.clientX - ref.offsetX,
        y: event.clientY - ref.offsetY,
        width: ref.width,
        height: ref.height,
        task: ref.task,
      });
    }

    scheduleGhostUpdate(event.clientX, event.clientY);
    const status = getStatusFromPoint(event.clientX, event.clientY);
    setHoverStatus(status);
  };

  const finishDrag = (event, task) => {
    const ref = dragRef.current;
    if (!ref || ref.id !== task.id) return;
    if (ref.raf) cancelAnimationFrame(ref.raf);
    if (ref.isDragging) {
      const dropStatus = getStatusFromPoint(event.clientX, event.clientY);
      if (dropStatus && dropStatus !== task.status) {
        onMoveTask(task.id, dropStatus);
      }
    }
    dragRef.current = null;
    setDraggingId(null);
    setGhost(null);
    setHoverStatus(null);
  };

  const handlePointerUp = (event, task) => {
    finishDrag(event, task);
  };

  const handlePointerCancel = (event, task) => {
    finishDrag(event, task);
  };

  return (
    <div className="app-no-drag flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
      <header
        className={`flex justify-between items-end ${isCompact ? 'px-6 lg:px-8 py-5' : 'px-8 lg:px-10 py-6 lg:py-7'}`}
      >
        <div>
          <h2 className={`font-[900] tracking-[-0.04em] ${isCompact ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'}`}>
            看板管理
          </h2>
          <p
            className={`text-zinc-400 mt-2 uppercase tracking-widest ${
              isCompact ? 'text-[9px] font-medium' : 'text-[10px] font-semibold'
            }`}
          >
            Visual Workflow Management
          </p>
        </div>
      </header>
      <div
        className={`flex-1 overflow-hidden ${isCompact ? 'px-5 lg:px-8 pb-5 lg:pb-7' : 'px-6 lg:px-10 pb-6 lg:pb-8'}`}
      >
        <div className={`h-full grid grid-cols-3 ${isCompact ? 'gap-3 lg:gap-4' : 'gap-4 lg:gap-5'}`}>
          <KanbanColumn
            title="待处理"
            status="todo"
            color="bg-red-400"
            tasks={todoTasks}
            onOpen={onOpenTask}
            onAdd={onAddTask}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            isCompact={isCompact}
            isDropTarget={hoverStatus === 'todo'}
            draggingId={draggingId}
          />
          <KanbanColumn
            title="进行中"
            status="doing"
            color="bg-amber-400"
            tasks={doingTasks}
            onOpen={onOpenTask}
            onAdd={onAddTask}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            isCompact={isCompact}
            isDropTarget={hoverStatus === 'doing'}
            draggingId={draggingId}
          />
          <KanbanColumn
            title="已完成"
            status="done"
            color="bg-[#8c397d]"
            tasks={doneTasks}
            onOpen={onOpenTask}
            onAdd={onAddTask}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            isCompact={isCompact}
            isDropTarget={hoverStatus === 'done'}
            draggingId={draggingId}
          />
        </div>
      </div>

      {ghost && (
        <div
          className="pointer-events-none fixed z-50"
          style={{ left: ghost.x, top: ghost.y, width: ghost.width }}
        >
          <div
            className={`bg-white border border-[#e6cfe1] shadow-2xl ring-2 ring-[#8c397d]/10 ${
              isCompact ? 'p-3 rounded-[14px]' : 'p-3.5 rounded-[16px]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                  isCompact ? 'text-[8px] font-semibold' : 'text-[9px] font-black'
                } ${
                  ghost.task?.priority === 'high'
                    ? 'bg-red-50 text-red-500'
                    : ghost.task?.priority === 'medium'
                    ? 'bg-amber-50 text-amber-500'
                    : 'bg-[#f7f1f8] text-[#8c397d]'
                }`}
              >
                {ghost.task?.priority === 'high' ? '高' : ghost.task?.priority === 'medium' ? '中' : '低'}
              </span>
              <GripVertical size={14} className="text-zinc-300" />
            </div>
            <div
              className={`mt-2 text-zinc-800 ${
                isCompact ? 'text-[12px] font-medium' : 'text-[13px] font-semibold'
              }`}
            >
              {ghost.task?.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanView;
