/**
 *
 * 리액트 개발자라면, map 으로 컴포넌트를 렌더링할 때 key 값에 index를 넣지 말아야 합니다.
 * 이유는...
 *
 * 컴포넌트는 추가/삭제 할 때 문제가 발생한다고 합니다.
 *
 * 아래 문제의 경우,
 * 우리는 key 0  을 삭제했지만, key 0 은 그대로 남아있고, 실제로 사라진건, key 3 입니다.
 * 리액트 diff 알고리즘에 의해 리액트는 key 3이 사라졌다고 인식한다고 합니다.
 *
 * 어렵다...
 * 그냥 map 쓸 때 index 사용하지 맙시다.
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
              <li key={fruit} onClick={this.removeFruit.bind(this, index)}>
                {index + 1}. {fruit}
              </li>
            ))}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    )
  }
}
