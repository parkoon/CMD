# 객관식

## 1. 항상 동일한 `props` 를 전달받았을 때에만 렌더링을 하고 싶습니다. 성능 향상을 위해 어떻게 할 수 있을까요?

a. 컴포넌트에 `React.memo` 고차함수를 감쌉니다.

b. `useMemo` 훅을 사용합니다.

c. `useLayoutEffect` 훅을 사용합니다.

d. `useReducer` 훅을 구현해 상태를 효율적으로 관리합니다.

## 2. 아래 코드 실행 결과는 무엇일까요?

```javascript
const [, , corp] = ["Kakao", "Toss", "Qualson"];
```

a.Kakao;

b.undefined;

c.Toss;

d.Qualson;

## 3. JSX 형식의 코드를 createElement 호출 방식으로 변경해주는 툴은 어떤것일까요?

a. VS code

b. ReactDOM

c. Plugin

d. Babel

## 4. 언제 useReducer 를 사용할까요?

a. 리덕스로 변경하고자 할 때

b. 복잡한 `state` 를 관리할 때

c. 성능을 향상 시키고자 할 때

d. 컴포넌트를 분리할 때

## 5. 아래 함수가 호출되면 어떤 리액트 엘리먼트가 생성될까요?

```javascript
React.createElement("span", null, "Welcome to qualson");
```

a. `<span id="element">Welcome to qualson</span>`

b. `<span props={null}>Welcome to qualson</span>`

c. `<span>Welcome to qualson</span>`

d. `<span name="element">Welcome to qualson</span>`

## 6. 로딩 상태를 표현하기 위해서 아래 `<Suspense>`컴포넌트에 어떤 값을 추가해야 할까요?

```javascript
function Component() {
  return (
    <Suspense>
      <Message />
    </Suspense>
  );
}
```

a. loading

b. spinner

c. callback

d. fallback

## 7. 코드 스플리팅을 하기 위해서 리액트의 어떤 기능을 사용해야 할까요?

a. React.memo

b. React.suspense

c. React.split

d. React.lazy

## 8. 자식 컴포넌트에서 에러가 발생했을 때 에러를 캐치할 수 있는 리액트 기능은 무엇일까요

a. error exceptions

b. error catchers

c. error loaders

d. error boundaries

## 9. 컴포넌트가 `re-rendering` 이 발생하지 않은 상황은 언제인가요

a. `this.forceUpdate` 를 호출했을 때

b. `this.setState` 로 상태를 변경했을 때

c. 자식 컴포넌트가 렌더링 되었을 때

d. props 가 변경되었을 때

## 10. 아래 코드가 정상동작하게 수정하려 합니다. 어떤 코드를 추가해야 할까요

```javascript
class Button extends React.Component {
  constructor(props) {
    super(props);
    // 추가할 코드 위치
  }

  handleClick() {
    // do something
  }
}
```

a. this.handleClick.bind(this);

b. props.bind(handleClick);

c. this.handleClick.bind();

d. this.handleClick = this.handleClick.bind(this);

# 주관식 #1

```javascript
import randomId from "random-id";
import React, { useState } from "react";

const ENTER_CODE = 13;
const getRandomId = () => randomId(4);
const initialUser = [
  {
    id: getRandomId(),
    name: "가길동",
    email: "",
  },
];

function App() {
  const [users, setUsers] = useState(initialUser);
  const [username, setUsername] = useState();

  const handleKeyDown = (e) => {
    if (e.keyCode !== ENTER_CODE) return;

    addUser(username);
    setUsername("");
  };

  const addUser = (name) => {
    const newUser = {
      id: getRandomId(),
      name,
    };
    setUsers([newUser, ...users]);
  };

  const updateUserEmail = (e, id) => {
    if (e.keyCode !== ENTER_CODE) return;

    setUsers(
      users.map((user) =>
        user.id !== id ? user : { ...user, email: e.target.value }
      )
    );
  };

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="이름을 입력해주세요"
      />

      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <span onClick={() => deleteUser(user.id)}>{user.name} </span>
            <input
              placeholder="이메일을 입력해주세요"
              onKeyDown={(e) => updateUserEmail(e, user.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Comment

---

**comment 1** : 새로운 유저의 이름를 입력 받은 후 추가된 사용자의 이메일을 입력하는 시나리오 입니다.

**comment 2** : 새로운 유저는 리스트 첫 번째에 추가되고 있습니다.

**comment 3** : `getRandomId` 는 랜덤한 아이디를 만들기 위한 헬퍼 함수입니다.

**comment 4** : `initialUser` 는 유저 더미 데이터입니다.

**comment 5** : 데이터 입력은 엔터 [Keycode === 13] 로 처리하고 있습니다.

## Problem

---

**problem 1** : 현재 앱은 시나리오대로 동작하지 않고 있습니다. 문제가 있는 부분을 찾아 수정하고 그 이유를 설명합니다.

**problem 2** : 해당 코드를 실행하여 사용자의 이름을 입력하면 `A component is changing an uncontrolled input to be controlled` 와 같은 `Warning` 이 발생합니다. 경고를 없애기 위해 어떤 부분을 수정해야 할까요.

**problem 3** : 현재 앱은 불필요한 렌더링이 발생하고 있습니다. 불필요한 렌더링 지점을 찾고 해결 방법을 설명합니다.

# 주관식 #2

```javascript
function App({ successIncrease }) {
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    count = count + 1;
    successIncrease(count);
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={handleIncrease}>+</button>
    </div>
  );
}
```

```javascript
function App({ successIncrease }) {
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    setCount(count + 1);
    successIncrease(count);
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={handleIncrease}>+</button>
    </div>
  );
}
```

## Comment

---

**comment 1** : (+) 버튼을 클릭 할 때마다 `count` 의 상태값을 1씩 증가시키고, `successIncrease` 으로 증가된 값을 부모로 전달합니다.

**comment 2** : 두 예제의 문제점을 파악하고, 수정 방안을 제시합니다.

## Problem

---

**problem 1** : 첫 번째 예제는 정상적으로 동작하지 않으며, 두 번째 예제는 정상적으로 동작하지만 좋지 않은 코딩으로 `successIncrease` 로 부모에게 전달되는 `count` 의 값을 보장할 수 없습니다.
