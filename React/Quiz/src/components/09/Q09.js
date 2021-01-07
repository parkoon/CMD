/**
 *
 * github api 를 이용해, 사용자 정보를 검색하는 컴포넌트 입니다.
 *
 * 아래 코드는 모두 class 기반으로 구현되어 있습니다.
 * class 기반으로 구현된 코드는 hook 으로 변경해주세요.
 *
 *
 */

import React from 'react'
import axios from 'axios'
import _ from 'lodash'

class Q09 extends React.Component {
  state = {
    input: '',
    user: {}
  }

  componentWillUpdate(nextProps, nextState) {
    const { input } = this.state
    if (input !== nextState.input) {
      this.fetchUser(nextState.input)
    }
  }

  fetchUser = async username => {
    try {
      const { data: user } = await githubAPI(username)
      this.setState({
        user
      })
    } catch (err) {
      this.setState({
        user: {}
      })
    }
  }

  handleChange = e => {
    const { value } = e.target
    this.setState({
      input: value
    })
  }

  render() {
    const { handleChange } = this
    const { input, user } = this.state

    return (
      <div>
        <input
          placeholder="Github 계정명을 입력해주세요..."
          value={input}
          onChange={handleChange}
        />
        {!_.isEmpty(user) ? (
          <UserInfo info={user} />
        ) : (
          <div className="notfound">검색된 사용자가 없습니다.</div>
        )}
      </div>
    )
  }
}

// sample component (don't touch)
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

// sample api func (don't touch)
function githubAPI(username) {
  return axios.get(`https://api.github.com/users/${username}`)
}

export default Q09
