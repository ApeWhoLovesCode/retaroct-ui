import React from "react"
import './index.less';
import classNames from 'classnames';

const classPrefix = `com-demo-block`

type PropsType = {
  title: string
  padding?: string
  className?: string
  children: React.ReactNode
}

const demoBlock: React.FC<PropsType> = ({title, padding = 0, children, className}) => {
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-title`}>{title}</div>
      <div className={`${classPrefix}-content ${classNames(className)}`} style={{padding}}>{children}</div>
    </div>
  )
}

export default demoBlock