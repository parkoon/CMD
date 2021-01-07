/**
 *
 * componentWillUpdate 를 Hook으로 구현 할 수 있는가? 를 물어보는 문제입니다.
 * 또한, 함수를 선언해 놓고, useCallback 으로 메모라이징 해놓지 않으면, 계속해서 그 함수가 생성되면서, 문제가 발생합니다.
 *
 * 추가로, debounce 를 custom hook으로 구현한 것을 확인 할 수 있습니다.
 *
 */

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'

function Q09() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 1000)
  const [user, setUser] = useState({})

  const fetchUser = useCallback(async () => {
    console.log('call')
    try {
      const { data } = await githubAPI(input)
      setUser(data)
    } catch (err) {}
  }, [input])

  const handleChange = useCallback(e => {
    setInput(e.target.value)
  }, [])

  useEffect(() => {
    debouncedValue ? fetchUser(debouncedValue) : setUser({})
  }, [debouncedValue, fetchUser])
  return (
    <div>
      <input
        placeholder="Github 계정명을 입력해주세요..."
        value={input}
        onChange={handleChange}
      />
      {!_.isEmpty(user) && <UserInfo info={user} />}
    </div>
  )
}

function useDebounce(value, timeout) {
  const [state, setState] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setState(value), timeout)
    return () => {
      clearTimeout(timer)
    }
  }, [timeout, value])

  return state
}

function UserInfo({ info }) {
  const { avatar_url, name, bio } = info

  return (
    <div className="profile">
      <div className="profile-header">
        <img className="thumbnail" src={avatar_url} alt="user thumbnail" />
        <span>{name}</span>
      </div>
      <h2 className="profile-bio">{bio}</h2>
    </div>
  )
}

// fetch github info
function githubAPI(username) {
  return axios.get(`https://api.github.com/users/${username}`)
}

export default Q09
