import { View, Text } from '@tarojs/components';
import React from 'react';
import Icon from '..';
import DemoBlock from '../../demo-block';
import { copy } from '../../utils/operation';
import { IconName } from '../iconfont/iconType';
import './index.less';

export default () => {
  const arr: IconName[] = [
    'xuanxiangka_fuzhi',
    'shangchuan',
    'gold',
    'slash',
    'disablecase',
    'remen1',
    'mn_shengyinwu_fill',
    'mn_shengyin_fill',
    'jianshen-daduzi-pijiudu',
    '24gf-pause2',
    'xuanxiang',
    'gift',
    'ashbin',
    'kaishi1',
    'jinbi1',
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
