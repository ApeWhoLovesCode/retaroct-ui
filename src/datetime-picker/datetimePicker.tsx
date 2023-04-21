import React, { forwardRef } from 'react';
import {
  DatePickerProps,
  DateTimePickerInstance,
  DatetimePickerProps,
  TimePickerProps,
} from './type';
import TimePicker from './timePicker';
import DatePicker from './datePicker';

const classPrefix = `retaroct-datetime-picker`;

const DatetimePicker = forwardRef<DateTimePickerInstance, DatetimePickerProps>((props, ref) => {
  const isTimePicker = props.type === 'time';

  if (isTimePicker) {
    return <TimePicker className={classPrefix} {...(props as TimePickerProps)} />;
  }
  return <DatePicker className={classPrefix} {...(props as DatePickerProps)} />;
});

export default DatetimePicker;
