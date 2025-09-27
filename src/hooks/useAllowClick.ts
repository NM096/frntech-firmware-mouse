import { useEffect, useRef } from 'react';

export function useAllowClick<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute('data-allow-click', 'true');
    }
  }, []);

  return ref;
}
