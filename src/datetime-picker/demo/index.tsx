import { View } from '@tarojs/components';
import DemoBlock from '../../demo-block';
import React, { useState } from 'react';
import DatetimePicker from '../datetimePicker';

export default () => {
  // const [isShow, setIsShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [val, setVal] = useState('11:30');

  return (
    <View>
      <DemoBlock title="选择日期" padding="0 12px">
        <DatetimePicker
          isPop={false}
          type="date"
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2025, 10, 1)}
          value={date}
          onChange={(v) => {
            console.log('v: ', v);
            setDate(v);
          }}
        />
      </DemoBlock>
      <DemoBlock title="选择时间" padding="0 12px">
        <DatetimePicker
          // show={isShow}
          isPop={false}
          defaultValue="13:00"
          value={val}
          type="time"
          minHour="10"
          maxHour="20"
        />
      </DemoBlock>
      <DemoBlock title="filter and formatter" padding="0 12px">
        <DatetimePicker
          isPop={false}
          defaultValue="12:30"
          type="time"
          formatter={(type, v) => {
            return v + type;
          }}
          filter={(type, options) => {
            if (type === 'minute') {
              return options.filter((option) => +option % 5 === 0);
            }
            return options;
          }}
        />
      </DemoBlock>
    </View>
  );
};
