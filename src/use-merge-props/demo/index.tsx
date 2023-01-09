import React from 'react';
import useMergeProps from '..';

const Demo: React.FC = () => {

  return (
    <div>
      <DemoTitle title='这是一个dome的标题' />
    </div>
  );
};

type DemoTitleProps = {
  title: string
  color?: string
  fontSize?: string
}
const defaultProps = {
  title: '标题',
  color: 'skyblue',
}
const DemoTitle = (comProps: DemoTitleProps) => {
  const props = useMergeProps<DemoTitleProps, 'color'>(comProps, defaultProps)
  const {title, color, fontSize} = props
  return (
    <div style={{color, fontSize}}>{title}</div>
  )
}

export default Demo;
