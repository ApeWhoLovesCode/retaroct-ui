import React from 'react';
import { Component } from 'react';
import './index.less';
import Stepper, { StepperProps } from '../index';

interface StepperItem {
  title: string;
  stepper: StepperProps;
}

interface _State {
  // [key: string]: number | StepperItem[]
  [key: string]: any;
  stepperList: StepperItem[];
  isLoading?: boolean;
  loadingMsg?: string;
}

const defaultState: _State = { stepperList: [], loadingMsg: '等待中...' };
for (let i = 1; i <= 10; i++) {
  defaultState[`value_${i}`] = 1;
}

export default class StepperDemo extends Component<{}, _State> {
  state: _State = defaultState;

  componentDidMount() {
    this.init();
  }

  init() {
    const list: StepperItem[] = [
      {
        title: '基础用法',
        stepper: {},
      },
      {
        title: '步长设置',
        stepper: { step: 2 },
      },
      {
        title: '限制输入范围',
        stepper: { min: -2, max: 5 },
      },
      {
        title: '自定义大小',
        stepper: { inputWidth: 28, buttonSize: 14 },
      },
      {
        title: '固定小数位数',
        stepper: { decimalLength: 1, step: 0.2 },
      },
      {
        title: '圆角风格',
        stepper: { theme: 'round', placeholder: '圆角', max: 5 },
      },
      {
        title: '限制输入整数',
        stepper: { integer: true },
      },
      {
        title: '禁用状态',
        stepper: { disabled: true },
      },
      {
        title: '禁用减少按钮和输入框',
        stepper: { disableInput: true, disableMinus: true },
      },
      {
        title: '异步变更',
        stepper: {
          // isInitBeforeChange: true,
          beforeChange: (val: string) => {
            const loadingMsg =
              +val > 0 ? `当前值为:${val}，值有效，等待中` : `当前值为:${val}，不大于1，拒绝执行`;
            this.setState({ isLoading: true, loadingMsg }, () => {
              setTimeout(() => {
                this.setState({ isLoading: false });
              }, 1000);
            });

            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(+val > 0);
              }, 1000);
            });
          },
        },
      },
    ];
    const stepperList = list.map((item, index) => {
      const valueIndex = `value_${index + 1}`;
      if (this.state.hasOwnProperty(valueIndex)) {
        item.stepper.value = this.state[valueIndex];
        item.stepper.onChange = (value: string) => {
          this.setState({ [valueIndex]: value });
        };
      }
      return item;
    });
    // console.log('stepperList: ', stepperList);
    this.setState({ stepperList });
  }

  render() {
    return (
      <div className="demo-stepper">
        <div className="wrap">
          {this.state.stepperList.map((item, index) => {
            return (
              <div className="item" key={index}>
                <div className="left">{item.title}</div>
                <div className="right">
                  <Stepper {...item.stepper} />
                </div>
              </div>
            );
          })}
        </div>
        {this.state.isLoading && <div className="loading">{this.state.loadingMsg}</div>}
      </div>
    );
  }
}
