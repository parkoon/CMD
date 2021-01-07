/**
 *
 * Infinite scroll
 *
 * 스크롤이 Bottom 으로 부터 200 정도 떨어졌을 때 새로운 박스를 계속해서 렌더링 할 수 있는 컴포넌트를 만들어 주세요.
 * 단, 조건이 있습니다.
 *  - 성능 (스크롤 이벤트가 발생하는 족족 모두 처리한다면, 엄청난 부하가 발생 할 수 있어요)
 *  - 메모리 누수
 *  - 재사용성
 *
 * Hint.
 *  1. 전체 스크롤 길이: document.body.scrollHeight
 *  2. 현재 스크롤 위치: window.scrollY
 *  3. 화면 높이: window.innerHeight
 */

import React, { useState } from 'react'
import styled from 'styled-components'

function Q07() {
  const [boxes, setBoxes] = useState(
    Array.from(new Array(10), n => ({ title: 'box' }))
  )

  return (
    <>
      <h1>Infinite Scroll</h1>
      {boxes.map((box, index) => (
        <StyledBox color={getRandomColor()}>{index}</StyledBox>
      ))}
    </>
  )
}

// styled
const StyledBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ color }) => `3px solid ${color}`};
  width: 420px;
  height: 150px;
  margin-bottom: 20px;
  font-size: 3rem;
  color: ${({ color }) => color};
`

// helper
const getRandomColor = () => {
  const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#7f8c8d'
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

export default Q07
