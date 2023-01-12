import { View, Canvas } from '@tarojs/components';
import Taro, { CanvasContext, createCanvasContext } from '@tarojs/taro';
import { useState, useEffect, ReactNode, useRef } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import React from 'react';
import useMergeProps from '../use-merge-props';
import { randomStr } from '../utils/random';
import colorVar from '../style/var';
import { getFieldsInfo } from '../utils/getEleInfo';
import { range } from '../utils/format';
import { isObj } from '../utils/validate';

const classPrefix = `retaroct-circle`;
/** 圆的一周 2π */
const PERIMETER = 2 * Math.PI;
/** 一开始的角度，由于是顶部所以是 -90° */
const BEGIN_ANGLE = -Math.PI / 2;
/** 最大值 */
const MAX = 100;

export type CircleProps = {
  /** 其中的文本信息 */
  text?: ReactNode;
  /** 线条的端点样式 */
  lineCap?: keyof CanvasContext.lineCap;
  /**
   * @description 进度值 最小为0 最大为100
   * @default 0
   */
  value?: number;
  /** 速度 */
  speed?: number;
  /**
   * 大小
   * @default 100
   */
  size?: number;
  /** 为圆环中填充颜色 */
  fill?: string;
  /** 进度条的底色 */
  layerColor?: string;
  /** 颜色 (h5暂不支持渐变) */
  color?: string | Record<string, string>;
  /**
   * 线的宽度
   * @default 6
   */
  strokeWidth?: number;
  /**
   * 是否是顺时针方向的
   * @default true
   */
  clockwise?: boolean;
  children?: ReactNode;
} & NativeProps<'--text-color' | '--text-font-size'>;

const defaultProps = {
  value: 0,
  size: 100,
  speed: 100,
  color: colorVar.blue,
  layerColor: colorVar.gray1,
  lineCap: 'round',
  strokeWidth: 6,
  clockwise: true,
};
type RequireType = keyof typeof defaultProps;
type DefaultPropsType = Omit<typeof defaultProps, 'lineCap'> & {
  lineCap?: keyof CanvasContext.lineCap;
};

