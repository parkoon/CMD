/**
 *
 *  - 성능 (스크롤 이벤트가 발생하는 족족 모두 처리한다면, 엄청난 부하가 발생 할 수 있어요)
 *   ==> 스크롤 이벤트가 발생 할 때마다 특정 기능 (DOM 처리, API 처리...)을 수행한다면, 엄청난 부하가 올 수 있습니다. 이 때 특정 동작을 제한하는 throttling 와 debounce 라는 개념을 적용할 수 있는데, 아래와 같은 경우는 throttling을 적용해주는게 적합합니다.
 *        (throttling 과 debounce 참고 문서: https://webclub.tistory.com/607)
 *  - 메모리 누수
 *   ==> 보통 컴포넌트가 마운트 되었을 때 element.addEventListener를 해줍니다. 끝이 아닙니다. 컴포넌트가 언마운트 될 때는 element.removeEventListener 를 꼭 해줘야 메모리 누수를 막을 수 있습니다.
 *  - 재사용성
 *   ==> custom hook 을 만들어, 다른 컴포넌트에서도 사용할 수 있게 만들어 줍니다.
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import throttle from 'lodash/throttle'

function Q07() {
  const [boxes, setBoxes] = useState(
    Array.from(new Array(10), n => ({ title: 'box' }))
  )

  useInfiniteScroll(addBox)

  function addBox() {
    setBoxes(prevState => [...prevState, { title: 'box' }]) // good
    // setBoxes([...boxes, { title: 'box' }]) bad!
  }

  return (
    <>
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

// custom hook
function useInfiniteScroll(callback) {
  const handleScroll = throttle(e => {
    if (
      document.body.scrollHeight <
      window.innerHeight + window.scrollY + 200
    ) {
      callback()
    }
  }, 200)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
}

export default Q07
