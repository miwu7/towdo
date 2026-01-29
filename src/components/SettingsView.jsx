import React, { useRef } from 'react';
import {
  Bell,
  Contrast,
  Cpu,
  Download,
  FileJson,
  Filter,
  HardDrive,
  Keyboard,
  Monitor,
  Power,
  Rocket,
  Search,
  Settings2,
  Volume2,
  Upload,
} from 'lucide-react';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-16 h-9 rounded-full transition-all duration-500 ${
      checked ? 'bg-[#8c397d]' : 'bg-zinc-200'
    } active:scale-95 shadow-inner`}
  >
    <span
      className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-lg transition-all duration-500 ${
        checked ? 'translate-x-7' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingsSection = ({ title, children }) => (
  <section className="mb-14">
    <h2 className="text-4xl lg:text-5xl font-[900] tracking-[-0.04em] text-zinc-900 mb-8">{title}</h2>
    <div className="space-y-5">{children}</div>
  </section>
);

const SettingRow = ({ icon: Icon, title, desc, action, right }) => (
  <div className="flex items-center justify-between gap-6 p-6 rounded-[28px] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#f7f1f8] text-[#8c397d] flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-black text-zinc-900">{title}</h3>
        {desc && <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{desc}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
    {right && <div className="shrink-0">{right}</div>}
  </div>
);

const SettingsView = ({ settings, onToggle, onExportData, onImportData }) => {
  const fileRef = useRef(null);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-5xl w-full mx-auto py-16 md:py-24 px-6 md:px-12">
        <header className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#8c397d]">TwoDo Settings</p>
          <h1 className="text-5xl md:text-7xl font-[900] tracking-[-0.06em] text-zinc-900 mt-4">
            功能设置
          </h1>
        </header>

        <SettingsSection title="界面设置">
          <SettingRow
            icon={Contrast}
            title="对比度"
            desc="标准 / 高对比度（针对视障或强光环境）"
            right={<Toggle checked={settings.highContrast} onChange={() => onToggle('highContrast')} />}
          />
          <SettingRow
            icon={Cpu}
            title="字体渲染"
            desc="开启硬件加速平滑，增强中文视觉效果"
            right={<Toggle checked={settings.fontSmoothing} onChange={() => onToggle('fontSmoothing')} />}
          />
        </SettingsSection>

        <SettingsSection title="系统集成">
          <SettingRow
            icon={Power}
            title="开机自启"
            desc="系统启动时自动运行 TwoDo 桌面端"
            right={<Toggle checked={settings.autoLaunch} onChange={() => onToggle('autoLaunch')} />}
          />
          <SettingRow
            icon={HardDrive}
            title="托盘运行"
            desc="点击关闭按钮时隐藏到系统托盘，保持后台运行"
            right={<Toggle checked={settings.minimizeToTray} onChange={() => onToggle('minimizeToTray')} />}
          />
          <SettingRow
            icon={Rocket}
            title="全局快捷键"
            desc="Alt + Space 呼出快速添加任务（需系统权限）"
            right={<Toggle checked={settings.globalHotkey} onChange={() => onToggle('globalHotkey')} />}
          />
          <SettingRow
            icon={Bell}
            title="原生通知"
            desc="使用系统通知中心提醒逾期任务"
            right={<Toggle checked={settings.nativeNotifications} onChange={() => onToggle('nativeNotifications')} />}
          />
          <SettingRow
            icon={Monitor}
            title="磁贴/小组件"
            desc="在系统侧边栏显示今日进度百分比（需系统支持）"
            right={<Toggle checked={settings.widgets} onChange={() => onToggle('widgets')} />}
          />
        </SettingsSection>

        <SettingsSection title="任务逻辑">
          <SettingRow
            icon={Settings2}
            title="自动延期"
            desc="未完成任务在午夜自动重排至“今日待办”"
            right={<Toggle checked={settings.autoRollover} onChange={() => onToggle('autoRollover')} />}
          />
          <SettingRow
            icon={Volume2}
            title="完成音效"
            desc="极简高频“叮”声"
            right={<Toggle checked={settings.completionSound} onChange={() => onToggle('completionSound')} />}
          />
        </SettingsSection>

        <SettingsSection title="快捷操作">
          <SettingRow
            icon={Search}
            title="全局搜索"
            desc="Cmd + K"
            right={<Toggle checked={settings.searchHotkey} onChange={() => onToggle('searchHotkey')} />}
          />
          <SettingRow
            icon={Keyboard}
            title="快速新建"
            desc="N"
            right={<Toggle checked={settings.quickAddHotkey} onChange={() => onToggle('quickAddHotkey')} />}
          />
          <SettingRow
            icon={Filter}
            title="过滤逾期"
            desc="Alt + O"
            right={<Toggle checked={settings.filterOverdueHotkey} onChange={() => onToggle('filterOverdueHotkey')} />}
          />
        </SettingsSection>

        <SettingsSection title="账户与同步">
          <SettingRow
            icon={FileJson}
            title="数据同步"
            desc="当前为本地模式（Local Only）"
            right={<span className="text-xs font-black uppercase tracking-widest text-zinc-400">Local</span>}
          />
          <SettingRow
            icon={Download}
            title="导出 JSON"
            desc="备份所有任务清单"
            action={
              <button
                onClick={onExportData}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95"
              >
                导出
              </button>
            }
          />
          <SettingRow
            icon={Upload}
            title="导入数据"
            desc="恢复之前的备份文件"
            action={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 text-xs font-black uppercase tracking-widest hover:bg-zinc-50 active:scale-95"
                >
                  选择文件
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  onChange={onImportData}
                  className="hidden"
                />
              </div>
            }
          />
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsView;
