import { NativeProps } from '../utils/native-props';
import { IconName } from './iconfont/iconType';

export type IconProps = {
  /** 图标名称 */
  name: IconName;
  /** 图标颜色 小程序下使用，h5用 color 即可 */
  color?: string;
  /** 图标大小 小程序下使用，h5用 fontSize 即可 */
  size?: number;
} & NativeProps;
