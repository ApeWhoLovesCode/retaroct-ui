import { isMobile, MouseTouchEvent } from '../utils/handleDom';
import useTouch, { TouchState } from '../use-touch';
import useLatest from '../use-latest';

export type UseTouchesOptions = {
  onTouchStart?: (e: MouseTouchEvent) => void;
  onTouchMove?: (e: MouseTouchEvent, touchState?: TouchState) => void;
  onTouchEnd?: (e: MouseTouchEvent) => void;
};

/** 绑定手指触摸或鼠标事件 */
export default function useTouchEvent(options: UseTouchesOptions = {}) {
  const touch = useTouch();
  const optionsRef = useLatest(options);

  const onTouchStart = (e: MouseTouchEvent) => {
    touch.start(e);
    if (!isMobile()) {
      document.addEventListener('mousemove', onTouchMove, true);
      document.addEventListener('mouseup', onTouchEnd, true);
    }
    optionsRef.current.onTouchStart?.(e);
  };
  const onTouchMove = (e: MouseTouchEvent) => {
    touch.move(e);
    optionsRef.current.onTouchMove?.(e, touch.info);
  };
  const onTouchEnd = (e: MouseTouchEvent) => {
    touch.move(e);
    if (!isMobile()) {
      document.removeEventListener('mousemove', onTouchMove, true);
      document.removeEventListener('mouseup', onTouchEnd, true);
    }
    optionsRef.current.onTouchEnd?.(e);
  };

  return {
    ...touch,
    onTouchFn: onTouchMouse({ onTouchStart, onTouchMove, onTouchEnd }),
  };
}

/** 处理鼠标或手指触摸事件 */
export const onTouchMouse = ({ onTouchStart, onTouchMove, onTouchEnd }: UseTouchesOptions) => {
  if (!isMobile()) {
    return {
      onMouseDown: onTouchStart,
    };
  } else {
    return {
      onTouchStart: onTouchStart,
      onTouchMove: onTouchMove,
      onTouchEnd: onTouchEnd,
      onTouchCancel: onTouchEnd,
    };
  }
};
