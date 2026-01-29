import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import CalendarDayModal from './components/CalendarDayModal';
import SettingsView from './components/SettingsView';
import WidgetView from './components/WidgetView';
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

const DEFAULT_SETTINGS = {
  highContrast: false,
  fontSmoothing: true,
  autoLaunch: false,
  minimizeToTray: false,
  globalHotkey: false,
  nativeNotifications: false,
  widgets: false,
  autoRollover: false,
  completionSound: true,
  searchHotkey: true,
  quickAddHotkey: true,
  filterOverdueHotkey: true,
};

const App = () => {
  const isWidget = window.location.search.includes('widget=1');

  // --- 状态初始化 ---
  const [activeTab, setActiveTab] = useState('list');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [quickAddStatus, setQuickAddStatus] = useState(null);
  const [quickAddListId, setQuickAddListId] = useState(null);
  const [includeOverdue, setIncludeOverdue] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarDayISO, setCalendarDayISO] = useState(null);

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
    document.body.classList.toggle('contrast-high', settings.highContrast);
    document.body.style.webkitFontSmoothing = settings.fontSmoothing ? 'antialiased' : 'auto';
  }, [settings.highContrast, settings.fontSmoothing]);

  useEffect(() => {
    if (!window.towdo) return;
    window.towdo.setAutoLaunch(settings.autoLaunch);
    window.towdo.setMinimizeToTray(settings.minimizeToTray);
    window.towdo.setGlobalHotkey(settings.globalHotkey);
    window.towdo.setWidgets(settings.widgets);
  }, [settings.autoLaunch, settings.minimizeToTray, settings.globalHotkey, settings.widgets]);

  useEffect(() => {
    if (!window.towdo) return undefined;
    const handler = () => {
      setShowQuickAdd(true);
      setQuickAddStatus(null);
      setQuickAddListId(null);
    };
    window.towdo.onOpenQuickAdd(handler);
    return () => window.towdo.offOpenQuickAdd(handler);
  }, []);

  // --- 视图逻辑 ---
  const smartViews = ['list', 'calendar', 'kanban', 'settings'];
  const todayISO = getTodayISO();

  const activeListName = useMemo(() => {
    if (smartViews.includes(activeTab)) return customLists[0]?.name || '系统开发';
    return customLists.find((list) => list.id === activeTab)?.name || '未命名清单';
  }, [activeTab, customLists]);

  const activeListId = useMemo(() => {
    if (smartViews.includes(activeTab)) return customLists[0]?.id || null;
    return activeTab;
  }, [activeTab, customLists]);

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

  if (isWidget) {
    return (
      <div className="w-full h-full p-2 bg-transparent">
        <WidgetView tasks={tasks.filter((task) => task.date === todayISO)} />
      </div>
    );
  }

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
    if (customLists.length <= 1) return;
    setCustomLists((prev) => prev.filter((list) => list.id !== id));
    setTasks((prev) => prev.filter((task) => task.listId !== id));
    if (activeTab === id) setActiveTab('list');
  };

  const handleAddTask = (title, listId) => {
    if (!title.trim()) return;
    const resolvedListId = listId || activeListId || customLists[0]?.id;
    const status = quickAddStatus || 'todo';
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      date: todayISO,
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

  const openQuickAdd = (status = null, listId = null) => {
    setQuickAddStatus(status);
    setQuickAddListId(listId || activeListId);
    setShowQuickAdd(true);
  };

  const closeQuickAdd = () => {
    setShowQuickAdd(false);
    setQuickAddStatus(null);
    setQuickAddListId(null);
  };

  // --- 快捷键 ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
      if (isInput) return;

      if (settings.searchHotkey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActiveTab('list');
      }

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
  }, [settings.searchHotkey, settings.quickAddHotkey, settings.filterOverdueHotkey, activeListId]);

  // --- 原生通知 ---
  useEffect(() => {
    if (!settings.nativeNotifications) return;
    if (!('Notification' in window)) return;

    const notify = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission !== 'granted') return;

      const overdue = tasks.filter((task) => task.date < todayISO && !task.completed);
      if (overdue.length === 0) return;

      new Notification('TwoDo 逾期提醒', {
        body: `你有 ${overdue.length} 个逾期任务需要处理。`,
      });
    };

    notify();
  }, [settings.nativeNotifications, tasks, todayISO]);

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

  return (
    <div className={`flex h-full w-full min-h-[700px] min-w-[1024px] bg-[#f7f1f8] text-zinc-900 selection:bg-[#eddde9] ${
      settings.highContrast ? 'contrast-high' : ''
    }`}>
      <Sidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenNewList={() => setShowNewListModal(true)}
        lists={customLists}
        tasks={tasks}
        onDeleteList={handleDeleteList}
      />

      <main className="flex-1 min-w-0 min-h-0 flex flex-col relative bg-white">
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
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            onOpenTask={handleOpenTask}
            onAddTask={(status) => openQuickAdd(status, activeListId)}
            onMoveTask={handleMoveTask}
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
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onToggle={handleToggleSetting}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}

        <button
          onClick={() => openQuickAdd(null, activeListId)}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 md:w-20 md:h-20 bg-[#8c397d] text-white rounded-[28px] shadow-[0_25px_50px_-12px_rgba(140,57,125,0.5)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20"
        >
          <Plus size={28} strokeWidth={4} />
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
        onSave={handleAddTask}
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

