/**
 *
 * 먼저, ChildrenComponent 가 PureComponent를 상속받도록 합니다
 * 그래도, 계속 렌더링이 되고 있는 것을 볼 수 있있습니다
 *
 * 왜?
 *
 * ChildrenComponent 가 렌더링 될 때마가 새로운 배열객체 (items)를 생성하고 있기 때문입니다.
 *
 * 성능이 크게 중요한 프로젝트가 아니라면, 가독성이 좋은 방식으로 코딩하는 것을 추천합니다.
 *
 *
 */

import React, { PureComponent, Component } from 'react'

const items = ['apple', 'banana', 'orange']

export default class Q05 extends Component {
  state = {
    count: 0
  }
  onIncrement = () => {
    this.setState(prevState => {
      return {
        count: prevState.count + 1
      }
    })
  }
  render() {
    const { count } = this.state
    return (
      <>
        <ChildrenComponent items={items} />
        {count}
        <button onClick={this.onIncrement}>+</button>
      </>
    )
  }
}

class ChildrenComponent extends PureComponent {
  render() {
    const { items } = this.props

    console.log('ChildrenComponent rendered!')
    return (
      <ul>
        {items.map((item, key) => (
          <li key={key}>{item}</li>
        ))}
      </ul>
    )
  }
}
