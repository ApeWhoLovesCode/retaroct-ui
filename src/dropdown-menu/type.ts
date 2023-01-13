import { NativeProps } from '../utils/native-props';
import { ReactNode } from 'react';

export type DropdownMenuProps = {
  /** 选中选项后颜色 */
  activeColor?: string;
  /** 是否展示蒙层 */
  overlay?: boolean;
  /** 弹出层zIndex */
  zIndex?: number;
  /** 弹出层执行时间 */
  duration?: number;
  /** 弹出层执行方向 */
  direction?: 'down' | 'up';
  /** 点击蒙层是否关闭弹出层 */
  closeOnClickOverlay?: boolean;
  /** 是否在点击外部 menu 后关闭菜单 */
  closeOnClickOutside?: boolean;
  /** 自定义 箭头 */
  arrow?: ReactNode;
  /** 子元素,须为DropdownMenuItem */
  children: React.ReactNode;
} & NativeProps;

export type DropdownItemProps = {
  /** 对应菜单选项的值 */
  value?: string | number;
  /** 未选择时候的按钮标题 */
  title?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标题元素的class */
  titleClass?: string;
  /** 所有选项 */
  options?: Array<DropdownMenuOption>;
  /** 弹出层的样式 */
  popupStyle?: React.CSSProperties;
  /** 自定义 箭头 */
  arrow?: ReactNode;
  /** 展开下拉项触发 */
  onOpen?: () => void;
  /** 展开下拉项完成时触发 */
  onOpened?: () => void;
  /** 关闭下拉项触发 */
  onClose?: () => void;
  /** 展开下拉项完成触发 */
  onClosed?: () => void;
  /** 点击选项触发 */
  onChange?: (value?: number | string) => void;
  /** 传入的子元素 */
  children?: ReactNode | ReactNode[];
} & NativeProps;

export type DropdownMenuOption = {
  /** 展示的label */
  text?: ReactNode;
  /** 对应的数值 */
  value: number | string;
  /** 前缀图标 */
  icon?: string;
};
