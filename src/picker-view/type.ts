import { ReactNode } from 'react';
import { NativeProps } from '../utils/native-props';

/** 列选项 */
export type PickerColumnOption = {
  text?: React.ReactNode;
  value?: string;
  children?: PickerColumnOption[];
  disabled?: boolean;
} & Record<string, any>;

/** 列 */
export type PickerColumn<T = PickerColumnOption> = (string | T)[];

export type PickerCommonProps<T> = {
  /**
   * @description 	每一项数据，可为字符或者对象，对象默认展示值是valueKey设置的key
   * @default []
   */
  columns?: PickerColumn<T> | PickerColumn<T>[];
  /** columns 的 key */
  columnsFieldNames?: PickerFieldNames;
  /**
   * @description 顶部栏位置，可选值为bottom
   * @default top
   */
  toolbarPosition?: PickerViewToolbarPosition;
  /**
   * @description 	顶部栏标题
   * @default ''
   */
  title?: ReactNode;
  /**
   * @description 	取消按钮文字
   * @default 取消
   */
  cancelButtonText?: ReactNode;
  /**
   * @description 	确认按钮文字
   * @default 确认
   */
  confirmButtonText?: ReactNode;
  /**
   * @description 	加载状态
   * @default false
   */
  loading?: boolean;
  /**
   * @description 	选项高度,对应单位PX
   * @default 48
   */
  itemHeight?: string | number;
  /**
   * @description 	可见的选项个数
   * @default 6
   */
  visibleItemCount?: number;
  /**
   * @description 	是否显示顶部栏
   * @default       false
   */
  showToolbar?: boolean;
  /** 点击取消按钮时触发 */
  onCancel?: () => void;
};

export type PickerViewProps<T = PickerColumnOption> = PickerCommonProps<T> & {
  /** 选中项 */
  value?: string[];
  /** 选项改变时触发 */
  onChange?: (event: PickerChangeEvents) => void;
  /** 点击完成按钮时触发 */
  onConfirm?: (event: PickerChangeEvents) => void;
} & NativeProps;

export type PickerViewToolbarPosition = 'top' | 'bottom';

export type PickerViewInstance = {};

/**
 * @title 触发事件 onChange
 */
export type PickerChangeEvents<T = PickerColumnOption> = {
  /** 当前值 */
  value: string[];
  /** 当前值的索引数组 */
  indexes: number[];
  /** 选择的行 */
  selectedRows: T[];
};

export type PickerFieldNames = {
  text?: string;
  value?: string;
  children?: string;
};

export type PickerColumnProps = {
  valueKey?: string;
  textKey: string;
  itemHeight?: number | string;
  visibleItemCount?: number;
  initialOptions?: PickerColumnOption[];
  value: string;
  onChange?: () => void;
} & NativeProps;

export type PickerColumnInstance = {
  getCurrentIndex: () => number;
  getValue: () => PickerColumnOption;
  setIndex: (index: number, userAction?: boolean) => void;
};

export type PickerValueExtend = {
  columns: PickerColumnOption[][];
  items: (PickerColumnOption | null | any)[];
  indexes: number[];
};
