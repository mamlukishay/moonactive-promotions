import React from 'react';

export type IntersectionOptions = {
  target: React.RefObject<Element>;
  root?: React.RefObject<Element>;
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect: IntersectionObserverCallback;
};

export function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
}: IntersectionOptions) {
  React.useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: root && root.current,
      rootMargin,
      threshold,
    });

    const el = target.current as Element;
    if (!el) return;
    observer.observe(el);
    return () => observer.unobserve(el);
  });
}
