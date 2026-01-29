import React from 'react';

const WidgetView = ({ tasks }) => {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="w-full h-full bg-[#f7f1f8] text-zinc-900 rounded-[26px] border border-[#eddde9] shadow-xl shadow-[#8c397d]/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8c397d]">TwoDo</p>
          <h2 className="text-2xl font-[900] tracking-[-0.04em]">今日进度</h2>
        </div>
        <div className="text-3xl font-[900] text-[#8c397d]">{percent}%</div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-2 rounded-full bg-white">
            <div className="h-2 rounded-full bg-[#8c397d]" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            <span>已完成 {done}</span>
            <span>待办 {pending}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
        总任务 {total}
      </div>
    </div>
  );
};

export default WidgetView;
