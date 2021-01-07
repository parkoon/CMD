/**
 *
 *
 * 분명히.. Apple을 지웠는데 Peach에서 Transition이 발생합니다.
 * ReactCSSTransitionGroup 설정에 문제가 있을까요?
 *
 */

import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Q06 extends React.Component {
  state = {
    fruits: ['Apple', 'Mango', 'Grape', 'Peach']
  }

  removeFruit = index => {
    let { fruits } = this.state
    fruits.splice(index, 1)
    this.setState({ fruits })
    console.log(fruits, index)
  }

  render() {
    return (
      <div>
        <ul>
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {this.state.fruits.map((fruit, index) => (
              <li key={fruit} onClick={() => this.removeFruit(index)}>
                {index + 1}. {fruit}
              </li>
            ))}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    )
  }
}
