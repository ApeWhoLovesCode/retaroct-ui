import { View, Button } from '@tarojs/components';
import React, { useRef, useState } from 'react';
import DropDownMenu, { DropdownMenuOption } from '..';
import './index.less';
import DemoBlock from '../../demo-block';
import { DropdownMenuInstance } from '../type';

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
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState('a');
  const menuRef = useRef<DropdownMenuInstance>(null);

  return (
    <View className="demo-dropdown-menu">
      <DemoBlock title="常规使用">
        <DropDownMenu>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
      <DemoBlock title="不展示蒙版">
        <DropDownMenu overlay={false}>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
      <DemoBlock title="自定义箭头和选中元素颜色">
        <DropDownMenu activeColor={'skyblue'}>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            arrow={<View>箭头</View>}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            activeColor={'green'}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
          <DropDownMenu.Item
            activeClass="active"
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
      <DemoBlock title="自定义菜单内容">
        <DropDownMenu ref={menuRef}>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            activeColor={'green'}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          >
            <Button
              onClick={() => {
                menuRef.current?.toggle(1);
              }}
            >
              确定
            </Button>
          </DropDownMenu.Item>
        </DropDownMenu>
        <Button
          style={{ zIndex: 0 }}
          onClick={() => {
            menuRef.current?.toggle(1, true);
          }}
        >
          打开自定义菜单的排序
        </Button>
      </DemoBlock>
      <DemoBlock title="向上展开">
        <DropDownMenu direction="up">
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
      <DemoBlock title="向上立即展开">
        <DropDownMenu direction="up" duration={0}>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
      <DemoBlock title="点击其他menu时不关闭">
        <DropDownMenu direction="up" overlay={false} closeOnClickOutside={false}>
          <DropDownMenu.Item
            value={value1}
            options={state.option1}
            onChange={(v) => setValue1(v as number)}
          />
          <DropDownMenu.Item
            value={value2}
            options={state.option2}
            onChange={(v) => setValue2(v as string)}
          />
        </DropDownMenu>
      </DemoBlock>
    </View>
  );
};
