import Taro from '@tarojs/taro';
/** 复制 */
export const copy = (data?: string, tips: string = '已复制') => {
  Taro.setClipboardData({
    data: data ?? '',
    success: () => {
      Taro.showToast({ title: tips, icon: 'none', duration: 1500 });
    },
  });
};
