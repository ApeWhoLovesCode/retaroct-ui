import { ReactNode } from 'react';
import { TransitionDuration } from '../use-transition';
import { NativeProps } from '../utils/native-props';

export type MaskProps = {
  show?: boolean;
  lockScroll?: boolean;
  zIndex?: number;
  duration?: string | number | TransitionDuration;
  children?: ReactNode;
  onClose?: () => void;
} & NativeProps;
