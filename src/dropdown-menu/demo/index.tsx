import { View } from '@tarojs/components';
import React, { useState } from 'react';
import DropDownMenu, { DropdownMenuOption } from '..';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  const [state, _] = useState<{ [key in string]: DropdownMenuOption[] }>({
    option1: [
      {
        text: '全部商品',
        value: 0,
      },
      {
        text: '新款商品',
        value: 1,
      },
      {
        text: '活动商品',
        value: 2,
      },
    ],
    option2: [
      {
        text: '默认排序',
        value: 'a',
      },
      {
        text: '好评排序',
        value: 'b',
      },
    ],
  });

  return (
    <View className="demo-dropdown-menu">
      <DemoBlock title="常规使用" padding="0 10px">
        <DropDownMenu>
          <DropDownMenu.Item options={state.option1} />
          <DropDownMenu.Item options={state.option2} />
        </DropDownMenu>
      </DemoBlock>
    </View>
  );
};
