# # 1

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

# # 2

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
