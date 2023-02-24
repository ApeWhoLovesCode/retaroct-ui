import { View, Text } from '@tarojs/components';
import React from 'react';
import Icon from '..';
import DemoBlock from '../../demo-block';
import { copy } from '../../utils/operation';
import { IconName } from '../iconfont/iconType';
import './index.less';

export default () => {
  const arr: IconName[] = [
    'add',
    'add-circle',
    'arrow-down',
    'ashbin',
    'arrow-right',
    'browse',
    'bottom',
    'back',
    'bad',
    'camera',
    'chart-bar',
    'attachment',
    'code',
    'close',
    'check-item',
    'comment',
    'copy',
    'search',
    'setting',
    'user',
  ];
  return (
    <>
      <DemoBlock title="默认图标" className="demo-icon-block">
        {arr.map((name) => (
          <View key={name} className="iconWrap" onClick={() => copy(name)}>
            <View className="icon-logo">
              <Icon name={name} size={20} className="icon" />
            </View>
            <Text className="icon-text">{name}</Text>
          </View>
        ))}
      </DemoBlock>
    </>
  );
};
