import { useEffect, useState } from 'react';

// 本地持久化 Hook：负责读取与写入 localStorage
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.warn(`读取 ${key} 失败，使用默认值`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`写入 ${key} 失败`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
