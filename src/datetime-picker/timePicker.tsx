import React, { useState, useMemo } from 'react';
import useMergeProps from '../use-merge-props';
import Picker from '../picker';
import { DatetimePickerColumnType, TimePickerProps } from './type';
import { addZero, range } from '../utils/format';
import { PickerChangeEvents } from '../picker-view';
import useUpdateEffect from '../use-update-effect';
import { createNumList } from './utils';

const defaultProps = {
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  formatter: (type: DatetimePickerColumnType, value: string) => value,
};
type RequireType = keyof typeof defaultProps;

const TimePicker = (comProps: TimePickerProps) => {
  const props = useMergeProps<TimePickerProps, RequireType>(comProps, defaultProps);
  const { value, defaultValue, formatter, filter, minHour, maxHour, minMinute, maxMinute, ...ret } =
    props;

  const formatValue = (str?: string) => {
    if (!str) {
      str = `${addZero(minHour)}:${addZero(minMinute)}`;
    }
    let [hour, minute] = str.split(':');
    hour = addZero(range(+hour, +minHour, +maxHour));
    minute = addZero(range(+minute, +minMinute, +maxMinute));
    return `${hour}:${minute}`;
  };

  const [currentDate, setCurrentDate] = useState(() =>
    formatValue(value === undefined ? defaultValue : value),
  );

  const pickerValue = useMemo(() => {
    const val = currentDate.split(':');
    return [formatter('hour', val[0]), formatter('minute', val[1])];
  }, [currentDate, formatter]);

  const columns = useMemo(() => {
    const arr: { type: DatetimePickerColumnType; values: string[] }[] = [
      { type: 'hour', values: createNumList(+minHour, +maxHour) },
      { type: 'minute', values: createNumList(+minMinute, +maxMinute) },
    ];
    if (filter) {
      arr.forEach((item) => {
        item.values = filter(item.type, item.values);
      });
    }
    return arr.map((column) => column.values.map((v) => formatter(column.type, v)));
  }, [minHour, minMinute, maxHour, maxMinute, filter]);

  const onChange = (params: PickerChangeEvents) => {
    const nextValue = formatValue(params.value.join(':'));
    setCurrentDate(nextValue);
    props.onChange?.(nextValue);
  };

  useUpdateEffect(() => {
    const nextValue = formatValue(currentDate);
    setCurrentDate(nextValue);
  }, [filter, minHour, maxHour, minMinute, maxMinute]);

  useUpdateEffect(() => {
    const nextValue = formatValue(value);
    if (nextValue !== currentDate) {
      setCurrentDate(nextValue);
    }
  }, [value]);

  return (
    <Picker
      {...ret}
      value={pickerValue}
      columns={columns}
      onChange={onChange}
      onConfirm={() => {
        props.onConfirm?.(currentDate);
      }}
      onCancel={() => {
        props.onCancel?.();
      }}
    />
  );
};

export default TimePicker;
