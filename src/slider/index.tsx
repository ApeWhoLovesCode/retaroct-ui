import { View } from '@tarojs/components';
import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { randomStr } from '../utils/random';
import useTouches, { UseTouchesOptions } from '../use-touches';
import { range } from '../utils/format';
import getEleInfo from '../utils/getEleInfo';
import { classBem, stylePxTransform } from '../utils/handleDom';

const classPrefix = `retaroct-slider`;

type ValueType = number | number[];

export type SliderProps = {
  /** 是否有双滑块 需要保证value为数组 */
  isTwo?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 激活的颜色 */
  activeColor?: string;
  /** 未激活的颜色 */
  inactiveColor?: string;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
  /** 步长值 */
  step?: number;
  /** 当前的滑块值 */
  value?: ValueType;
  /** 滑块bar的高度 */
  barHeight?: number | string;
  /** 是否是垂直方向 */
  vertical?: boolean;
  /** 自定义的按钮样式 */
  button?: React.ReactNode;
  /** 是否有动画 */
  isAnimation?: boolean;
  /** 值改变时触发 */
  onChange?: (v: ValueType) => void;
  /** 拖拽开始触发 */
  onDragStart?: (v: ValueType) => void;
  /** 拖拽结束触发 */
  onDragEnd?: (v: ValueType) => void;
} & NativeProps;

const defaultProps = {
  max: 100,
  min: 0,
  step: 1,
  value: 0,
};
type RequireType = keyof typeof defaultProps;

const Slider = (comProps: SliderProps) => {
  const props = useMergeProps<SliderProps, RequireType>(comProps, defaultProps);
  const {
    isTwo,
    disabled,
    activeColor,
    inactiveColor,
    min,
    max,
    barHeight,
    step,
    value,
    vertical,
    button,
    isAnimation,
    onChange,
    onDragStart,
    onDragEnd,
    ...ret
  } = props;

  const idRef = useRef(randomStr(classPrefix));
  /** slider的信息 */
  const sliderInfo = useRef({
    w: 0,
    h: 0,
  });
  /** 之前的值 */
  const [preVal, setPreVal] = useState<ValueType>();
  /** 当前的值 */
  const [_value, setValue] = useState<ValueType>(value);

  /** 总共的比例 */
  const total = max - min;

  /** 根据位移值获取比例值 */
  const _range = (v: number) => {
    const { w, h } = sliderInfo.current;
    const wh = vertical ? h : w;
    v = range((v / wh) * total, 0, total);
    if (v === 0 || v === total) {
      return v + min;
    }
    const remainV = v % step;
    return range(v - remainV + (Math.round(remainV / step) ? step : 0) + min, min, max);
  };
  /** 从数字或数组中获取value */
  const getVal = (v: ValueType) => (typeof v === 'number' ? v : [...v]);

  const getOptions = (i: number): UseTouchesOptions => ({
    onTouchStart() {
      if (disabled) return;
      onDragStart?.(_value);
    },
    onTouchMove(_, info) {
      if (disabled) return;
      const { w, h } = sliderInfo.current;
      const _preVal = (preVal![i] ?? preVal) - min;
      let val = _range(
        !vertical ? (_preVal / total) * w + info.deltaX : (_preVal / total) * h + info.deltaY,
      );
      let newVal: ValueType = val;
      if (typeof _value !== 'number') {
        _value[i] = val;
        newVal = _value;
      }
      setValue(getVal(newVal));
      onChange?.(newVal);
    },
    onTouchEnd() {
      if (disabled) return;
      setPreVal(getVal(_value));
      onDragEnd?.(_value);
    },
  });
  const ref = useRef<HTMLDivElement>(null);
  useTouches(ref, getOptions(0));
  const ref2 = useRef<HTMLDivElement>(null);
  useTouches(ref2, getOptions(1));

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    setTimeout(() => {
      getEleInfo(`.${idRef.current}`).then((info) => {
        if (!info) return;
        sliderInfo.current.w = info.width;
        sliderInfo.current.h = info.height;
        setPreVal(getVal(value));
      });
    }, 100);
  }, []);

  /** 根据比例转化成最终的位移值 */
  const getValPx = (v: number) =>
    ((v - min) / total) * (!vertical ? sliderInfo.current.w : sliderInfo.current.h);

  /** 获取bar的样式 */
  const getBarStyle = () => {
    let transform = '';
    if (isTwo) {
      const _v = _value as number[];
      transform = `translate(${vertical ? '0, ' : ''}${getValPx(Math.min(_v[0], _v[1]) ?? 0)}px)`;
    }
    const newValue = typeof _value === 'number' ? _value : Math.abs(_value[1] - _value[0]) + min;
    return {
      [!vertical ? 'width' : 'height']: getValPx(newValue) + 'px',
      transform,
    };
  };
  /** 获取按钮的位移值 */
  const getBtnMove = (v: number = _value as number) => getValPx(v);

  return withNativeProps(
    ret,
    <View
      className={`${classBem(classPrefix, { vertical, disabled, isAnimation })} ${idRef.current}`}
      style={{
        background: inactiveColor,
        [vertical ? 'width' : 'height']: stylePxTransform(barHeight),
      }}
    >
      <View
        className={`${classPrefix}-bar`}
        style={{
          background: activeColor,
          ...getBarStyle(),
        }}
      ></View>
      <View
        ref={ref}
        className={`${classPrefix}-btn-wrap `}
        style={{
          transform: `translate(calc(${!vertical ? getBtnMove(_value[0]) : 0}px - 50%), calc(${
            vertical ? getBtnMove(_value[0]) : 0
          }px - 50%))`,
        }}
      >
        {button ?? <View className={`${classPrefix}-btn`}></View>}
      </View>
      {isTwo && (
        <View
          ref={ref2}
          className={`${classPrefix}-btn-wrap`}
          style={{
            transform: `translate(calc(${!vertical ? getBtnMove(_value[1]) : 0}px - 50%), calc(${
              vertical ? getBtnMove(_value[1]) : 0
            }px - 50%))`,
          }}
        >
          {button ?? <View className={`${classPrefix}-btn`}></View>}
        </View>
      )}
    </View>,
  );
};

export default Slider;
