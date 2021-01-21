# Noob & Pro

1. 불필요한 히스토리 중첩

계속 push 만 사용하지 말고 back 을 이용해라.

2. 프레젠테이션 컴포넌트와 컨테이너 컴포넌트를 분리하자

재사용성 up

3. 키를 사용해라

변화가 있을 때 키가 없으면 React 를 DOM 요소를 모두 찾는다. 반면, 키 값이 있으면 키를 찾아 변한 부분만 변경이된다.

4. 비동기 setState

setState 는 비동기로 동작합니다. 카운트 증가, 연속 클릭과 같이 상태를 변경할 땐 콜백 함수를 이용해 상태를 변경해야합니다.

5.  Passing objects or other values of non-primitive type to the useEffect's dependency array
    https://claritydev.net/blog/the-most-common-mistakes-when-using-react/

6.  불필요한 렌더링 막기 useState --> useRef를 써도 된다.

카운터를 증가시켜서 서버에 전송한다면..? useState 를 써야할까?

7. useEffect를 사용해 액션 핸들링하기

장담할 수 없다. 코드 가독성도 매우 떨어진다.

8. 단일 책임 원칙을 준수한 컴포넌트

```
function Header({ menuItems }) {
  return (
    <header>
      <HeaderInner menuItems={menuItems} />
    </header>
  );
}

function HeaderInner({ menuItems }) {
  return isMobile() ? <BurgerButton menuItems={menuItems} /> : <Tabs tabData={menuItems} />;
}
```

```
function Header(props) {
  return (
    <header>{isMobile() ? <BurgerButton menuItems={menuItems} /> : <Tabs tabData={menuItems} />}</header>
  );
}
```

9. 단일 책임 원칙을 준수한 useEffect

숫자가 변경될 때 카운터가 실행되고, fetch 한다면, 훅을 따로써야지?

10. use hoc without displayName
