import { PickerViewInstance, PickerViewProps } from '../picker-view';
import { PopupProps } from '../popup';

export type PickerProps = PickerViewProps & {
  /** 是否已弹出层形式出现 */
  isPop?: boolean;
} & Omit<PopupProps, 'position' | 'children'>;

export type PickerInstance = PickerViewInstance & {};
