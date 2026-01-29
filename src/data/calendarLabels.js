import { fromISODate, toISODate } from '../utils/date';

const HOLIDAYS_2026 = [
  { name: '元旦', start: '2026-01-01', end: '2026-01-03' },
  { name: '春节', start: '2026-02-15', end: '2026-02-23' },
  { name: '清明节', start: '2026-04-04', end: '2026-04-06' },
  { name: '劳动节', start: '2026-05-01', end: '2026-05-05' },
  { name: '端午节', start: '2026-06-19', end: '2026-06-21' },
  { name: '中秋节', start: '2026-09-25', end: '2026-09-27' },
  { name: '国庆节', start: '2026-10-01', end: '2026-10-07' },
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
      map[toISODate(date)] = holiday.name;
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
