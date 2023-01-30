import { useLayoutEffect } from 'react';
import { isMobile, MouseTouchEvent } from '../utils/handleDom';
import useTouch, { TouchState } from '../use-touch';
import useLatest from '../use-latest';

export type UseTouchesOptions = {
  onTouchStart?: (e: MouseTouchEvent) => void;
  onTouchMove?: (e: MouseTouchEvent, touchState: TouchState) => void;
  onTouchEnd?: (e: MouseTouchEvent) => void;
};

function useTouches(ref: React.RefObject<HTMLDivElement>, options: UseTouchesOptions = {}) {
  const touch = useTouch();
  const optionsRef = useLatest(options);

  useLayoutEffect(() => {
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

    if (!isMobile()) {
      ref.current?.addEventListener('mousedown', onTouchStart);
    } else {
      ref.current?.addEventListener('touchstart', onTouchStart as any);
      ref.current?.addEventListener('touchmove', onTouchMove as any);
      ref.current?.addEventListener('touchend', onTouchEnd as any);
      ref.current?.addEventListener('touchcancel', onTouchEnd as any);
    }
    return () => {
      if (!isMobile()) {
        ref.current?.removeEventListener('mousedown', onTouchStart);
      } else {
        ref.current?.removeEventListener('touchstart', onTouchStart as any);
        ref.current?.removeEventListener('touchmove', onTouchMove as any);
        ref.current?.removeEventListener('touchend', onTouchEnd as any);
        ref.current?.removeEventListener('touchcancel', onTouchEnd as any);
      }
    };
  }, []);

  return {
    ...touch,
  };
}

export default useTouches;
