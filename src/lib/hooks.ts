import { useEffect, useRef, MutableRefObject } from 'react';

export const useInfiniteScroll = (
  callback: Function
): MutableRefObject<any> => {
  const list = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const current: HTMLElement = list.current;
      const { offsetHeight, scrollTop, scrollHeight } = current;
      if (offsetHeight + scrollTop !== scrollHeight) return;
      callback();
    };

    const current: HTMLElement = list.current;
    current.addEventListener('scroll', handleScroll);
    return () => current.removeEventListener('scroll', handleScroll);
  }, [callback]);

  return list;
};
