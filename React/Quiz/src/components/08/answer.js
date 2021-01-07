/**
 *
 * 아래와 같이 컴포넌트를 hoc로 감싸주면, 기능에는 문제가 없습니다.
 * 다만, 크롬 devtool에서 해당 컴포넌트를 검색해보면 <Wrapper></Wrapper> 로 되어 있으면, 아래 hoc를 사용하는 모든 컴포넌트는 <Wrapper></Wrapper> 로 출력되게 됩니다.
 *
 * 따라서, 별도의 displayName을 부여해줘야 합니다.
 *
 * withHook 에 2번째 파라미터로 이름을 넘겨주어도 되고, recompose의 getDisplayName api를 이용해도 됩니다.
 */

import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

function Q08({ title }) {
  return <div>{title}</div>
}
function withHook(Component, displayName) {
  class Wrapper extends React.Component {
    render() {
      return <Component title="High Ordered Component" />
    }
  }

  Wrapper.displayName = `withSomething_${getDisplayName(Component)}`

  return Wrapper
}

export default withHook(Q08, 'QUIZ8')
