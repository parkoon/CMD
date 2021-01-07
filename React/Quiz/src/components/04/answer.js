/**
 *
 * 여기서 우리는, 왜 불변성을 유지해야 하는지 알 수 있습니다.
 *
 * PureComponent의 경우,
 *
 * 얕은 비교를 진행합니다. 비교해를 해서, 이전과 데이터가 같다면 렌더링을 하지 않고, 데이터가 달라지면 렌더링을 진행합니다.
 * 데이터라고 했지만, 객체의 경우 주소값을 비교합니다.
 *
 * 문제의 코드같은 경우, todos 배열 객체를 직접 수정하고 있습니다. 불변성을 무시한 경우입니다.
 *
 * 따라서, PureComponent는 변화를 감지 못하고, 렌더링을 진행하지 않게됩니다.
 *
 * 해결책은 아래 참고!
 */

import React, { Component, PureComponent } from 'react'
import produce from 'immer'

export default class Q04 extends Component {
  state = {
    todos: [
      {
        id: 1,
        title: '집 사러 가기',
        done: false
      },
      {
        id: 2,
        title: '반차 쓰기',
        done: false
      }
    ]
  }

  // 해결책 1
  // handleDone = id => {
  //   const { todos } = this.state
  //   const updatedTodos = todos.map(todo => {
  //     if (todo.id === id) {
  //       todo.done = !todo.done
  //     }
  //     return todo
  //   })
  //   this.setState({
  //     todos: updatedTodos
  //   })
  // }
  // 해결책 2
  // handleDone = id => {
  //   const { todos } = this.state
  //   const idx = todos.findIndex(todo => todo.id === id)
  //   this.setState({
  //     todos: [
  //       ...todos.slice(0, idx),
  //       {
  //         ...todos[idx],
  //         done: !todos[idx].done
  //       },
  //       ...todos.slice(idx + 1, todos.length)
  //     ]
  //   })
  // }

  // 해결책 3
  // handleDone = id => {
  //   const { todos } = this.state
  //   const idx = todos.findIndex(todo => todo.id === id)

  //   this.setState({
  //     todos: produce(todos, draft => {
  //       draft[idx].done = !draft[idx].done
  //     })
  //   })
  // }

  render() {
    const { todos } = this.state

    return (
      <>
        <Todos items={todos} handleDone={this.handleDone} />
      </>
    )
  }
}

class Todos extends PureComponent {
  render() {
    const { items, handleDone } = this.props
    return (
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => handleDone(item.id)}>
            {item.title} - {item.done ? '완료' : '진행중'}
          </li>
        ))}
      </ul>
    )
  }
}
