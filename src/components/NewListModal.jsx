import React, { useEffect, useState } from 'react';

// 新建清单弹窗
const NewListModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

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
      className="app-no-drag fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-[450px] bg-white rounded-[40px] p-12 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-3xl font-[900] mb-8 tracking-tighter text-[#4a1a43]">新建分类</h3>
        <input
          autoFocus
          className="w-full bg-[#f7f1f8] border-none outline-none px-8 py-6 rounded-[24px] font-black text-lg mb-8 placeholder-[#e6cfe1] text-[#4a1a43]"
          placeholder="清单名称..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onCreate(name)}
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors active:scale-95"
          >
            取消
          </button>
          <button
            onClick={() => onCreate(name)}
            className="flex-[2] py-5 bg-[#8c397d] text-white rounded-[24px] text-sm font-black shadow-2xl shadow-[#8c397d]/20 active:scale-95"
          >
            创建分类
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewListModal;
