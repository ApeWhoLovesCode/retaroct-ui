import { ITouchEvent } from '@tarojs/components';
import { NativeProps } from '../utils/native-props';

export type SwitchProps = {
  /** 切换开启 */
  checked?: boolean;
  /** 是否开启加载 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 激活的颜色 */
  activeColor?: string;
  /** 失活的颜色 */
  inactiveColor?: string;
  /** 大小 */
  size?: string | number;
  onChange?: (event: ITouchEvent) => void;
} & NativeProps;
