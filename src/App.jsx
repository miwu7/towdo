import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize, Minimize, Pin, Plus, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import CalendarDayModal from './components/CalendarDayModal';
import SettingsView from './components/SettingsView';
import MiniModeView from './components/MiniModeView';
import QuickAddModal from './components/QuickAddModal';
import NewListModal from './components/NewListModal';
import TaskDetailModal from './components/TaskDetailModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialLists, initialTasks } from './data/seed';
import { formatDateLabel, getTodayISO } from './utils/date';
import { getHolidayLabel, getSolarTermLabel } from './data/calendarLabels';

const STATUS_LABELS = {
  todo: '待处理',
  doing: '进行中',
  done: '已完成',
};

const UNASSIGNED_LIST_ID = 'list_inbox';
const UNASSIGNED_LIST = { id: UNASSIGNED_LIST_ID, name: '未归档', locked: true, system: true };

const DEFAULT_SETTINGS = {
  highContrast: false,
  fontSmoothing: true,
  autoLaunch: false,
  minimizeToTray: false,
  autoRollover: false,
  completionSound: true,
  quickAddHotkey: true,
  filterOverdueHotkey: true,
  compactMode: false,
};

const App = () => {
  // --- 状态初始化 ---
  const [activeTab, setActiveTab] = useState('list');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [quickAddStatus, setQuickAddStatus] = useState(null);
  const [quickAddListId, setQuickAddListId] = useState(null);
  const [quickAddDate, setQuickAddDate] = useState(null);
  const [includeOverdue, setIncludeOverdue] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarDayISO, setCalendarDayISO] = useState(null);
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [isMiniPinned, setIsMiniPinned] = useState(false);
  const [pulseTaskId, setPulseTaskId] = useState(null);
  const pulseTimerRef = useRef(null);
  const [updateState, setUpdateState] = useState({
    status: 'idle',
    info: null,
    progress: null,
    error: null,
  });

  const handleWindowMinimize = () => window.towdo?.minimizeWindow?.();
  const handleWindowToggleMaximize = () => window.towdo?.toggleMaximize?.();
  const handleWindowClose = () => window.towdo?.closeWindow?.();
  const handleCheckUpdate = () => window.towdo?.checkForUpdates?.();
  const handleDownloadUpdate = () => window.towdo?.downloadUpdate?.();
  const handleInstallUpdate = () => window.towdo?.installUpdate?.();

  const [tasks, setTasks] = useLocalStorage('towdo_tasks', initialTasks);
  const [customLists, setCustomLists] = useLocalStorage('towdo_lists', initialLists);
  const [settings, setSettings] = useLocalStorage('towdo_settings', DEFAULT_SETTINGS);

  // 预留 Firestore 接口（未来扩展）
  const syncToFirestore = () => {
    // TODO: 未来接入 Firebase Firestore，同步任务与清单数据。
  };

  useEffect(() => {
    syncToFirestore();
  }, [tasks, customLists]);

  useEffect(() => {
    setCustomLists((prev) => {
      if (prev.some((list) => list.id === UNASSIGNED_LIST_ID)) return prev;
      return [UNASSIGNED_LIST, ...prev];
    });
  }, [setCustomLists]);

  useEffect(() => {
    const validIds = new Set(customLists.map((list) => list.id));
    setTasks((prev) => {
      let changed = false;
      const next = prev.map((task) => {
        if (!task.listId || !validIds.has(task.listId)) {
          changed = true;
          return { ...task, listId: UNASSIGNED_LIST_ID };
        }
        return task;
      });
      return changed ? next : prev;
    });
  }, [customLists, setTasks]);

  useEffect(() => {
    document.body.classList.toggle('contrast-high', settings.highContrast);
    document.body.style.webkitFontSmoothing = settings.fontSmoothing ? 'antialiased' : 'auto';
    document.body.classList.toggle('compact-mode', settings.compactMode);
  }, [settings.highContrast, settings.fontSmoothing, settings.compactMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('mini-mode', isMiniMode);
    return () => {
      root.classList.remove('mini-mode');
    };
  }, [isMiniMode]);

  useEffect(() => {
    if (!window.towdo) return;
    window.towdo.setAutoLaunch(settings.autoLaunch);
    window.towdo.setMinimizeToTray(settings.minimizeToTray);
  }, [settings.autoLaunch, settings.minimizeToTray]);

  useEffect(() => {
    if (!window.towdo?.setMiniMode) return;
    window.towdo.setMiniMode(isMiniMode);
    if (isMiniMode && window.towdo?.setMiniWindowSize) {
      try {
        const saved = localStorage.getItem('towdo_mini_size');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.width && parsed?.height) {
            window.towdo.setMiniWindowSize(parsed);
            return;
          }
        }
        const fallback = { width: 440, height: 620 };
        localStorage.setItem('towdo_mini_size', JSON.stringify(fallback));
        window.towdo.setMiniWindowSize(fallback);
      } catch (error) {
        console.warn('读取迷你尺寸失败', error);
      }
    }
  }, [isMiniMode]);

  useEffect(() => {
    if (!window.towdo?.setMiniPinned) return;
    if (!isMiniMode) {
      window.towdo.setMiniPinned(false);
      return;
    }
    window.towdo.setMiniPinned(isMiniPinned);
  }, [isMiniMode, isMiniPinned]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!window.towdo?.onUpdateEvent) return;
    const off = window.towdo.onUpdateEvent((event) => {
      if (!event?.type) return;
      if (event.type === 'checking') {
        setUpdateState({ status: 'checking', info: null, progress: null, error: null });
        return;
      }
      if (event.type === 'available') {
        setUpdateState({ status: 'available', info: event.payload || null, progress: null, error: null });
        return;
      }
      if (event.type === 'none') {
        setUpdateState({ status: 'none', info: event.payload || null, progress: null, error: null });
        return;
      }
      if (event.type === 'progress') {
        setUpdateState((prev) => ({ ...prev, status: 'progress', progress: event.payload || null }));
        return;
      }
      if (event.type === 'downloaded') {
        setUpdateState({ status: 'downloaded', info: event.payload || null, progress: null, error: null });
        return;
      }
      if (event.type === 'error') {
        setUpdateState({ status: 'error', info: null, progress: null, error: event.payload?.message || '更新失败' });
      }
    });
    return () => {
      if (typeof off === 'function') off();
    };
  }, []);

  // --- 视图逻辑 ---
  const smartViews = ['list', 'calendar', 'kanban', 'settings'];
  const todayISO = getTodayISO();

  const defaultListId = useMemo(
    () => customLists.find((list) => list.id === UNASSIGNED_LIST_ID)?.id || customLists[0]?.id || null,
    [customLists]
  );

  const activeListName = useMemo(() => {
    if (smartViews.includes(activeTab)) {
      return customLists.find((list) => list.id === defaultListId)?.name || '未归档';
    }
    return customLists.find((list) => list.id === activeTab)?.name || '未命名清单';
  }, [activeTab, customLists, defaultListId, smartViews]);

  const activeListId = useMemo(() => {
    if (smartViews.includes(activeTab)) return defaultListId;
    return activeTab;
  }, [activeTab, defaultListId, smartViews]);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'list') {
      return tasks.filter((task) => {
        if (task.date === todayISO) return true;
        if (!includeOverdue) return false;
        return task.date < todayISO && !task.completed;
      });
    }
    if (smartViews.includes(activeTab)) return tasks;
    return tasks.filter((task) => task.listId === activeTab);
  }, [activeTab, tasks, todayISO, includeOverdue]);

  const sortedTasks = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    return [...filteredTasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (priorityRank[a.priority] !== priorityRank[b.priority]) {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }
      return a.date.localeCompare(b.date);
    });
  }, [filteredTasks]);

  const listSubtitle = useMemo(() => {
    if (activeTab !== 'list') {
      return `你有 ${sortedTasks.filter((task) => !task.completed).length} 个待办事项需要处理。`;
    }
    const pending = sortedTasks.filter((task) => !task.completed).length;
    return includeOverdue
      ? `已开启逾期筛选，当前共有 ${pending} 个任务需要处理。`
      : `仅显示今日任务，当前共有 ${pending} 个任务需要处理。`;
  }, [activeTab, sortedTasks, includeOverdue]);

  const calendarDayTasks = useMemo(() => {
    if (!calendarDayISO) return [];
    return tasks.filter((task) => task.date === calendarDayISO);
  }, [tasks, calendarDayISO]);

  const calendarDayLabel = useMemo(() => {
    if (!calendarDayISO) return { holiday: null, solar: null };
    return {
      holiday: getHolidayLabel(calendarDayISO),
      solar: getSolarTermLabel(calendarDayISO),
    };
  }, [calendarDayISO]);

  const miniSections = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    const sortByPriority = (items) =>
      [...items].sort((a, b) => {
        if (priorityRank[a.priority] !== priorityRank[b.priority]) {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        return a.title.localeCompare(b.title);
      });

    return {
      todayTodo: sortByPriority(tasks.filter((task) => task.date === todayISO && !task.completed)),
      todayDone: sortByPriority(tasks.filter((task) => task.date === todayISO && task.completed)),
      overdueTodo: sortByPriority(tasks.filter((task) => task.date < todayISO && !task.completed)),
    };
  }, [tasks, todayISO]);

  // --- 自动延期 ---
  useEffect(() => {
    if (!settings.autoRollover) return;
    const checkDateChange = () => {
      const last = localStorage.getItem('towdo_last_date');
      if (last && last === todayISO) return;
      localStorage.setItem('towdo_last_date', todayISO);
      setTasks((prev) =>
        prev.map((task) =>
          !task.completed && task.date < todayISO ? { ...task, date: todayISO } : task
        )
      );
    };
    checkDateChange();
    const timer = setInterval(checkDateChange, 60000);
    return () => clearInterval(timer);
  }, [settings.autoRollover, todayISO, setTasks]);

  // --- 完成音效 ---
  const playCompleteSound = () => {
    if (!settings.completionSound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (error) {
      // 忽略音频错误
    }
  };

  // --- CRUD 逻辑 ---
  const handleToggleTask = (id) => {
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
    setPulseTaskId(id);
    pulseTimerRef.current = setTimeout(() => {
      setPulseTaskId(null);
    }, 320);
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nextCompleted = !task.completed;
        if (nextCompleted) playCompleteSound();
        return {
          ...task,
          completed: nextCompleted,
          status: nextCompleted ? 'done' : 'todo',
        };
      })
    );
  };

  const handleAddList = (name) => {
    if (!name.trim()) return;
    const newList = { id: `list_${Date.now()}`, name: name.trim() };
    setCustomLists((prev) => [...prev, newList]);
    setShowNewListModal(false);
    setActiveTab(newList.id);
  };

  const handleDeleteList = (event, id) => {
    event.stopPropagation();
    const target = customLists.find((list) => list.id === id);
    if (target?.locked || id === UNASSIGNED_LIST_ID) return;
    if (customLists.length <= 1) return;
    setCustomLists((prev) => prev.filter((list) => list.id !== id));
    setTasks((prev) => prev.filter((task) => task.listId !== id));
    if (activeTab === id) setActiveTab('list');
  };

  const handleAddTask = (title, listId, dateOverride = null) => {
    if (!title.trim()) return;
    const resolvedListId = listId || activeListId || UNASSIGNED_LIST_ID;
    const status = quickAddStatus || 'todo';
    const resolvedDate = dateOverride || quickAddDate || todayISO;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      date: resolvedDate,
      priority: 'medium',
      completed: status === 'done',
      listId: resolvedListId,
      status,
      desc: '',
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowQuickAdd(false);
    setQuickAddStatus(null);
    setQuickAddListId(null);
    setQuickAddDate(null);
  };

  const handleUpdateTask = (updatedTask) => {
    const prevTask = tasks.find((task) => task.id === updatedTask.id);
    if (prevTask && prevTask.status !== 'done' && updatedTask.status === 'done') {
      playCompleteSound();
    }
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setSelectedTask(null);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSelectedTask(null);
  };

  const handleMoveTask = (id, nextStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        if (task.status !== 'done' && nextStatus === 'done') playCompleteSound();
        return {
          ...task,
          status: nextStatus,
          completed: nextStatus === 'done',
        };
      })
    );
  };

  const handleOpenTask = (task) => {
    setSelectedTask(task);
  };

  // --- 日历控制 ---
  const handlePrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleResetToday = () => {
    const now = new Date();
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const openQuickAdd = (status = null, listId = null, dateISO = null) => {
    setQuickAddStatus(status);
    setQuickAddListId(listId || activeListId);
    setQuickAddDate(dateISO || null);
    setShowQuickAdd(true);
  };

  const closeQuickAdd = () => {
    setShowQuickAdd(false);
    setQuickAddStatus(null);
    setQuickAddListId(null);
    setQuickAddDate(null);
  };

  // --- 快捷键 ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
      if (isInput) return;

      if (settings.quickAddHotkey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openQuickAdd();
      }

      if (settings.filterOverdueHotkey && event.altKey && event.key.toLowerCase() === 'o') {
        setIncludeOverdue((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.quickAddHotkey, settings.filterOverdueHotkey, activeListId]);

  // --- 设置操作 ---
  const handleToggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    const payload = {
      tasks,
      lists: customLists,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twodo-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
        if (data.lists && Array.isArray(data.lists)) setCustomLists(data.lists);
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      } catch (error) {
        console.warn('导入失败', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (isMiniMode) {
    return (
      <div className="app-drag w-full h-full min-h-0 min-w-0 bg-transparent flex items-start justify-start">
        <MiniModeView
          todayTodo={miniSections.todayTodo}
          todayDone={miniSections.todayDone}
          overdueTodo={miniSections.overdueTodo}
          lists={customLists}
          dateISO={todayISO}
          isPinned={isMiniPinned}
          onTogglePin={() => setIsMiniPinned((prev) => !prev)}
          onExit={() => setIsMiniMode(false)}
          onToggleTask={handleToggleTask}
          onAddTask={(title) => handleAddTask(title, UNASSIGNED_LIST_ID)}
        />
      </div>
    );
  }

  return (
    <div className={`app-drag flex h-full w-full min-h-[700px] min-w-[1024px] bg-[#f7f1f8] text-zinc-900 selection:bg-[#eddde9] ${
      settings.highContrast ? 'contrast-high' : ''
    }`}>
      <Sidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenNewList={() => setShowNewListModal(true)}
        lists={customLists}
        tasks={tasks}
        onDeleteList={handleDeleteList}
        isCompact={settings.compactMode}
      />

      <main className="flex-1 min-w-0 min-h-0 flex flex-col relative bg-white group">
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-full border border-[#eddde9] bg-white/90 p-1 shadow-lg shadow-[#8c397d]/10"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            <button
              type="button"
              onClick={handleWindowMinimize}
              title="缩小"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-[#f7f1f8] hover:text-zinc-700 active:scale-95"
            >
              <Minimize size={14} strokeWidth={2.6} />
            </button>
            <button
              type="button"
              onClick={handleWindowToggleMaximize}
              title="放大/还原"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-[#f7f1f8] hover:text-zinc-700 active:scale-95"
            >
              <Maximize size={14} strokeWidth={2.6} />
            </button>
            <button
              type="button"
              onClick={handleWindowClose}
              title="关闭"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
            >
              <X size={14} strokeWidth={2.8} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMiniMode(true)}
            title="置顶锁定（迷你看板）"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eddde9] bg-white/90 text-[#8c397d] shadow-lg shadow-[#8c397d]/15 opacity-0 translate-y-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8c397d]/25 focus-visible:opacity-100 focus-visible:translate-y-0 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <Pin size={18} strokeWidth={2.6} />
          </button>
        </div>
        {(activeTab === 'list' || !smartViews.includes(activeTab)) && (
          <ListView
            title={activeTab === 'list' ? '今日待办' : activeListName}
            subtitle={listSubtitle}
            dateLabel={`TODAY · ${formatDateLabel(todayISO)}`}
            tasks={sortedTasks}
            lists={customLists}
            onToggleTask={handleToggleTask}
            onOpenTask={handleOpenTask}
            showOverdueToggle={activeTab === 'list'}
            includeOverdue={includeOverdue}
            onToggleOverdue={() => setIncludeOverdue((prev) => !prev)}
            isCompact={settings.compactMode}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            onOpenTask={handleOpenTask}
            onAddTask={(status) => openQuickAdd(status, activeListId)}
            onMoveTask={handleMoveTask}
            isCompact={settings.compactMode}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            monthDate={calendarMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onResetToday={handleResetToday}
            tasks={tasks}
            onOpenTask={handleOpenTask}
            onOpenDay={(iso) => setCalendarDayISO(iso)}
            onToggleTask={handleToggleTask}
            pulseTaskId={pulseTaskId}
            isCompact={settings.compactMode}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onToggle={handleToggleSetting}
            onExportData={handleExportData}
            onImportData={handleImportData}
            updateState={updateState}
            onCheckUpdate={handleCheckUpdate}
            onDownloadUpdate={handleDownloadUpdate}
            onInstallUpdate={handleInstallUpdate}
          />
        )}

        <button
          onClick={() => openQuickAdd(null, activeListId)}
          className="absolute bottom-7 right-7 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-[#8c397d] text-white rounded-[22px] shadow-[0_20px_40px_-12px_rgba(140,57,125,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
        >
          <Plus size={22} strokeWidth={3.6} />
        </button>
      </main>

      <CalendarDayModal
        isOpen={!!calendarDayISO}
        dateISO={calendarDayISO}
        holiday={calendarDayLabel.holiday}
        solar={calendarDayLabel.solar}
        tasks={calendarDayTasks}
        lists={customLists}
        onClose={() => setCalendarDayISO(null)}
        onOpenTask={handleOpenTask}
        onAddTask={(title, listId) => {
          if (calendarDayISO) handleAddTask(title, listId, calendarDayISO);
        }}
      />

      <NewListModal
        isOpen={showNewListModal}
        onClose={() => setShowNewListModal(false)}
        onCreate={handleAddList}
      />

      <QuickAddModal
        isOpen={showQuickAdd}
        listName={activeListName}
        lists={customLists}
        selectedListId={quickAddListId || activeListId}
        statusLabel={quickAddStatus ? STATUS_LABELS[quickAddStatus] : null}
        onClose={closeQuickAdd}
        onSave={(title, listId) => handleAddTask(title, listId, quickAddDate)}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        lists={customLists}
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default App;

