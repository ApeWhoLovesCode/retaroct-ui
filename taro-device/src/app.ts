import './app.less';
import React from 'react';

const App: React.FC = (props) => {
  
  return props.children
}

export default App

// class App extends Component {

//   // this.props.children 是将要会渲染的页面
//   render () {
//     return rootContainer(this.props.children)
//     // return this.props.children
//   }
// }
