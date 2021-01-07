import React, { useEffect, useCallback, useState } from 'react'

function Q02() {
  const [posts, setPosts] = useState([])

  const whatsup = useCallback(async () => {
    const posts = await retry(getPosts)
    setPosts(posts)
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
    </>
  )
}

const retry = (callback, max = 5, interval = 500) => {
  return new Promise((resolve, reject) => {
    callback()
      .then(res => resolve(res))
      .catch(err => {
        if (max === 0) return reject(err)

        setTimeout(async () => {
          console.log('retry')
          retry(callback, max - 1).then(resolve, reject)
        }, interval)
      })
  })
}

// dummy func & data
const getPosts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(posts)
    }, 5000)

    if (Math.floor(Math.random() * 9) < 7) {
      reject('no reason')
    }
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
