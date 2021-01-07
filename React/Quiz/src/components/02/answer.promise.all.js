/**
 *
 * 두 API 결과 간 의존성이 없다면, 병렬로 호출하는 것이 좋습니다.
 * 병렬로 호출하는 방법으로는 Promise.all이 있습니다.
 *
 * timeout 을 처리하는 방법으로는 Promise.race 를 사용하면 됩니다.
 * race의 경우에는 가장 먼저 처리된 promise는 반환합니다.
 * 따라서, A (3초), timeout(2초) 를 합께 race의 파라미터로 넣게 되면, timeout이 먼저 실행되게 됩니다.
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
    }, 5000)
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
