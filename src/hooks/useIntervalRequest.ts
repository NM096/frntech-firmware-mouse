import { useEffect, useRef, useState } from 'react';

interface UseIntervalRequestOptions {
  interval?: number; // 定时器间隔，默认 5000ms
  immediate?: boolean; // 是否立即执行一次请求
  onError?: (err: any) => void; // 请求错误处理
}

/**
 * useIntervalRequest
 * @param requestFn 异步请求函数，返回 Promise<T>
 * @param options 配置项
 */
export function useIntervalRequest<T>(requestFn: () => Promise<T>, options: UseIntervalRequestOptions = {}) {
  const { interval = 5000, immediate = true, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await requestFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      // @ts-expect-error
      if (intervalRef.current) clearInterval(intervalRef?.current);
    };
  }, [interval, requestFn]);

  return { data, loading, error, refresh: fetchData };
}
