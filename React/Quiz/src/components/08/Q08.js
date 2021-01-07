/**
 *
 * 아래 코드는, 기능에는 문제가 없습니다.
 * 하지만, 디버깅을 할 때 문제가 생깁니다.
 *
 * HOC 를 사용할 때 주의해야 할 점으로, 어떤 점이 문제가 될까요?
 */

import React from 'react'

function Q08({ title }) {
  return <div>{title}</div>
}
function withTitle(Component) {
  class Wrapper extends React.Component {
    render() {
      return <Component title="High Ordered Component" />
    }
  }

  return Wrapper
}

export default withTitle(Q08)
