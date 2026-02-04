import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

// 任务详情弹窗：用于更新与删除
const TaskDetailModal = ({ isOpen, task, lists, onClose, onSave, onDelete }) => {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (isOpen && task) {
      setDraft({ ...task });
    }
  }, [isOpen, task]);

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

  if (!isOpen || !draft) return null;

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="app-no-drag fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-[620px] bg-white rounded-[36px] p-10 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-[900] tracking-tighter text-[#4a1a43]">任务详情</h3>
          <button
            onClick={() => onDelete(draft.id)}
            className="p-2.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors active:scale-95"
            title="删除任务"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">标题</label>
            <input
              className="w-full bg-[#f7f1f8] border-none outline-none px-5 py-3.5 rounded-[18px] font-semibold text-base text-zinc-900"
              value={draft.title}
              onChange={(event) => updateField('title', event.target.value)}
            />
          </div>

          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">描述</label>
            <textarea
              className="w-full bg-[#f7f1f8] border-none outline-none px-5 py-3.5 rounded-[18px] font-semibold text-[13px] text-zinc-700 min-h-[110px]"
              value={draft.desc}
              onChange={(event) => updateField('desc', event.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">日期</label>
              <input
                type="date"
                className="w-full bg-[#f7f1f8] border-none outline-none px-4 py-3 rounded-[16px] font-semibold text-[13px] text-zinc-700"
                value={draft.date}
                onChange={(event) => updateField('date', event.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">优先级</label>
              <select
                className="w-full bg-[#f7f1f8] border-none outline-none px-4 py-3 rounded-[16px] font-semibold text-[13px] text-zinc-700"
                value={draft.priority}
                onChange={(event) => updateField('priority', event.target.value)}
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">状态</label>
              <select
                className="w-full bg-[#f7f1f8] border-none outline-none px-4 py-3 rounded-[16px] font-semibold text-[13px] text-zinc-700"
                value={draft.status}
                onChange={(event) => updateField('status', event.target.value)}
              >
                <option value="todo">待处理</option>
                <option value="doing">进行中</option>
                <option value="done">已完成</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">清单</label>
            <select
              className="w-full bg-[#f7f1f8] border-none outline-none px-4 py-3 rounded-[16px] font-semibold text-[13px] text-zinc-700"
              value={draft.listId}
              onChange={(event) => updateField('listId', event.target.value)}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-7 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-800 active:scale-95"
          >
            取消
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => onSave({ ...draft, completed: draft.status === 'done' })}
              className="px-9 py-3.5 rounded-[18px] bg-[#8c397d] text-white text-[13px] font-semibold shadow-2xl shadow-[#8c397d]/30 active:scale-95"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
