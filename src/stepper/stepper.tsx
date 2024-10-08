import { View, Image, Input } from '@tarojs/components';
import type { ITouchEvent } from '@tarojs/components';
import { useState, useRef, useCallback, useEffect } from 'react';
import { callInterceptor } from './interceptor';
import classNames from 'classnames';
import React from 'react';
import { StepperProps } from './type';

const classPrefix = 'retaroct-stepper';

const LONG_PRESS_INTERVAL = 200;
const LONG_PRESS_START_TIME = 600;

const btnImgArr = [
  require('./assets/reduce.png'),
  require('./assets/reduce-gray.png'), // ReduceGrayIcon,
  require('./assets/add.png'),
  require('./assets/add-gray.png'),
];

const Stepper = (props: StepperProps) => {
  const {
    value,
    step,
    min,
    max,
    buttonSize,
    decimalLength,
    integer,
    disabled,
    disablePlus,
    disableMinus,
    disableInput,
    longPress,
    notBtnImg,
  } = props;

  const [val, setVal] = useState<string>(String(value));
  // 用于render刷新页面
  const [_, setIsRender] = useState<boolean>(true);

  // ref仅用于长按
  const valRef = useRef(String(value));
  const [isBeforeChange, setIsBeforeChange] = useState(props.isInitBeforeChange || false);
  // 用于区分当前是减少还是增加操作
  let isAdd = false;

  const range = (_val: number) => {
    _val = Math.max(_val, min!);
    if (max) {
      _val = Math.min(_val, max!);
    }
    return _val;
  };

  /** 计算并处理小数精度问题 */
  const handleDecimals = (_val: number, _step: number): number => {
    function decimalsNum(num: number) {
      let tenPow = 0;
      const pointIndex = String(num).indexOf('.');
      if (pointIndex !== -1) {
        tenPow = String(num).length - 1 - pointIndex;
      }
      return tenPow;
    }
    const _num1 = decimalsNum(_val);
    const _num2 = decimalsNum(_step);
    const max = Math.max(_num1, _num2);
    return Number((_val + (isAdd ? _step : -_step)).toFixed(max));
  };

  /** 区分是加还是减的操作 */
  const identifyBtn = (event?: ITouchEvent) => {
    const _val = longPress ? valRef.current : val;
    const newVal = handleDecimals(+_val, step!);
    const res_val = String(range(newVal));
    // 禁用按钮 || 值超出范围无效
    if (disabled || (isAdd && disablePlus) || (!isAdd && disableMinus) || +res_val !== newVal) {
      props.onOverlimit?.(isAdd);
      return;
    }
    onChangeVal(res_val);
    if (isAdd) props.onPlus?.(event!, res_val);
    else props.onMinus?.(event!, res_val);
  };

  // 用于长按事件
  const isLongPress = useRef<boolean>(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const onTouchStart = () => {
    if (!longPress) return;
    isLongPress.current = false;
    clearTimeout(longPressTimer.current!);
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      identifyBtn();
      longPressStep();
    }, LONG_PRESS_START_TIME);
  };
  /** 触摸移动了就取消长按事件，防止下拉刷新的长按操作导致监听不到onTouchEnd，一直触发长按事件 */
  const onTouchMove = () => {
    if (longPress) {
      clearTimeout(longPressTimer.current!);
    }
  };
  const onTouchEnd = (event: ITouchEvent) => {
    if (!longPress) return;
    clearTimeout(longPressTimer.current!);
    if (isLongPress.current) {
      event.preventDefault();
    }
  };

  /** 长按中 */
  const longPressStep = () => {
    longPressTimer.current = setTimeout(() => {
      identifyBtn();
      longPressStep();
    }, LONG_PRESS_INTERVAL);
  };

  useEffect(() => {
    return () => clearTimeout(longPressTimer.current!);
  }, []);

  /** 处理按钮的事件 */
  const handleBtnEvent = (_isAdd: boolean) => ({
    onClick: (event: ITouchEvent) => {
      event.preventDefault();
      isAdd = _isAdd;
      identifyBtn(event);
    },
    onTouchStart: () => {
      isAdd = _isAdd;
      onTouchStart();
    },
    onTouchMove,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
  });

  /** 失去焦点时触发 将输入框的值保持在限制范围 */
  const onBlurVal = (newVal: string) => {
    let _val: string = newVal;
    if (!newVal) {
      _val = props.allowEmpty ? newVal : String(min!);
    } else {
      _val = String(range(+_val));
    }
    onChangeVal(_val);
  };

  /** 处理无效值 */
  const handleInvalid = () => {
    setVal(val);
    // 这里需要render一下，否则val没有变化，state识别不到变化了，Taro的Input输入框的值改不回原值
    setIsRender((v) => !v);
  };

  /** 输入值发生改变 isToFixed 是否需要小数处理 */
  const onChangeVal = (newVal: string, isToFixed: boolean = true) => {
    // 处理非数字
    if (newVal.length && newVal[0] !== '-' && isNaN(+newVal)) {
      return handleInvalid();
    }
    // 限制只能输出整数
    if (integer && newVal.indexOf('.') !== -1) {
      return handleInvalid();
    }
    // 超出范围的值
    if (+newVal !== range(+newVal)) {
      return handleInvalid();
    }
    // 处理小数
    if (isToFixed && decimalLength) {
      newVal = Number(newVal).toFixed(decimalLength);
    }

    // 前后值相等，不触发后续事件了
    if (!props.isValEqualChange && newVal === val) return;

    // 改变值之前的操作
    if (props.beforeChange && isBeforeChange) {
      callInterceptor({
        args: [newVal],
        interceptor: props.beforeChange,
        done() {
          if (longPress) valRef.current = newVal;
          setVal(newVal);
          props.onChange?.(newVal);
        },
      });
    } else {
      if (props.beforeChange && !isBeforeChange) setIsBeforeChange(true);
      if (longPress) valRef.current = newVal;
      setVal(newVal);
      props.onChange?.(newVal);
    }
  };

  /** 处理字符串或者数字类型 */
  const styleWrap = (newVal?: number | string) => {
    if (typeof newVal === 'string') return newVal;
    else return newVal ? newVal + 'px' : '';
  };

  /** 按钮大小样式 */
  const btnSizeStyle = (newVal?: number | string) => {
    newVal = styleWrap(newVal);
    return { width: newVal, height: newVal, lineHeight: newVal };
  };

  const diffStyle = (eleNum: number) => {
    let newVal = eleNum && (eleNum === 1 ? min : max);
    // 禁用样式：禁用属性，减少按钮禁用，增加按钮禁用，输入值超出范围禁用
    let className =
      disabled ||
      (disableMinus && eleNum === 1) ||
      (disablePlus && eleNum === 2) ||
      (eleNum && +val === newVal)
        ? `${classPrefix}-disabled`
        : '';
    if (props.theme === 'round') {
      const disabledClass = className ? className + '-' : `${classPrefix}-`;
      className += ` ${
        !eleNum ? `${classPrefix}-inp` : disabledClass + (eleNum === 1 ? 'reduce' : 'add')
      }-round`;
    }
    return className ? `${className}` : '';
  };

  /** 禁用的样式 0:输入框；1:减少按钮；2:增加按钮 */
  const renderBtn = useCallback(
    (eleNum: number) => {
      let newVal = eleNum && (eleNum === 1 ? min : max);
      let index = eleNum * 2 - 1;
      if (disabled || disableMinus || disablePlus || (eleNum && +val === newVal)) {
        index = eleNum * 2;
      }
      index = index - 1;
      // 处理不显示禁用的图片
      if (index === 1 && notBtnImg === 'reduce') {
        index = 0;
      } else if (index === 3 && notBtnImg === 'add') {
        index = 2;
      }
      return btnImgArr[index];
    },
    [min, max, btnImgArr, disabled, disableMinus, disablePlus, val],
  );

  return (
    <View
      className={`${classPrefix} ${classNames(props.className)}`}
      style={{ height: styleWrap(buttonSize) }}
    >
      {props.showMinus && (
        <Image
          className={`${classPrefix}-btn ${diffStyle(1)}`}
          src={renderBtn(1)}
          style={btnSizeStyle(buttonSize)}
          {...handleBtnEvent(false)}
        />
      )}
      {props.showInput && (
        <Input
          className={`${classPrefix}-inp ${diffStyle(0)}`}
          type="number"
          value={val}
          placeholder={props.placeholder}
          disabled={disabled || disableInput}
          style={{ width: styleWrap(props.inputWidth) }}
          onInput={(e) => onChangeVal(e.detail.value, false)}
          onBlur={(e) => {
            onBlurVal(e.detail.value);
            props.onBlur?.(e);
          }}
          onFocus={(e) => props.onFocus?.(e)}
        />
      )}
      {props.showPlus && (
        <Image
          src={renderBtn(2)}
          className={`${classPrefix}-btn ${diffStyle(2)}`}
          style={btnSizeStyle(buttonSize)}
          {...handleBtnEvent(true)}
        />
      )}
    </View>
  );
};

Stepper.defaultProps = {
  step: 1,
  min: 0,
  showMinus: true,
  showInput: true,
  showPlus: true,
  longPress: true,
};

export default Stepper;
