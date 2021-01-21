# Common Mistakes in React Development 2020

## 1. 불필요한 히스토리 중첩

`router.push` 로 페이지를 이동하면 브라우저는 새로운 `history` 인스턴스를 생성한다. 불필요한 `router.push` 는 앱에 부하를 줄 수 있으므로 상황에 맞게 잘 써야한다.

아래 예시에서 상황에 맞지 않는 `router.push` 를 보여주고 있다.

```javascript
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  const toSomewhere = () => {
    router.push("somewhere");
  };
  return (
    <div>
      <h1>HOME</h1>
      <button onClick={toSomewhere}>TO SOMEWHERE</button>
    </div>
  );
}
```

위 코드에서 `TO SOMEWHERE` 를 클릭했을 때 `router.push("somewhere")` 로 페이지를 이동하고 있다.

```javascript
import { useRouter } from "next/router";

function Somewhere() {
  const router = useRouter();

  const toHome = () => {
    // 💩
    router.push("/");
  };
  return (
    <div>
      <h1>SOMEWHERE</h1>
      <button onClick={toHome}>TO HOME</button>
    </div>
  );
}
```

위 코드에서는 메인 페이지(`/`) 로 이동하고 있다. 이 상황에서는 `router.back` 메소드를 사용하는게 더 적합해보인다.
`router.back` 메소드를 사용하면 `history` 객체를 새로 생성하지 않고 페이지를 뒤로 이동 할 수 있다.

```javascript
function Somewhere() {
  ...

  const toHome = () => {
    // 🙂
    router.back()
  };
  ...
}
```

> 뒤로 이동하려는 것이 목적이 었다면, 그 목적에 맞는 `router.back` 메소드를 사용하자.

## 2. 프레젠테이션 컴포넌트와 컨테이너 컴포넌트를 분리

재사용성 up

## 3. 키의 부재

변화가 있을 때 키가 없으면 React 를 DOM 요소를 모두 찾는다. 반면, 키 값이 있으면 키를 찾아 변한 부분만 변경이된다.

## 4. 비동기 상태 업데이트

setState 는 비동기로 동작합니다. 카운트 증가, 연속 클릭과 같이 상태를 변경할 땐 콜백 함수를 이용해 상태를 변경해야합니다.

## 5. 불필요한 렌더링

- 불필요한 렌더링을 막기위해서는 업데이트가 필요없는 컴포넌트를 분리하여 React.memo 를 이용해 메모리에
  저장해둔다.
- useState 를 무분별하게 사용하면 안된다.

### 5-1. useRef

카운터를 증가시켜서 서버에 전송한다면..? useState 를 써야할까?

### 5-2. React.memo

### 5-3. React.useMemo

### 6. useEffect를 사용해 액션 핸들링`

장담할 수 없다. 코드 가독성도 매우 떨어진다.

### 7. 단일 책임 원칙을 준수한 컴포넌트

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

### 8. 단일 책임 원칙을 준수한 useEffect

숫자가 변경될 때 카운터가 실행되고, fetch 한다면, 훅을 따로써야지?

### 9. 잘못된 HOC 의 사용

use hoc without displayName

### 10. router.push 를 이용한 라우팅 이동

## 참고

- https://www.tiny.cloud/blog/six-common-mistakes-to-avoid-when-using-react/
