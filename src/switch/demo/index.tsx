import DemoBlock from '../../demo-block';
import React, { View } from '@tarojs/components';
import Switch from '..';
import { useState } from 'react';
import './index.less';

export default () => {
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const syncFn = () => {
    setLoading(true);
    setTimeout(() => {
      setChecked((v) => !v);
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="demo-switch">
      <DemoBlock title="常规使用" padding="0 10px">
        <Switch checked={checked} onChange={() => setChecked((v) => !v)} />
      </DemoBlock>
      <DemoBlock title="自定义颜色" padding="0 10px">
        <Switch
          activeColor="#4fbe5e"
          inactiveColor="#ccc"
          checked={checked}
          onChange={() => setChecked((v) => !v)}
        />
      </DemoBlock>
      <DemoBlock title="自定义大小" padding="0 10px">
        <Switch size={40} checked={checked} onChange={() => setChecked((v) => !v)} />
      </DemoBlock>
      <DemoBlock title="禁用状态" padding="0 10px">
        <Switch disabled checked={checked} onChange={() => setChecked((v) => !v)} />
      </DemoBlock>
      <DemoBlock title="加载状态" padding="0 10px">
        <Switch loading checked={checked} onChange={() => syncFn()} />
      </DemoBlock>
      <DemoBlock title="异步加载" padding="0 10px">
        <Switch loading={loading} checked={checked} onChange={() => syncFn()} />
      </DemoBlock>
    </View>
  );
};
