import { NativeProps } from '../utils/native-props';

export type ValueType = number | number[];

export type SliderProps = {
  /** 是否有双滑块 需要保证value为数组 */
  isTwo?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 激活的颜色 */
  activeColor?: string;
  /** 未激活的颜色 */
  inactiveColor?: string;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
  /** 步长值 */
  step?: number;
  /** 当前的滑块值 */
  value?: ValueType;
  /** 滑块bar的高度 */
  barHeight?: number | string;
  /** 是否是垂直方向 */
  vertical?: boolean;
  /** 自定义的按钮样式 */
  button?: React.ReactNode;
  /** 是否有动画 */
  isAnimation?: boolean;
  /** 值改变时触发 */
  onChange?: (v: ValueType) => void;
  /** 拖拽开始触发 */
  onDragStart?: (v: ValueType) => void;
  /** 拖拽结束触发 */
  onDragEnd?: (v: ValueType) => void;
} & NativeProps;
