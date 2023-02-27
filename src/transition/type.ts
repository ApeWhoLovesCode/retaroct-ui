import { ITouchEvent } from '@tarojs/components';
import { ReactNode } from 'react';
import { TransitionType } from '../use-transition';
import { NativeProps } from '../utils/native-props';

export type TransitionProps = {
  children?: ReactNode;
  onClick?: (e: ITouchEvent) => void;
  onTouchMove?: (e: ITouchEvent) => void;
} & TransitionType &
  NativeProps;
