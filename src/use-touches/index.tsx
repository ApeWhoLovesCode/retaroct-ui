import { useEffect, useLayoutEffect } from 'react';
import type { MutableRefObject } from 'react';
import { isMobile, MouseTouchEvent } from '../utils/handleDom';
import { ITouchEvent } from '@tarojs/components';

type TargetValue<T> = T | undefined | null;

type TargetType = HTMLElement | Element | Window | Document;

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

function useTouchs(ref: React.RefObject<HTMLDivElement>) {
  useLayoutEffect(() => {
    if (!isMobile()) {
      ref.current?.addEventListener('mousedown', onTouchStart);
      ref.current?.addEventListener('mouseup', onTouchEnd);
    } else {
      ref.current?.addEventListener('touchstart', onTouchStart);
      ref.current?.addEventListener('touchmove', onTouchMove);
      ref.current?.addEventListener('touchend', onTouchEnd);
      ref.current?.addEventListener('touchcancel', onTouchEnd);
    }
  }, []);

  const onTouchStart = (e: TouchEvent | MouseEvent) => {};

  const onTouchMove = (e: any) => {};

  const onTouchEnd = (e: any) => {};
}

export default useTouchs;
