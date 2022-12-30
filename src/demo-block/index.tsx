import React from "react"
import './index.less';

const classPrefix = `com-demo-block`

type PropsType = {
  title: string
  padding?: number
  children: React.ReactNode
}

const demoBlock: React.FC<PropsType> = ({title, padding = 0, children}) => {
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-title`}>{title}</div>
      <div className={`${classPrefix}-content`} style={{padding}}>{children}</div>
    </div>
  )
}

export default demoBlock