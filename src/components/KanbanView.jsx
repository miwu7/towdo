import React, { useState } from 'react';
import { Clock, GripVertical, Plus } from 'lucide-react';
import { formatDateLabel } from '../utils/date';

const KanbanCard = ({ task, onOpen, onDragStart }) => (
  <div
    className="group bg-white p-4 lg:p-6 rounded-[22px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    onClick={() => onOpen(task)}
    draggable
    onDragStart={(event) => onDragStart(event, task)}
  >
    <div className="flex justify-between items-start mb-3">
      <span
        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
          task.priority === 'high'
            ? 'bg-red-50 text-red-500'
            : task.priority === 'medium'
            ? 'bg-amber-50 text-amber-500'
            : 'bg-[#f7f1f8] text-[#8c397d]'
        }`}
      >
        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
      </span>
      <GripVertical size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h4 className="font-black text-sm lg:text-base leading-tight text-zinc-800 mb-3 lg:mb-4 tracking-tight truncate">
      {task.title}
    </h4>
    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        <Clock size={12} /> {formatDateLabel(task.date)}
      </div>
      <div className="w-6 h-6 rounded-full bg-[#f7f1f8] flex items-center justify-center text-[8px] font-black text-[#8c397d]">
        PT
      </div>
    </div>
  </div>
);

const KanbanColumn = ({ title, status, color, tasks, onOpen, onAdd, onDropTask, onDragStart }) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-0 h-full rounded-[36px] p-4 lg:p-5 border transition-all ${
        isOver ? 'bg-[#f7f1f8]/70 border-[#e6cfe1] shadow-xl' : 'bg-zinc-50/50 border-zinc-100/50'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        const taskId = event.dataTransfer.getData('text/plain');
        if (taskId) {
          onDropTask(Number(taskId), status);
        }
      }}
    >
      <div className="px-3 py-2 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">{title}</h3>
          <span className="text-[10px] font-black bg-white shadow-sm text-zinc-500 px-2 py-0.5 rounded-lg ml-1">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="p-1 rounded-lg hover:bg-white/80 transition-colors active:scale-95"
          title="快速新增"
        >
          <Plus size={16} className="text-zinc-300 hover:text-[#8c397d] transition-colors" />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-1">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onOpen={onOpen} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
};

const KanbanView = ({ tasks, onOpenTask, onAddTask, onMoveTask }) => {
  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const doingTasks = tasks.filter((task) => task.status === 'doing');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  const handleDragStart = (event, task) => {
    event.dataTransfer.setData('text/plain', String(task.id));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
      <header className="px-8 lg:px-12 py-6 lg:py-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl lg:text-6xl font-[900] tracking-[-0.06em]">看板管理</h2>
          <p className="text-zinc-400 font-bold mt-2 uppercase tracking-widest text-xs">Visual Workflow Management</p>
        </div>
      </header>
      <div className="flex-1 overflow-hidden px-6 lg:px-12 pb-6 lg:pb-10">
        <div className="h-full grid grid-cols-3 gap-4 lg:gap-6">
        <KanbanColumn
          title="待处理"
          status="todo"
          color="bg-red-400"
          tasks={todoTasks}
          onOpen={onOpenTask}
          onAdd={onAddTask}
          onDropTask={onMoveTask}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="进行中"
          status="doing"
          color="bg-amber-400"
          tasks={doingTasks}
          onOpen={onOpenTask}
          onAdd={onAddTask}
          onDropTask={onMoveTask}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="已完成"
          status="done"
          color="bg-[#8c397d]"
          tasks={doneTasks}
          onOpen={onOpenTask}
          onAdd={onAddTask}
          onDropTask={onMoveTask}
          onDragStart={handleDragStart}
        />
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
