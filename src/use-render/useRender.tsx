import { useCallback, useState } from 'react';
import { useDidShow } from '@tarojs/taro';

const useRender = () => {
  const [isRender, setIsRender] = useState(false);
  /** 页面show时render页面 */
  const pageShowRender = () => {
    return useDidShow(() => {
      setIsRender((v) => !v);
    });
  };
  return {
    isRender,
    /** 手动render页面 */
    renderFn: useCallback(() => {
      setIsRender((v) => !v);
    }, []),
    pageShowRender,
  };
};

export default useRender;
