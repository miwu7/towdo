import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// 快速添加：全屏模糊 + 巨大输入框
const QuickAddModal = ({ isOpen, lists, selectedListId, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [listId, setListId] = useState(selectedListId || '');
  const trimmedTitle = title.trim();
  const canSave = trimmedTitle.length > 0;

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setListId(selectedListId || '');
    } else {
      setListId(selectedListId || '');
    }
  }, [isOpen, selectedListId]);

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

  const handleSave = () => {
    if (!canSave) return;
    onSave(trimmedTitle, listId);
  };

  return (
    <div
      className="app-no-drag fixed inset-0 z-50 flex items-start justify-center pt-[14vh] bg-[#4a1a43]/20 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div
        className="w-[640px] bg-white rounded-[40px] p-12 shadow-2xl animate-in slide-in-from-bottom-12 duration-500"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          className="w-full bg-transparent border-none outline-none text-4xl font-[900] mb-10 text-zinc-900 tracking-[-0.05em] placeholder-zinc-100"
          placeholder="添加新任务..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.isComposing) return;
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSave();
            }
          }}
        />
        <div className="flex justify-between items-center border-t border-zinc-50 pt-8">
          <div className="relative">
            <select
              value={listId}
              onChange={(event) => setListId(event.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-zinc-200 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:border-[#d6b4cf] focus:outline-none focus:border-[#8c397d]"
            >
              {(lists || []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <div className="flex gap-5 items-center">
            <button
              onClick={onClose}
              className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-800 active:scale-95"
            >
              放弃
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-10 py-4 rounded-[22px] text-[13px] font-semibold shadow-2xl shadow-[#8c397d]/30 active:scale-95 ${
                canSave
                  ? 'bg-[#8c397d] text-white'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
              }`}
            >
              立即保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
