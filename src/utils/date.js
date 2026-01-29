// 日期工具：统一格式化与日历计算
export const getTodayISO = () => {
  const now = new Date();
  return toISODate(now);
};

export const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fromISODate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateLabel = (iso) => {
  if (!iso) return '';
  const date = fromISODate(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatMonthLabel = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
};

export const addDaysISO = (offset, base = new Date()) => {
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return toISODate(date);
};

export const isSameDay = (aISO, bISO) => {
  return aISO === bISO;
};

// 构建日历网格：固定 6 行 x 7 列
export const buildMonthGrid = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // 周一为 0
  const startDate = new Date(year, month, 1 - startWeekday);

  return Array.from({ length: 42 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      iso: toISODate(date),
      inMonth: date.getMonth() === month,
      day: date.getDate(),
    };
  });
};
