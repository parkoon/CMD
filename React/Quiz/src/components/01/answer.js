/**
 *
 * this.setState 는 비동기로 동작합니다.
 * 이 전 상태를 참조하여 변경하려는 경우에는 this.setState((prevState) =>({ ... }))
 * 와 같이 코드를 작성해야 합니다.
 *
 */

import React, { Component } from 'react'

export default class Q01 extends Component {
  state = {
    count: 0
  }

  handleClick = () => {
    for (let i = 0; i < 20; i++) {
      this.setState(prevState => {
        return {
          count: prevState.count + 1
        }
      })
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
