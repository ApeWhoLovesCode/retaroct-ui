import { Button, View } from '@tarojs/components';
import DemoBlock from '../../demo-block';
import React, { useState } from 'react';
import DatetimePicker from '../datetimePicker';

export default () => {
  const [date, setDate] = useState(new Date());
  const [val, setVal] = useState('11:30');
  const [isShow, setIsShow] = useState(false);

  const onClose = () => {
    setIsShow(false);
  };

  return (
    <View>
      <DemoBlock title="选择年月日" padding="0 12px">
        <DatetimePicker
          isPop={false}
          type="date"
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2025, 10, 1)}
          value={date}
          onChange={setDate}
        />
      </DemoBlock>
      <DemoBlock title="选择时间" padding="0 12px">
        <DatetimePicker
          // show={isShow}
          isPop={false}
          defaultValue="13:00"
          value={val}
          onChange={setVal}
          type="time"
          minHour="10"
          maxHour="20"
        />
      </DemoBlock>
      <DemoBlock title="弹出层" padding="0 12px">
        <Button onClick={() => setIsShow(true)}>打开弹出层</Button>
        <DatetimePicker
          title="选择年月日"
          showToolbar
          type="date"
          show={isShow}
          value={date}
          onChange={setDate}
          onCancel={onClose}
          onClose={onClose}
          onConfirm={onClose}
        />
      </DemoBlock>
      <DemoBlock title="完整时间" padding="0 12px">
        <DatetimePicker isPop={false} type="datetime" value={date} onChange={setDate} />
      </DemoBlock>
      <DemoBlock title="年月日时" padding="0 12px">
        <DatetimePicker isPop={false} type="datehour" value={date} onChange={setDate} />
      </DemoBlock>
      <DemoBlock title="formatter and filter" padding="0 12px">
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
      <DemoBlock title="自定义列排序" padding="0 12px">
        <DatetimePicker
          isPop={false}
          type="date"
          columnsOrder={['month', 'day', 'year']}
          value={date}
          onChange={setDate}
        />
      </DemoBlock>
    </View>
  );
};
