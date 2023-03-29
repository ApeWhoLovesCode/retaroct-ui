import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import useMergeProps from '../use-merge-props';
import { PickerInstance, PickerProps } from './type';
import PickerView from '../picker-view';
import Popup from '../popup';

const classPrefix = `retaroct-picker`;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Picker = forwardRef<PickerInstance, PickerProps>((comProps, ref) => {
  const props = useMergeProps<PickerProps, RequireType>(comProps, defaultProps);
  const { ...ret } = props;

  const pickerRef = useRef<PickerInstance>(null);

  useImperativeHandle(ref, () => ({
    ...pickerRef.current,
  }));

  return (
    <Popup round {...ret} position="bottom">
      <PickerView {...ret} ref={pickerRef} />
    </Popup>
  );
});

export default Picker;
