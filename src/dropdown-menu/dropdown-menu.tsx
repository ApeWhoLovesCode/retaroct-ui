import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {
  useState,
  ReactElement,
  ComponentProps,
  cloneElement,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { DropdownMenuInstance, DropdownMenuProps } from './type';
import DropdownItem from './dropdown-item';
import Popup from '../popup';
import getEleInfo from '../utils/getEleInfo';
import classNames from 'classnames';
import { randomStr } from '../utils/random';

const classPrefix = `com-dropDownMenu`;

const defaultProps = {
  direction: 'down',
};
type RequireType = keyof typeof defaultProps;
type DefaultProps = Omit<typeof defaultProps, 'direction'> & {
  direction: 'down' | 'up';
};

const DropDownMenu = forwardRef<DropdownMenuInstance, DropdownMenuProps>((comProps, ref) => {
  const props = useMergeProps<DropdownMenuProps, RequireType>(
    comProps,
    defaultProps as DefaultProps,
  );
  const { direction, children, ...ret } = props;

  const idRef = useRef(randomStr(classPrefix));
  const [eleInfo, setEleInfo] = useState({
    top: 0,
    bottom: 0,
  });
  /** 显示弹出层 */
  const [isShow, setIsShow] = useState<boolean>(false);
  /** 显示弹出层外层包裹盒子 */
  const [showWrapper, setShowWrapper] = useState(false);
  /** 需要展示的弹出层列表的索引 */
  const [activeKey, setActiveKey] = useState<number>(0);

  /** item 的 children 列表 */
  const items: ReactElement<ComponentProps<typeof DropdownItem>>[] = [];
  const navs = React.Children.map(props.children, (child, i) => {
    if (React.isValidElement(child)) {
      const childProps = {
        ...child.props,
        className: child.props.titleClass,
        onChange: () => {
          changeActive(i);
        },
        active: isShow && i === activeKey,
      };
      items.push(child as ReactElement);
      return cloneElement(child, childProps);
    } else {
      return child;
    }
  });

  /** 改变弹出层列表的索引 */
  const changeActive = (key: number) => {
    // 当弹出层打开时获取 top 和 bottom 值
    if (!isShow) {
      getEleInfo(`.${idRef.current}`).then((ele) => {
        if (!ele) return;
        setEleInfo({
          top: ele.top + ele.height,
          bottom: Taro.getSystemInfoSync().screenHeight - ele.top,
        });
        setShowWrapper(true);
      });
    }
    setIsShow(!isShow || key !== activeKey);
    setActiveKey(key);
  };

  /** 点击了选项 */
  const onClickOption = (optionVal: string | number) => {
    changeActive(activeKey);
    items[activeKey]?.props?.onChange?.(optionVal);
  };

  /** 弹出层的事件 */
  const handlePopFn = (key: 'onOpen' | 'onOpened' | 'onClose' | 'onClosed') => {
    items[activeKey]?.props?.[key]?.();
    if (key === 'onClosed') {
      setShowWrapper(false);
    }
  };

  /** 弹出层的样式 */
  const handlePopStyle = () => {
    // 相当于销毁弹出层
    if (!showWrapper) return;
    if (direction === 'down') {
      return { top: eleInfo.top + 'px' };
    } else {
      return { bottom: eleInfo.bottom + 'px' };
    }
  };

  useImperativeHandle(ref, () => {
    return {
      toggle: ({ key, show, immediate }) => {
        changeActive(key);
      },
    };
  });

  return withNativeProps(
    ret,
    <View className={`${classPrefix} ${idRef.current}`}>
      <View className={`${classPrefix}-nav`}>{navs}</View>
      <View
        className={`${classPrefix}-popup-wrap ${classPrefix}-popup-wrap-${direction}`}
        style={handlePopStyle()}
      >
        <Popup
          className={`${classPrefix}-popup`}
          show={isShow}
          style={{ ...props.popupStyle, position: 'absolute' }}
          zIndex={props.zIndex}
          overlay={!!props.overlay}
          overlayStyle={{ position: 'absolute' }}
          position={direction === 'down' ? 'top' : 'bottom'}
          duration={props.duration}
          safeAreaInsetBottom={false}
          closeOnClickOverlay={props.closeOnClickOverlay}
          onClose={() => setIsShow(false)}
          onEnter={() => {
            handlePopFn('onOpen');
          }}
          onAfterEnter={() => {
            handlePopFn('onOpened');
          }}
          onLeave={() => {
            handlePopFn('onClose');
          }}
          onAfterLeave={() => {
            handlePopFn('onClosed');
          }}
        >
          {items.map((item, index) => {
            const { value, popTextClass, activeColor, activeClass, options } = item.props;
            return (
              <View key={index} className={`${classPrefix}-popup-item`}>
                {index === activeKey ? (
                  <>
                    {options?.map((option, i) => (
                      <View
                        key={`${option.value}-i-${i}`}
                        className={
                          `${classPrefix}-popup-item-text ` +
                          `${
                            value === option.value
                              ? `${classPrefix}-popup-item-text-active ${activeClass ?? ''}`
                              : ''
                          }` +
                          ` ${classNames(popTextClass)}`
                        }
                        style={{
                          color: value === option.value ? activeColor || props.activeColor : '',
                        }}
                        onClick={() => onClickOption(option.value)}
                      >
                        {option.text}
                      </View>
                    ))}
                    {item.props?.children}
                  </>
                ) : (
                  <></>
                )}
              </View>
            );
          })}
        </Popup>
      </View>
    </View>,
  );
});

export default DropDownMenu;