const Circle = (comProps: CircleProps) => {
  const props = useMergeProps<CircleProps, RequireType>(comProps, defaultProps as DefaultPropsType);
  const {
    value,
    size,
    strokeWidth,
    color,
    text,
    speed,
    clockwise,
    lineCap,
    layerColor,
    fill,
    children,
    ...ret
  } = props;

  const idRef = useRef(randomStr(classPrefix));
  const canvasRef = useRef<CanvasRef>({
    ctx: undefined,
    curVal: 0,
    curColor: '',
    timer: undefined,
  });
  const [ready, setReady] = useState(false);

  /** 在canvas上绘画 */
  const drawCanvas = (
    context: CanvasContext,
    strokeStyle: string | Taro.CanvasGradient,
    beginAngle: number,
    endAngle: number,
    fill?: string,
  ) => {
    const position = size / 2;
    const radius = position - strokeWidth / 2;
    context.setStrokeStyle(strokeStyle);
    context.setLineWidth(strokeWidth);
    context.setLineCap(lineCap);
    context.beginPath();
    context.arc(position, position, radius, beginAngle, endAngle, !clockwise);
    context.stroke();
    if (fill) {
      context.setFillStyle(fill);
      context.fill();
    }
  };

  /** 画圆 */
  const drawCircle = (curVal: number) => {
    canvasRef.current.ctx?.clearRect(0, 0, size, size);
    /** 绘画背景圆环 */
    drawCanvas(canvasRef.current.ctx!, layerColor, 0, PERIMETER, fill);
    const formatVal = range(curVal, 0, MAX);
    /** 绘画当前进度的圆环 */
    if (formatVal !== 0) {
      const progress = PERIMETER * (formatVal / 100);
      const endAngle = clockwise ? BEGIN_ANGLE + progress : 3 * Math.PI - (BEGIN_ANGLE + progress);
      drawCanvas(canvasRef.current.ctx!, canvasRef.current.curColor, BEGIN_ANGLE, endAngle);
    }
    if (process.env.TARO_ENV === 'h5') {
      canvasRef.current.ctx?.draw();
    }
  };

  /** 设置进度条颜色 */
  const setCurColor = () => {
    if (isObj(color)) {
      try {
        const _color = color as Record<string, string>;
        if (process.env.TARO_ENV === 'weapp') {
          const linearColor = canvasRef.current.ctx?.createLinearGradient(size, 0, 0, 0);
          Object.keys(color)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .map((key: any) => linearColor!.addColorStop(parseFloat(key) / 100, _color[key]));
          canvasRef.current.curColor = linearColor!;
        } else {
          // h5 不支持 createLinearGradient 方法 会报错
          const keysArr = Object.keys(color).sort((a, b) => parseFloat(a) - parseFloat(b));
          canvasRef.current.curColor = _color[keysArr.at(-1) ?? ''];
        }
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
      canvasRef.current.curColor = color as string;
    }
  };

  const _cancelAnimationFrame = () => {
    if (canvasRef.current.timer !== void 0) {
      cancelAnimationFrame(canvasRef.current.timer);
      canvasRef.current.timer = void 0;
    }
  };

  /** 渲染圆环进度条 */
  const renderCircle = () => {
    if (speed <= 0 || speed > 1000) {
      drawCircle(value);
      return;
    }
    _cancelAnimationFrame();
    const _step = speed / MAX;
    const setStep = () => {
      const _v = canvasRef.current.curVal;
      if (Math.abs(_v - value) < _step) {
        canvasRef.current.curVal = value;
      } else {
        canvasRef.current.curVal += (_v < value ? 1 : -1) * _step;
      }
      drawCircle(canvasRef.current.curVal);
    };
    (function run() {
      setStep();
      if (canvasRef.current.curVal !== value) {
        canvasRef.current.timer = requestAnimationFrame(run);
      } else {
        _cancelAnimationFrame();
      }
    })();
  };

  useEffect(() => {
    if (ready) {
      renderCircle();
    }
  }, [value, ready]);

  /** 设置进度条颜色并绘画 */
  useEffect(() => {
    if (ready) {
      setCurColor();
      drawCircle(canvasRef.current.curVal);
    }
  }, [color, ready]);

  /** 绘画圆环 */
  useEffect(() => {
    if (ready) {
      drawCircle(canvasRef.current.curVal);
    }
  }, [size, ready]);

  /** 初始化获取 canvas 上下文 */
  useEffect(() => {
    const init = () => {
      if (process.env.TARO_ENV !== 'h5') {
        getFieldsInfo(`#${idRef.current}`, { node: true, size: true }).then((res) => {
          const canvas = res.node;
          const ctx = canvas.getContext('2d') as CanvasContext;
          /** 给canvas设置宽高 (html中的 width 和 height 属性没给到canvas) */
          canvas.width = res.width * 3;
          canvas.height = res.height * 3;
          // 增加清晰度
          ctx.scale(3, 3);
          canvasRef.current.ctx = ctx;
          setReady(true);
        });
      } else {
        const ctx = createCanvasContext(idRef.current);
        canvasRef.current.ctx = ctx;
        setReady(true);
      }
    };
    setTimeout(() => {
      init();
    }, 100);

    return () => {
      _cancelAnimationFrame();
    };
  }, []);

  return withNativeProps(
    ret,
    <View className={classPrefix}>
      <Canvas
        id={idRef.current}
        canvasId={idRef.current}
        type="2d"
        className={`${classPrefix}-canvas`}
        // eslint-disable-next-line
        // @ts-ignore
        width={size}
        // @ts-ignore
        height={size}
        // 用于透传 WebComponents 上的属性到内部 H5 标签上 没有会导致圆出问题，变成椭圆
        nativeProps={{ width: size, height: size }}
        style={{ width: size + 'px', height: size + 'px' }}
      ></Canvas>
      <View className={`${classPrefix}-text`}>{text ?? children}</View>
    </View>,
  );
};

export default Circle;

type CanvasRef = {
  /** canvas 上下文 */
  ctx?: CanvasContext;
  /** 当前进度条的值 */
  curVal: number;
  /** 当前进度条的颜色 */
  curColor: string | Taro.CanvasGradient;
  timer?: number;
};
