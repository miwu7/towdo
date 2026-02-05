import { fromISODate, toISODate } from '../utils/date';

const HOLIDAYS_2026 = [
  // 法定节假日（国务院办公厅 2025-11-04 通知）
  { name: '元旦', start: '2026-01-01', end: '2026-01-03' },
  { name: '春节', start: '2026-02-15', end: '2026-02-23' },
  { name: '清明节', start: '2026-04-04', end: '2026-04-06' },
  { name: '劳动节', start: '2026-05-01', end: '2026-05-05' },
  { name: '端午节', start: '2026-06-19', end: '2026-06-21' },
  { name: '中秋节', start: '2026-09-25', end: '2026-09-27' },
  { name: '国庆节', start: '2026-10-01', end: '2026-10-07' },

  // 传统农历节日（2026）
  { name: '腊八节', start: '2026-01-26', end: '2026-01-26' },
  { name: '小年（北）', start: '2026-02-10', end: '2026-02-10' },
  { name: '小年（南）', start: '2026-02-11', end: '2026-02-11' },
  { name: '除夕', start: '2026-02-16', end: '2026-02-16' },
  { name: '春节', start: '2026-02-17', end: '2026-02-17' },
  { name: '元宵节', start: '2026-03-03', end: '2026-03-03' },
  { name: '龙抬头', start: '2026-03-20', end: '2026-03-20' },
  { name: '上巳节', start: '2026-04-19', end: '2026-04-19' },
  { name: '端午节', start: '2026-06-19', end: '2026-06-19' },
  { name: '七夕节', start: '2026-08-19', end: '2026-08-19' },
  { name: '中元节', start: '2026-08-27', end: '2026-08-27' },
  { name: '中秋节', start: '2026-09-25', end: '2026-09-25' },
  { name: '重阳节', start: '2026-10-18', end: '2026-10-18' },
  { name: '寒衣节', start: '2026-11-09', end: '2026-11-09' },
  { name: '下元节', start: '2026-11-23', end: '2026-11-23' },

  // 常见纪念日/国际节日（固定公历）
  { name: '情人节', start: '2026-02-14', end: '2026-02-14' },
  { name: '妇女节', start: '2026-03-08', end: '2026-03-08' },
  { name: '植树节', start: '2026-03-12', end: '2026-03-12' },
  { name: '消费者权益日', start: '2026-03-15', end: '2026-03-15' },
  { name: '愚人节', start: '2026-04-01', end: '2026-04-01' },
  { name: '世界地球日', start: '2026-04-22', end: '2026-04-22' },
  { name: '青年节', start: '2026-05-04', end: '2026-05-04' },
  { name: '护士节', start: '2026-05-12', end: '2026-05-12' },
  { name: '儿童节', start: '2026-06-01', end: '2026-06-01' },
  { name: '建党节', start: '2026-07-01', end: '2026-07-01' },
  { name: '建军节', start: '2026-08-01', end: '2026-08-01' },
  { name: '教师节', start: '2026-09-10', end: '2026-09-10' },
  { name: '万圣节', start: '2026-10-31', end: '2026-10-31' },
  { name: '平安夜', start: '2026-12-24', end: '2026-12-24' },
  { name: '圣诞节', start: '2026-12-25', end: '2026-12-25' },
];

const SOLAR_TERMS_2026 = {
  '2026-01-05': '小寒',
  '2026-01-20': '大寒',
  '2026-02-04': '立春',
  '2026-02-18': '雨水',
  '2026-03-05': '惊蛰',
  '2026-03-20': '春分',
  '2026-04-05': '清明',
  '2026-04-20': '谷雨',
  '2026-05-05': '立夏',
  '2026-05-21': '小满',
  '2026-06-05': '芒种',
  '2026-06-21': '夏至',
  '2026-07-07': '小暑',
  '2026-07-23': '大暑',
  '2026-08-07': '立秋',
  '2026-08-23': '处暑',
  '2026-09-07': '白露',
  '2026-09-23': '秋分',
  '2026-10-08': '寒露',
  '2026-10-23': '霜降',
  '2026-11-07': '立冬',
  '2026-11-22': '小雪',
  '2026-12-07': '大雪',
  '2026-12-22': '冬至',
};

const buildHolidayMap = (year) => {
  if (year !== 2026) return {};
  const map = {};
  HOLIDAYS_2026.forEach((holiday) => {
    const start = fromISODate(holiday.start);
    const end = fromISODate(holiday.end);
    const date = new Date(start);
    while (date <= end) {
      const iso = toISODate(date);
      if (!map[iso]) map[iso] = [];
      if (!map[iso].includes(holiday.name)) map[iso].push(holiday.name);
      date.setDate(date.getDate() + 1);
    }
  });
  return map;
};

export const getHolidayLabel = (iso) => {
  if (!iso) return null;
  const year = Number(iso.slice(0, 4));
  const map = buildHolidayMap(year);
  return map[iso] || null;
};

export const getSolarTermLabel = (iso) => {
  if (!iso) return null;
  const year = Number(iso.slice(0, 4));
  if (year !== 2026) return null;
  return SOLAR_TERMS_2026[iso] || null;
};
