import { View } from '@tarojs/components';
import DemoBlock from '../../demo-block';
import React, { useState } from 'react';
import DatetimePicker from '../datetimePicker';

export default () => {
  // const [isShow, setIsShow] = useState(false);
  const [val, setVal] = useState('11:30');

  return (
    <View>
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
