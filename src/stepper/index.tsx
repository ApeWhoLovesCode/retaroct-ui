import './index.less';
import React, { useState, useEffect, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { callInterceptor } from './interceptor';

export interface StepperProps {
  /** 当前输入的值 */
  value?: number | string;
  /** 最小值 默认：0 */
  min?: number;
  /** 最大值 默认：∞ */
  max?: number;
  /** 步长 默认：1 */
  step?: number;
  /** 输入框宽度，默认：32px  */
  inputWidth?: string | number;
  /** 按钮大小以及输入框高度，默认：28px */
  buttonSize?: string | number;
  /** 固定显示的小数位数 */
  decimalLength?: number;
  /** 样式风格，可选值为 round */
  theme?: string;
  /** 输入框占位提示文字 */
  placeholder?: string;
  /** 是否只允许输入整数 默认：false */
  integer?: boolean;
  /** 是否禁用步进器 默认：false */
  disabled?: boolean;
  /** 是否禁用增加按钮 默认：false */
  disablePlus?: boolean;
  /** 是否禁用减少按钮 默认：false */
  disableMinus?: boolean;
  /** 是否禁用输入框 默认：false */
  disableInput?: boolean;
  /** 是否显示增加按钮 默认：true */
  showPlus?: boolean;
  /** 是否显示减少按钮 默认：true */
  showMinus?: boolean;
  /** 是否显示输入框 默认：true */
  showInput?: boolean;
  /** 是否开启长按手势 默认：true */
  longPress?: boolean;
  /** 是否允许输入的值为空 默认：false */
  allowEmpty?: boolean;
  /** 初始化时(组件创建后)是否触发 beforeChange 事件 默认：false */
  isInitBeforeChange?: boolean;
  /** 输入值变化前的回调函数，返回 false 可阻止输入，支持返回 Promise 默认：false  */
  beforeChange?: (value: string) => boolean | Promise<boolean>;
  /** 当绑定值变化时触发的事件 */
  onChange?: (val: string) => void;
  /** 点击不可用的按钮时触发 isAdd用于区分加还是减 */
  onOverlimit?: (isAdd: boolean) => void;
  /** 点击增加按钮时触发	 */
  onPlus?: (event: MouseEvent, val: number | string) => void;
  /** 点击减少按钮时触发	 */
  onMinus?: (event: MouseEvent, val: number | string) => void;
  /** 输入框聚焦时触发	 */
  onFocus?: (event: React.FormEvent) => void;
  /** 输入框失焦时触发	 */
  onBlur?: (event: React.FormEvent) => void;
}

const LONG_PRESS_INTERVAL = 200;
const LONG_PRESS_START_TIME = 600;

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
  } = props;

  const [val, setVal] = useState<string>('');
  // ref仅用于长按
  const valRef = useRef(val);
  // let isBeforeChange = props.isInitBeforeChange || false
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
  const identifyBtn = (event?: MouseEvent) => {
    if (disabled || (isAdd && disablePlus) || (!isAdd && disableMinus)) {
      props.onOverlimit?.(isAdd);
      return;
    }
    const _val = longPress ? valRef.current : val;
    const newVal = handleDecimals(+_val, step!);
    const res_val = String(range(newVal));
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

  const onTouchEnd = (event: TouchEvent) => {
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

  /** 处理按钮的事件 */
  const handleBtnEvent = (_isAdd: boolean) => ({
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      isAdd = _isAdd;
      identifyBtn(event);
    },
    onTouchStart: () => {
      isAdd = _isAdd;
      onTouchStart();
    },
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

  /** 输入值发生改变 isToFixed 是否需要小数处理 */
  const onChangeVal = (newVal: string, isToFixed: boolean = true) => {
    // 处理非数字
    if (newVal.length && newVal[0] !== '-' && isNaN(+newVal)) return;
    // 限制只能输出整数
    if (integer && newVal.indexOf('.') !== -1) return;
    // 处理小数
    if (isToFixed && decimalLength) {
      newVal = Number(newVal).toFixed(decimalLength);
    }
    // 改变值之前的操作
    if (props.beforeChange && isBeforeChange) {
      callInterceptor({
        args: [newVal],
        interceptor: props.beforeChange,
        done() {
          if (longPress) valRef.current = newVal;
          setVal(newVal);
          props.onChange!(newVal);
        },
      });
    } else {
      if (props.beforeChange && !isBeforeChange) setIsBeforeChange(true);
      if (longPress) valRef.current = newVal;
      setVal(newVal);
      props.onChange!(newVal);
    }
  };

  /** 处理字符串或者数字类型 */
  const styleWrap = (newVal?: number | string) => {
    if (typeof newVal === 'string') return newVal;
    else return newVal + 'px';
  };

  /** 按钮大小样式 */
  const btnSizeStyle = (newVal?: number | string) => {
    newVal = styleWrap(newVal);
    return { width: newVal, height: newVal, lineHeight: newVal };
  };

  /** 圆角和禁用的样式 0:输入框；1:减少按钮；2:增加按钮 */
  const diffStyle = (eleNum: number) => {
    let newVal = eleNum && (eleNum === 1 ? min : max);
    // 禁用样式：禁用属性，减少按钮禁用，增加按钮禁用，输入值超出范围禁用
    let className =
      disabled ||
      (disableMinus && eleNum === 1) ||
      (disablePlus && eleNum === 2) ||
      (eleNum && +val === newVal)
        ? 'disabled'
        : '';
    if (props.theme === 'round') {
      const disabledClass = className ? className + '-' : '';
      className += ` ${!eleNum ? 'inp' : disabledClass + (eleNum === 1 ? 'reduce' : 'add')}-round`;
    }
    return className;
  };

  /** 初始化 */
  useEffect(() => {
    onBlurVal(String(value));
  }, [value]);

  return (
    <div className="component-stepper" style={{ height: styleWrap(buttonSize) }}>
      {props.showMinus && (
        <span
          className={`btn ${diffStyle(1)}`}
          style={btnSizeStyle(buttonSize)}
          {...handleBtnEvent(false)}
        >
          -
        </span>
      )}
      {props.showInput && (
        <input
          className={`inp ${diffStyle(0)}`}
          type="text"
          value={val}
          placeholder={props.placeholder}
          disabled={disabled || disableInput}
          style={{ width: styleWrap(props.inputWidth) }}
          onChange={(e) => onChangeVal(e.target.value, false)}
          onBlur={(e) => {
            onBlurVal(e.target.value);
            props.onBlur?.(e);
          }}
          onFocus={props.onFocus}
        />
      )}
      {props.showPlus && (
        <span
          className={`btn ${diffStyle(2)}`}
          style={btnSizeStyle(buttonSize)}
          {...handleBtnEvent(true)}
        >
          +
        </span>
      )}
    </div>
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
