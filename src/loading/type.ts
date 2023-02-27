import { NativeProps } from '../utils/native-props';

export type LoadingProps = {
  type?: LoadingType;
  color?: string;
  size?: number | string;
} & NativeProps;
export type LoadingType = 'circular' | 'three-point' | 'rotate-xz';
