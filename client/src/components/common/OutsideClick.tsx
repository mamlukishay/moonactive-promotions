import React, { useCallback, useEffect, useRef } from 'react';

interface OutsideClickProp {
  onOutsideClick?: () => void;
  onInsideClick?: () => void;
  children?: React.ReactNode;
  includeEscapeKey?: boolean;
}

const OutsideClick = ({
  children,
  onOutsideClick = () => {},
  onInsideClick = () => {},
  includeEscapeKey = true,
}: OutsideClickProp) => {
  const wrapperElement = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    e => {
      if (!wrapperElement.current) return;
      if (!wrapperElement?.current?.contains(e.target) && document.contains(e.target)) {
        onOutsideClick();
      } else if (onInsideClick) {
        onInsideClick();
      }
    },
    [onOutsideClick, onInsideClick],
  );

  const handleKeyDown = useCallback(
    e => {
      if (e.code === 'Escape' || e.key === 'Escape' || e.keyCode === 27) {
        onOutsideClick();
      }
    },
    [onOutsideClick],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    if (includeEscapeKey) {
      document.addEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleClick, handleKeyDown, includeEscapeKey]);

  return <div ref={wrapperElement}>{children && React.Children.only(children)}</div>;
};

export default OutsideClick;
