/**
 *
 * 방법은 2가지가 있습니다.
 *
 * souldComponentUpdate 라이프 사이클을 이용해, 이 전 데이터와 현재 데이터를 비교해 렌더링 여부를 결졍해주면 됩니다.
 *
 * 또는, 얕은 비교(swallow compare) 를 쓰고 있는, PureComponent나 React.memo 를 이용할 수 있다.
 * 얕은 비교란?
 * 원시형 타입의 경우 값을 비교하고, 객체 타입은 주소값을 비교하는 것을 얕은 비교라고 한다.
 *
 */

import React, { Component, PureComponent } from 'react'

export default class Quiz03 extends Component {
  state = {
    count: 0,
    todos: []
  }

  componentDidMount() {
    this.pullingViewCount(count => {
      this.setState({
        count
      })
    })
  }

  pullingViewCount = callback => {
    setInterval(() => {
      const count = callAPI()
      callback(count)
    }, 100)
  }

  render() {
    const { count } = this.state
    return (
      <>
        <Title title="Iron man" />
        <ViewCount count={count} />
      </>
    )
  }
}

/**
 *
 * 방법 1
 *
 */
// class Title extends PureComponent {
//   render() {
//     console.log('Title rendered')

//     const { title } = this.props
//     return <h1>{title}</h1>
//   }
// }

/**
 *
 *  방법 2
 */
class Title extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.title === this.props.title) {
      return false
    }
    return true
  }
  render() {
    console.log('Title rendered')

    const { title } = this.props
    return <h1>{title}</h1>
  }
}

class ViewCount extends Component {
  render() {
    console.log('ViewCount rendered')

    const { count } = this.props
    return <span>View: {count}</span>
  }
}

// dummy func & data (server)
let count = 0
function callAPI() {
  count = count + Math.floor(Math.random() * 9)

  return count
}
