import { BaseEventOrig, ITouchEvent } from '@tarojs/components';

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
  theme?: 'round';
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
  /** 值没变是否触发onChange等事件 默认：false */
  isValEqualChange?: boolean;
  /** 类名 */
  className?: string;
  /** 不显示减号或加号的禁用图标 */
  notBtnImg?: 'add' | 'reduce';
  /** 输入值变化前的回调函数，返回 false 可阻止输入，支持返回 Promise 默认：false  */
  beforeChange?: (value: string) => boolean | Promise<boolean>;
  /** 当绑定值变化时触发的事件 */
  onChange?: (val: string) => void;
  /** 点击不可用的按钮时触发 isAdd用于区分加还是减 */
  onOverlimit?: (isAdd: boolean) => void;
  /** 点击增加按钮时触发	 */
  onPlus?: (event: ITouchEvent, val: number | string) => void;
  /** 点击减少按钮时触发	 */
  onMinus?: (event: ITouchEvent, val: number | string) => void;
  /** 输入框聚焦时触发	 */
  onFocus?: (event: BaseEventOrig<any>) => void;
  /** 输入框失焦时触发	 */
  onBlur?: (event: BaseEventOrig<any>) => void;
}
