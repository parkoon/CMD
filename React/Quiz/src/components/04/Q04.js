/**
 *
 * 리스트를 클릭하면, '완료', '진행중' 을 토글 하는 기능입니다.
 * 그런데....
 * 동작을 안합니다.
 * 어떤 부분이 문제일까요?
 *
 *
 */

import React, { Component, PureComponent } from 'react'

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

  handleDone = id => {
    const { todos } = this.state
    const idx = todos.findIndex(todo => todo.id === id)

    let newTodos = [...todos]
    newTodos[idx] = { ...todos[idx], done: !todos[idx].done }

    // todos[idx].done = !todos[idx].done

    console.log(newTodos)
    this.setState({
      todos: newTodos
    })
  }

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
