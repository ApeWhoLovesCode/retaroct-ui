import React, { AriaAttributes } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import classNames from 'classnames';
import { ViewProps } from '@tarojs/components/types/View';

export type NativeProps<S extends string = never> = {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
  tabIndex?: number;
};
// } & AriaAttributes;

export function withNativeProps<P extends NativeProps>(props: P, element: ReactElement) {
  const p = {
    ...element.props,
  };
  if (props.className) {
    p.className = classNames(element.props.className, props.className);
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }
  // 可以在这里对属性进行一些处理
  // for (const key in props) {
  //   if (!props.hasOwnProperty(key)) continue
  //   // 如果 key 以 data- 或 aria- 开头则 将其添加到 p 中
  //   if (key.startsWith('data-') || key.startsWith('aria-')) {
  //     p[key] = props[key]
  //   }
  // }
  return React.cloneElement(element, p);
}

/** 排除class和style */
export function excludeClass<P extends ViewProps>(props: P) {
  const p = { ...props };
  if (p.className) {
    delete p.className;
  }
  if (p.style) {
    delete p.style;
  }
  return p;
}
