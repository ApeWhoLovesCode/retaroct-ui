import { View, Text, Image } from '@tarojs/components';
import React, { useState, useEffect, useRef } from 'react';
import useMergeProps from '../use-merge-props';
import Transition from '../transition';
import { ToastState, ToastProps } from './type';
import toast from './method';
import { off, on, trigger } from './events';
import Loading from '../loading';
import Mask from '../mask';

const classPrefix = `retaroct-toast`;

const typeImg = {
  success: require('./assets/success.svg'),
  fail: require('./assets/fail.svg'),
};

const defaultProps: ToastState = {
  duration: 2000,
  mask: false,
  forbidClick: false,
  message: '',
  type: 'text',
  loadingType: 'circular',
  position: 'middle',
  icon: '',
  maskClickClose: false,
};
type RequireType = keyof typeof defaultProps;

const Toast = (comProps: ToastProps) => {
  const props = useMergeProps<ToastProps, RequireType>(comProps, defaultProps);
  const { zIndex } = props;

  const timer = useRef<NodeJS.Timer | undefined>();
  const [isShow, setIsShow] = useState(false);
  const [state, setState] = useState<ToastState>(defaultProps);

  const onShowListener = (options: ToastProps) => {
    const _options = { ...state, ...options };
    setIsShow(true);
    setState(_options);
    clearTimeout(timer.current);
    if (_options.duration && _options.duration > 0) {
      timer.current = setTimeout(() => {
        trigger('toast_clear', options);
      }, _options.duration);
    }
  };
  const onClearListener = (options: ToastProps) => {
    clearTimeout(timer.current);
    setIsShow(false);
    options?.onClose?.();
  };

  useEffect(() => {
    on('toast_show', onShowListener);
    on('toast_clear', onClearListener);

    return () => {
      off('toast_show', onShowListener);
      off('toast_clear', onClearListener);
    };
  }, []);

  const renderMessage = () => {
    if (state.type === 'text') {
      return <Text>{state.message}</Text>;
    } else {
      return (
        <View className={`${classPrefix}_box`}>
          {state.type === 'loading' ? (
            <Loading color="white" type={state.loadingType} className={`${classPrefix}_loading`} />
          ) : (
            <Image
              src={state.icon || typeImg[state.type]}
              className={`${classPrefix}_icon`}
            ></Image>
          )}
          <Text className={`${classPrefix}_text`}>{state.message}</Text>
        </View>
      );
    }
  };

  return (
    <View className={classPrefix}>
      {(state.mask || state.forbidClick) && (
        <Mask
          show={isShow}
          zIndex={zIndex}
          style={{ background: state.mask ? '' : 'transparent' }}
          onClose={() => {
            state.maskClickClose && setIsShow(false);
          }}
        />
      )}
      <Transition className={`${classPrefix}-container`} show={isShow} style={{ zIndex: zIndex }}>
        <View
          className={
            `${classPrefix} ` +
            ` ${classPrefix}-content` +
            ` ${classPrefix}-${state.type === 'text' ? 'text' : 'icon'}` +
            ` ${classPrefix}-${state.position}`
          }
        >
          {renderMessage()}
        </View>
      </Transition>
    </View>
  );
};

Toast.show = toast;
Toast.loading = toast.loading;
Toast.success = toast.success;
Toast.fail = toast.fail;
Toast.clear = toast.clear;
export default Toast;
