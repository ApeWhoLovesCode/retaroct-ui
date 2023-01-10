import { View, Button } from '@tarojs/components';
import Circle from '../index';
import { useEffect, useState } from 'react';
import React from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  const [value, setValue] = useState(50);
  return (
    <View className="demo-circle">
      <DemoBlock padding="10px" className="demoWrap" title="简单使用">
        <Circle value={value} text={value} />
        <View className="btnWrap">
          <Button
            className="btn"
            size="mini"
            onClick={() => {
              setValue((v) => (v += 20));
            }}
          >
            加20
          </Button>
          <Button
            className="btn"
            size="mini"
            onClick={() => {
              setValue((v) => (v -= 20));
            }}
          >
            减20
          </Button>
        </View>
      </DemoBlock>
    </View>
  );
};
