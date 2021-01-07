/**
 *
 * User 와 Posts 를 가져와 화면에 렌더링 시키는 코드입니다. (setTimeout 을 이용해, 서버와 비동기 통신을 했다고 가정합니다.)
 * Post와 User는 관계 없는 데이터라고 가정한다면, 성능을 개선시킬 수 있는 방법은 무엇이 있을까요?
 *
 * 추가로...
 *
 * retry와 timeout 은 어떻게 구현 할 수 있을까요?
 *
 */

import React, { useEffect, useCallback, useState } from 'react'

function Q02() {
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])

  const whatsup = useCallback(async () => {
    Promise.all([getPosts(), getUser()]).then(([posts, user]) => {
      setUser(user)
      setPosts(posts)
    })
  }, [])

  useEffect(() => {
    whatsup()
  }, [whatsup])

  return (
    <>
      <h1>USER</h1>
      <table>
        <tr>
          <th>이름</th>
          <th>나이</th>
        </tr>
        <tr>
          <td>{user.name}</td>
          <td>{user.age}</td>
        </tr>
      </table>

      <h1>POSTS</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  )
}

// dummy func & data
const getUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(user)
    }, 2000)
  })
}

const getPosts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(posts)
    }, 3000)
  })
}
const posts = [
  {
    id: 1,
    title: 'the release of Letraset sheets containing Lorem Ipsum passages'
  },

  {
    id: 2,
    title: 'simply dummy text of the printing '
  }
]

const user = {
  name: 'parkoon',
  age: 21
}

export default Q02
