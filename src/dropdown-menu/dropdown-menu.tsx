import { View } from '@tarojs/components';
import React, {
  useState,
  ReactElement,
  ComponentProps,
  cloneElement,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { DropdownMenuInstance, DropdownMenuProps } from './type';
import DropdownItem from './dropdown-item';
import Popup from '../popup';
import getEleInfo from '../utils/getEleInfo';
import classNames from 'classnames';
import { randomStr } from '../utils/random';

const classPrefix = `retaroct-dropdown-menu`;

/** 用来控制关闭其他的menu */
const menuController: {
  [key in string]: {
    close: () => void;
    closeOnClickOutside: boolean;
  };
} = {};

const defaultProps = {
  direction: 'down' as 'down' | 'up',
  overlay: true,
  closeOnClickOutside: true,
  zIndex: 1000,
};
type RequireType = keyof typeof defaultProps;

const DropDownMenu = forwardRef<DropdownMenuInstance, DropdownMenuProps>((comProps, ref) => {
  const props = useMergeProps<DropdownMenuProps, RequireType>(comProps, defaultProps);
  const { direction, overlay, closeOnClickOutside, children, ...ret } = props;

  const idRef = useRef(randomStr(classPrefix));
  /** nav区域的高度 */
  const [navH, setNavH] = useState(0);
  /** 显示弹出层 */
  const [isShow, setIsShow] = useState<boolean>(false);
  /** 显示弹出层外层包裹盒子 */
  const [showWrapper, setShowWrapper] = useState(false);
  /** 需要展示的弹出层列表的索引 */
  const [activeKey, setActiveKey] = useState<number>(0);
  /** 弹出层的高度 */
  const [popH, setPopH] = useState<number>();

  /** item 的 children 列表 */
  const items: ReactElement<ComponentProps<typeof DropdownItem>>[] = [];
  const navs = React.Children.map(props.children, (child, i) => {
    if (React.isValidElement(child)) {
      const childProps = {
        ...child.props,
        className: child.props?.titleClass,
        active: isShow && i === activeKey,
        direction,
        activeColor: props.activeColor,
        onClick: () => {
          onNavClick(i);
        },
      };
      items.push(child as ReactElement);
      return cloneElement(child, childProps);
    } else {
      return child;
    }
  });

  /** 点击了nav */
  const onNavClick = (i: number) => {
    changeActive(i);
    Object.keys(menuController).forEach((key) => {
      if (key !== idRef.current && menuController[key].closeOnClickOutside) {
        menuController[key]?.close();
      }
    });
  };

  /** 改变弹出层列表的索引 */
  const changeActive = (key: number, _isShow?: boolean) => {
    // 当弹出层打开时获取 top 和 bottom 值
    if (!isShow) {
      getEleInfo(`.${idRef.current} .${classPrefix}-nav`).then((ele) => {
        if (!ele) return;
        setNavH(ele.height);
      });
      setShowWrapper(true);
    }
    if (!overlay) {
      setPopH(void 0);
    }
    setIsShow(_isShow || !isShow || key !== activeKey);
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
    const height = !overlay && popH !== void 0 ? popH + 'px' : '100vh';
    if (direction === 'down') {
      return { top: 0 + 'px', height };
    } else {
      return { bottom: navH + 'px', height };
    }
  };

  useEffect(() => {
    if (closeOnClickOutside) {
      menuController[idRef.current] = {
        closeOnClickOutside,
        close: () => setIsShow(false),
      };
    }
  }, [closeOnClickOutside]);

  /** 用来处理没有遮罩层的时候 */
  useEffect(() => {
    if (!overlay && isShow) {
      setTimeout(() => {
        getEleInfo(`.${idRef.current} .${classPrefix}-popup`).then((ele) => {
          setPopH(ele?.height);
        });
      }, 100);
    }
  }, [overlay, isShow, activeKey]);

  useImperativeHandle(ref, () => {
    return {
      toggle: (key, show) => {
        changeActive(key, show);
      },
    };
  });

  /** 弹出层中的内容区域 */
  const popContent = items.map((item, index) => {
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
                style={{ color: value === option.value ? activeColor : '' }}
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
  });

  return withNativeProps(
    ret,
    <View className={`${classPrefix} ${idRef.current}`}>
      <View className={`${classPrefix}-nav`}>{navs}</View>
      <View style={{ position: 'relative', zIndex: props.zIndex }}>
        <View className={`${classPrefix}-popup-wrap`} style={handlePopStyle()}>
          <Popup
            className={`${classPrefix}-popup`}
            show={isShow}
            style={{ ...props.popupStyle, position: 'absolute' }}
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
            {popContent}
          </Popup>
        </View>
      </View>
    </View>,
  );
});

export default DropDownMenu;
