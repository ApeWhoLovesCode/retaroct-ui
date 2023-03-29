import { PickerViewInstance, PickerViewProps } from '../picker-view';
import { PopupProps } from '../popup';

export type PickerProps = PickerViewProps & {} & Omit<PopupProps, 'position' | 'children'>;

export type PickerInstance = PickerViewInstance & {};
