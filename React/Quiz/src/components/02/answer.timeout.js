/**
 * promise의 race는 먼저 수행된 비동기 처리의 데이터를 반환합니다.
 * 이 특성을 이용해 timeout을 구현할 수 있습니다.
 *
 */

import React, { useEffect, useCallback, useState } from 'react'

function Q02() {
  const [posts, setPosts] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const whatsup = useCallback(async () => {
    Promise.race([getPosts(), timeout(1000)])
      .then(res => {
        setPosts(res)
      })
      .catch(err => {
        setErrorMessage(err)
      })
  }, [])

  useEffect(() => {
    whatsup()
  }, [whatsup])

  return (
    <>
      <h1>POSTS</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <span className="error">{errorMessage}</span>
    </>
  )
}

// dummy func & data
const timeout = (time = 500) =>
  new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject('api call timeout')
    }, time)
  })

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

export default Q02
