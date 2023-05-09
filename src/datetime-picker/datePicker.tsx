import React, { useMemo } from 'react';
import './index.less';
import useMergeProps from '../use-merge-props';
import { DatePickerProps, DatetimePickerColumnType, DatetimePickerType } from './type';
import { isDate } from '../utils/validate';
import { addZero, range } from '../utils/format';
import useRefState from '../use-ref-state';
import Picker from '../picker';
import { PickerChangeEvents } from '../picker-view';
import { createNumList, getMonthEndDay } from './utils';
import useUpdateEffect from '../use-update-effect';

const formatTypeList: DatetimePickerColumnType[] = ['year', 'month', 'day', 'hour', 'minute'];
const currentYear = new Date().getFullYear();

const defaultProps = {
  type: 'datetime' as DatetimePickerType,
  minDate: new Date(currentYear - 10, 0, 1),
  maxDate: new Date(currentYear + 10, 11, 31),
  formatter: (type: DatetimePickerColumnType, value: string) => value,
};
type RequireType = keyof typeof defaultProps;

const DatePicker = (comProps: DatePickerProps) => {
  const props = useMergeProps<DatePickerProps, RequireType>(comProps, defaultProps);
  const {
    value,
    defaultValue,
    formatter,
    columnsOrder,
    type: datePickerType,
    filter,
    minDate,
    maxDate,
    ...ret
  } = props;

  const formatValue = (date?: Date | string | number) => {
    if (!isDate(date as Date)) {
      date = minDate;
    }
    return new Date(range(+date!, minDate.getTime(), maxDate.getTime()));
  };

  const [currentDate, setCurrentDate, currentDateRef] = useRefState(() =>
    formatValue(value || defaultValue),
  );

  const getBoundary = (type: 'max' | 'min', value: Date) => {
    const boundary = props[`${type}Date`];
    const year = boundary.getFullYear();
    let month = 1,
      date = 1,
      hour = 0,
      minute = 0;

    if (type === 'max') {
      month = 12;
      date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
      hour = 23;
      minute = 59;
    }

    if (value.getFullYear() === year) {
      month = boundary.getMonth() + 1;
      if (value.getMonth() + 1 === month) {
        date = boundary.getDate();
        if (value.getDate() === date) {
          hour = boundary.getHours();
          if (value.getHours() === hour) {
            minute = boundary.getMinutes();
          }
        }
      }
    }

    return [year, month, date, hour, minute];
  };

  const originColumns = useMemo(() => {
    const maxDate = getBoundary('max', currentDateRef.current);
    const minDate = getBoundary('min', currentDateRef.current);

    let result = formatTypeList.map((type, i) => ({ type, min: minDate[i], max: maxDate[i] }));
    switch (datePickerType) {
      case 'date':
        result = result.slice(0, 3);
        break;
      case 'year-month':
        result = result.slice(0, 2);
        break;
      case 'month-day':
        result = result.slice(1, 3);
        break;
      case 'datehour':
        result = result.slice(0, 4);
        break;
    }

    if (columnsOrder) {
      const columnsOrderArr = [...columnsOrder];
      result.some((item) => {
        if (!columnsOrderArr.indexOf(item.type)) {
          columnsOrderArr.push(item.type);
        }
        return columnsOrderArr.length === result.length;
      });
      result.sort((a, b) => columnsOrderArr.indexOf(a.type) - columnsOrderArr.indexOf(b.type));
    }

    return result.map(({ type, min, max }) => {
      let values = createNumList(min, max);
      if (filter) {
        values = filter(type, values);
      }
      return { type, values };
    });
  }, [columnsOrder, minDate, maxDate]);

  const columns = useMemo(
    () =>
      originColumns.map((column) => column.values.map((value) => formatter(column.type, value))),
    [originColumns, formatter],
  );

  const pickerValue = useMemo(() => {
    const val = currentDateRef.current;
    const values = originColumns.map((column) => {
      let value = '';
      switch (column.type) {
        case 'year':
          value = val.getFullYear() + '';
          break;
        case 'month':
          value = addZero(val.getMonth() + 1);
          break;
        case 'day':
          value = addZero(val.getDate());
          break;
        case 'hour':
          value = addZero(val.getHours());
          break;
        case 'minute':
          value = addZero(val.getMinutes());
          break;
      }
      return formatter(column.type, value);
    });
    return values;
  }, [value, formatValue]);

  const updateInnerValue = (indexes: number[]) => {
    const getValue = (type: DatetimePickerColumnType) => {
      const index = originColumns.findIndex((column) => column.type === type);
      const { values } = originColumns[index];
      return +values[indexes[index]];
    };
    const year =
      datePickerType === 'month-day' ? (currentDate || minDate).getFullYear() : getValue('year');
    const month = getValue('month');
    const day = Math.min(
      datePickerType === 'year-month' ? 1 : getValue('day'),
      getMonthEndDay(year, month),
    );
    const hour = ['datehour', 'datetime'].some((t) => t === datePickerType) ? getValue('hour') : 0;
    const minute = datePickerType === 'datetime' ? getValue('minute') : 0;

    return formatValue(new Date(year, month - 1, day, hour, minute));
  };

  const onChange = (params: PickerChangeEvents) => {
    const nextValue = updateInnerValue(params.indexes);
    setCurrentDate(nextValue);
    props.onChange?.(nextValue);
  };

  useUpdateEffect(() => {
    const nextValue = formatValue(value);
    if (nextValue && nextValue.valueOf() !== currentDate?.valueOf()) {
      setCurrentDate(nextValue);
    }
  }, [value, filter, minDate, maxDate]);

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

export default DatePicker;
