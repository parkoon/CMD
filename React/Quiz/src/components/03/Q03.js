/**
 *
 * polling 방식으로 view count를 가져오고 있다고 가정합니다.
 *
 * view는 3초마다 렌더링이 발생하고 있습니다.
 * 이 때, 렌더링이 필요없는 Title 컴포넌트도 다시 렌더링 되고 있습니다.
 *
 * 어떻게 하면, Title 컴포넌트의 렌더링을 막을 수 있을까요?
 */

import React, { Component } from 'react'

export default class Quiz03 extends Component {
  state = {
    count: 0
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
    }, 3000)
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

class Title extends React.PureComponent {
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
