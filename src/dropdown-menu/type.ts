import { NativeProps } from '../utils/native-props';
import { ReactNode } from 'react';

export type DropdownMenuProps = {
  /** 选中选项后颜色 */
  activeColor?: string;
  /**
   * 是否展示蒙层
   * @default true
   */
  overlay?: boolean;
  /**
   * 弹出层zIndex
   * @default 1000
   */
  zIndex?: number;
  /**
   * 弹出层执行时间
   * @default 300
   */
  duration?: number;
  /**
   * 弹出层执行方向
   * @default down
   */
  direction?: 'down' | 'up';
  /**
   * 点击蒙层是否关闭弹出层
   * @default true
   */
  closeOnClickOverlay?: boolean;
  /**
   * 是否在点击外部 menu 后关闭菜单
   * @default true
   */
  closeOnClickOutside?: boolean;
  /** 弹出层的样式 */
  popupStyle?: React.CSSProperties;
  /** 子元素,须为DropdownMenuItem */
  children: React.ReactNode;
} & NativeProps;

export type DropdownItemProps = {
  /** 选中选项后颜色 */
  activeColor?: string;
  /** 选择选项的class */
  activeClass?: string;
  /** 对应菜单选项的值 */
  value?: string | number;
  /** 未选择时候的按钮标题 */
  title?: ReactNode;
  /** 标题元素的class */
  titleClass?: string;
  /** 弹出层中列表元素的class */
  popTextClass?: string;
  /** 所有选项 */
  options?: Array<DropdownMenuOption>;
  /** 自定义 箭头 */
  arrow?: ReactNode;
  /** 子元素 */
  children?: ReactNode | ReactNode[];
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
} & NativeProps;

export type DropdownMenuOption = {
  /** 展示的label */
  text?: ReactNode;
  /** 对应的数值 */
  value: number | string;
  /** 前缀图标 */
  icon?: string;
};

/**
 * @title 组件实例
 * @description 通过ref获取到的方法如下
 */
export type DropdownMenuInstance = {
  /**
   * 控制展开/收起菜单栏，key:item的索引, show:是否展开(默认为打开/关闭切换)
   */
  toggle: (key: number, show?: boolean) => void;
};
