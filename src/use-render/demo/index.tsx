import React from 'react';
import useRender from '..';

let v = 1;

const UseRenderDemo: React.FC = () => {
  const { renderFn } = useRender();
  return (
    <div>
      <div>renderFn: {v}</div>
      <button
        onClick={() => {
          v++;
        }}
      >
        add
      </button>
      <div>
        <button
          onClick={() => {
            renderFn();
          }}
        >
          render
        </button>
      </div>
    </div>
  );
};

export default UseRenderDemo;
