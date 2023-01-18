import React, { CSSProperties } from 'react';
import './index.less';
import classNames from 'classnames';

const classPrefix = `retaroct-demo-block`;

type PropsType = {
  title: string;
  padding?: string;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties & Partial<Record<string, string>>;
};

const demoBlock: React.FC<PropsType> = ({ title, padding = 0, children, className, style }) => {
  return (
    <div className={classPrefix} style={style}>
      <div className={`${classPrefix}-title`}>{title}</div>
      <div className={`${classPrefix}-content ${classNames(className)}`} style={{ padding }}>
        {children}
      </div>
    </div>
  );
};

export default demoBlock;
