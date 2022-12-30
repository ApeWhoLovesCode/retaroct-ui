import React from 'react';
import useTouch from '..';

const UseRenderDemo: React.FC = () => {
  const touch = useTouch()
  return (
    <div className="demo-use-touch">
      <div>touch.deltaX: {touch.deltaX}</div>
      <div>touch.deltaY: {touch.deltaY}</div>
    </div>
  );
};

export default UseRenderDemo;
