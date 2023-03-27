import { View } from '@tarojs/components';
import DemoBlock from '../../demo-block';
import React, { useState } from 'react';
import PickerView from '..';

export default () => {
  const [state, setState] = useState({
    v1: ['宁波'],
    v2: ['周一', '上午'],
    v3: ['广西', '南宁市', '青秀区'],
  });
  const columns1 = ['杭州', '宁波', '温州', '嘉兴', '湖州', '深圳', '广州', '佛山'];
  const columns2 = [
    ['周一', '周二', '周三', '周四', '周五'],
    ['上午', '下午', '晚上'],
  ];
  const columns3 = [
    {
      name: '广东',
      list: [
        { name: '佛山', list: [{ name: '三水' }, { name: '南海' }, { name: '顺德' }] },
        { name: '深圳', list: [{ name: '宝安' }, { name: '龙华' }, { name: '福田' }] },
        { name: '广州', list: [{ name: '荔湾区' }, { name: '越秀区' }, { name: '海珠区' }] },
      ],
    },
    {
      name: '广西',
      list: [
        { name: '南宁市', list: [{ name: '兴宁区' }, { name: '青秀区' }] },
        { name: '柳州市', list: [{ name: '城中区' }, { name: '鱼峰区' }, { name: '柳南区' }] },
      ],
    },
    {
      name: '福建',
      list: [
        { name: '福州市', list: [{ name: '鼓楼区' }, { name: '台江区' }] },
        { name: '厦门市', list: [{ name: '思明区' }, { name: '海沧区' }] },
      ],
    },
  ];
  return (
    <View>
      <DemoBlock title="常规使用">
        <PickerView
          showToolbar
          title={'常规使用'}
          value={state.v1}
          columns={columns1}
          onChange={(v) => {
            console.log('v: ', v);
            setState((s) => ({ ...s, v1: v.value }));
          }}
        />
      </DemoBlock>
      <DemoBlock title="多列数据">
        <PickerView
          value={state.v2}
          columns={columns2}
          onChange={(v) => {
            console.log('v: ', v);
            setState((s) => ({ ...s, v2: v.value }));
          }}
        />
      </DemoBlock>
      <DemoBlock title="级联数据">
        <PickerView
          value={state.v3}
          columns={columns3}
          columnsFieldNames={{ text: 'name', children: 'list' }}
          onChange={(v) => {
            console.log('v: ', v);
            setState((s) => ({ ...s, v3: v.value }));
          }}
        />
      </DemoBlock>
      <DemoBlock title="加载状态">
        <PickerView
          loading
          showToolbar
          value={state.v1}
          columns={columns1}
          onChange={(v) => {
            console.log('v: ', v);
            setState((s) => ({ ...s, v1: v.value }));
          }}
        />
      </DemoBlock>
    </View>
  );
};
