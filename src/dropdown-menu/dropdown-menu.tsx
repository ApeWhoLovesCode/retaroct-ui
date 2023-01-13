import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  ComponentProps,
  cloneElement,
} from 'react';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { DropdownMenuProps } from './type';
import DropdownItem from './dropdown-item';
import Popup from '../popup';

const classPrefix = `com-dropDownMenu`;

const defaultProps = {
  direction: 'down',
};
type RequireType = keyof typeof defaultProps;
type DefaultProps = Omit<typeof defaultProps, 'direction'> & {
  direction: 'down' | 'up';
};

const DropDownMenu = (comProps: DropdownMenuProps) => {
  const props = useMergeProps<DropdownMenuProps, RequireType>(
    comProps,
    defaultProps as DefaultProps,
  );
  const { direction, children, ...ret } = props;

  const [activeKey, setActiveKey] = useState<string>();

  const changeActive = (key: string) => {
    if (key === activeKey) {
      setActiveKey(void 0);
    } else {
      setActiveKey(key);
    }
  };

  const items: ReactElement<ComponentProps<typeof DropdownItem>>[] = [];
  const navs = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = {
        ...child.props,
        onClick: () => {
          changeActive(child.key as string);
        },
        active: child.key === activeKey,
        arrow: child.props.arrow ?? props.arrow,
      };
      items.push(child as ReactElement);
      return cloneElement(child, childProps);
    } else {
      return child;
    }
  });

  return withNativeProps(
    ret,
    <View className={classPrefix}>
      <View className={`${classPrefix}-nav`}>{navs}</View>
      <Popup
        className={`${classPrefix}-popup`}
        show={!!activeKey}
        overlayStyle={{ position: 'absolute' }}
        position={direction === 'down' ? 'top' : 'bottom'}
      >
        <View>
          {items.map((item) => (
            <View key={item.key ?? ''} className={`${classPrefix}-childrenWrap`}>
              {item.key === activeKey ? { children } : null}
            </View>
          ))}
        </View>
      </Popup>
    </View>,
  );
};

export default DropDownMenu;
