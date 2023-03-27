import { isMobile, MouseTouchEvent } from '../utils/handleDom';
import useTouch, { TouchState } from '../use-touch';
import useLatest from '../use-latest';

export type UseTouchesOptions = {
  onTouchStart?: (e: MouseTouchEvent) => void;
  onTouchMove?: (e: MouseTouchEvent, touchState?: TouchState) => void;
  onTouchEnd?: (e: MouseTouchEvent) => void;
};

export type UseTouchesParams = {
  /** 都阻止 */
  isStopEvent?: boolean;
  /** 是否阻止事件冒泡 */
  isStopPropagation?: boolean;
  /** 是否阻止事件默认行为 */
  isPreventDefault?: boolean;
};

/** 绑定手指触摸或鼠标事件 */
export default function useTouchEvent(options: UseTouchesOptions & UseTouchesParams = {}) {
  const touch = useTouch();
  const optionsRef = useLatest(options);

  const onTouchStart = (e: MouseTouchEvent) => {
    onStopEvent(e);
    touch.start(e);
    if (!isMobile()) {
      document.addEventListener('mousemove', onTouchMove, true);
      document.addEventListener('mouseup', onTouchEnd, true);
    }
    optionsRef.current.onTouchStart?.(e);
  };
  const onTouchMove = (e: MouseTouchEvent) => {
    onStopEvent(e);
    touch.move(e);
    optionsRef.current.onTouchMove?.(e, touch.info);
  };
  const onTouchEnd = (e: MouseTouchEvent) => {
    onStopEvent(e);
    touch.move(e);
    if (!isMobile()) {
      document.removeEventListener('mousemove', onTouchMove, true);
      document.removeEventListener('mouseup', onTouchEnd, true);
    }
    optionsRef.current.onTouchEnd?.(e);
  };
  const onStopEvent = (e: MouseTouchEvent) => {
    if (options.isStopEvent || options.isStopPropagation) {
      e.stopPropagation();
    }
    if (options.isStopEvent || options.isPreventDefault) {
      e.preventDefault();
    }
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
      onMouseUp: onTouchEnd,
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
