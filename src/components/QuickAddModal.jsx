import React, { useEffect, useState } from 'react';
import { Hash, ChevronDown } from 'lucide-react';

// 快速添加：全屏模糊 + 巨大输入框
const QuickAddModal = ({
  isOpen,
  listName,
  lists,
  selectedListId,
  statusLabel,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [listId, setListId] = useState(selectedListId || '');

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

  const currentList = lists?.find((item) => item.id === listId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-[#4a1a43]/20 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div
        className="w-[700px] bg-white rounded-[48px] p-14 shadow-2xl animate-in slide-in-from-bottom-12 duration-500"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          className="w-full bg-transparent border-none outline-none text-5xl font-[900] mb-12 text-zinc-900 tracking-[-0.06em] placeholder-zinc-100"
          placeholder="添加新任务..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSave(title, listId)}
        />
        <div className="flex justify-between items-center border-t border-zinc-50 pt-10">
          <div className="relative">
            <select
              value={listId}
              onChange={(event) => setListId(event.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-zinc-200 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:border-[#d6b4cf] focus:outline-none focus:border-[#8c397d]"
            >
              {(lists || []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <div className="flex gap-6 items-center">
            <button
              onClick={onClose}
              className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 active:scale-95"
            >
              放弃
            </button>
            <button
              onClick={() => onSave(title, listId)}
              className="px-12 py-5 rounded-[24px] bg-[#8c397d] text-white text-sm font-black shadow-2xl shadow-[#8c397d]/30 active:scale-95"
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
