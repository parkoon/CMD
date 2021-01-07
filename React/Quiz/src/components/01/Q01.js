/**
 *
 * 예상되는 Result의 값은 무엇이며, 왜 그렇게 생각하셨나요?
 * 또한, 예상대로 동작하기 위해 어떻게 수정을 해야 할까요?
 */
import React, { Component } from 'react'

export default class Q01 extends Component {
  state = {
    count: 0
  }

  handleClick = () => {
    for (let i = 0; i < 20; i++) {
      this.setState(state => ({
        count: state.count + 1
      }))
    }
  }

  componentDidMount() {}

  render() {
    const { count } = this.state
    return (
      <>
        <h2>RESULT --> {count}</h2>

        <button onClick={this.handleClick}>START</button>
      </>
    )
  }
}
