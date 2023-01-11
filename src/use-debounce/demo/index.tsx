import React, { useState } from 'react';
import useDebounce from '..';
import { View, Button } from '@tarojs/components';

const Demo: React.FC = () => {
  const [val, setVal] = useState<number>(0);
  const [time, setTime] = useState<number>(200);

  const add = useDebounce(
    (v: number) => {
      setVal(v);
    },
    time,
    [time],
  );

  return (
    <View className="demo-use-debounce">
      <Button
        onClick={() => {
          add(val + 1);
        }}
      >
        防抖+1
      </Button>
      <View style={{ textAlign: 'center' }}>{val}</View>
      <Button
        onClick={() => {
          setTime((t) => (t === 200 ? 1000 : 200));
        }}
      >
        防抖时间:{time},点击改变
      </Button>
    </View>
  );
};

export default Demo;
