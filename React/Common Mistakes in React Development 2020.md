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

서버에서 데이터를 받아와 처리하는 부분과 화면을 보여주는 부분이 분리되어 있지 않으면, 하나의 파일에 코드양이 많아지면서 가독성이 떨어질 뿐만 아니라 컴포넌트를 재사용하는데 문제가 생긴다.

아래 예시는 데이터를 가져오는 부분과 화면을 보여주는 부분이 하나의 파일에 있는 경우다.

```javascript
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await (
        await fetch("https://jsonplaceholder.typicode.com/posts")
      ).json();
      setPosts(posts);
    }

    fetchPosts();
  }, []);
  return (
    <ul>
      {posts.map(({ id, title, body }) => (
        <li key={id}>
          <h3>{title}</h3>
          <p>{body}</p>
        </li>
      ))}
    </ul>
  );
}
```

다른 컴포넌트에서 `posts` 의 데이터가 필요하다면 `useState` 와 `useEffect` 부분을 복사해서 사용하게 된다.

어떻게하면 복사를하지 않고 컴포넌트를 재활용할 수 있을까?

데이터를 가져와 주입해주는 부분은 `PostContainer` 로 화면을 보여주는 부분을 `PostList` 로 리팩토링을 진행해보자.

_PostItem_

```javascript
function PostItem({ post }) {
  return (
    <li>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </li>
  );
}
```

_PostList_

```javascript
function PostList({ posts = [] }) {
  return (
    <ul>
      {posts.map(({ id, ...post }) => (
        <PostItem key={id} post={post} />
      ))}
    </ul>
  );
}
```

_PostContainer_

```javascript
function PostContainer() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await (
        await fetch("https://jsonplaceholder.typicode.com/posts")
      ).json();
      setPosts(posts);
    }

    fetchPosts();
  }, []);

  return <PostList posts={posts} />;
}
```

```javascript
function App() {
  return <PostContainer />;
}
```

이제 데이터를 가져오는 부분과 화면을 처리하는 부분이 분리되었다.

위 코드 써보면 알겠지만, 화면은 재사용해서 쓸 수 있는것 같은데, `PostContainer`를 보니 `PostList` 를 렌더링하고 있어서 위에서 언급한 `posts` 의 재활용엔 문제가 있다.

이 문제는 아래 2가지 방법으로 해결할 수 있다.

1. `React.cloneElement` 를 활용해 `posts` 주입
2. `children` 을 함수로 변경

#### `children.cloneElement` 를 활용해 `posts` 주입

`PostContainer` 를 아래와 같이 변경해준다.

```javascript
function PostContainer({ children }) {
  const [posts, setPosts] = useState([]);

  ...

  return React.cloneElement(children, { posts });
}
```

`children`을 받고, `React.cloneElement` 를 통해 전달받은 `children` 에 `posts` 데이터를 주입해주고 있다.

그리고 `App` 컴포넌트를 아래와 같이 변경하면 끝이다.

```javascript
function App() {
  return (
    <PostContainer>
      <PostList />
    </PostContainer>
  );
}
```

#### `children` 을 함수로 변경

`PostContainer` 에서 렌더링하는 부분을 `children` 함수 호출로 변경해준다.

```javascript
function PostContainer({ children }) {
  ...

  return children({ posts });
}
```

그리고 `App` 에서는 컴포넌트가 아닌 콜백함수는 넘겨주고 `PostContainer` 에서 콜백으로 넘겨주는 `posts` 데이터를 사용하면 된다.

```javascript
function App() {
  return (
    <PostContainer>{({ posts }) => <PostList posts={posts} />}</PostContainer>
  );
}
```

위 내용을 정리하면 우리는 데이터와 화면을 구분하기 위해

1. `Container` 와 `View` 부분을 분리
2. `Container` 에서 `React.cloneElement` 를 활용해 `posts` 주입
3. (2) 방법 또는 `Container` 에서 `children` 을 함수로 받고 `posts`를 인자로 호출

> 게으른 개발자가 되어라. 코드를 재활용할 수 있는 개발자가 되어라.

## 3. 키의 부재

```javascript
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
<ul>
```

위와 같은 리스트가 있다고 가정하자. 여기에서 `<li>3</li>` 을 제거한다고 가정하면 리액트는 모든 리스트를 순회하고 `<li>3</li>` 을 화면에서 제거한다.

반면에 아래와 같이 리스트에 `key` 값이 명시되어 있다면 리스트를 순회하지 않고 `<li key="#3">3</li>` 을 바로 찾아서 지우기 때문에 앱의 성능을 향상 시킬 수 있다.

```javascript
<ul>
  <li key="#1">1</li>
  <li key="#2">2</li>
  <li key="#3">3</li>
  <li key="#4">4</li>
<ul>
```

조금 더 깊게 들어가면, 위 코드에서 키에 값을 넣어줄 때 `#1` 과 같이 유니크한 값을 넣어줬다. 우리가 흔히 할 수 있는 실수로 `map` 의 `index` 값을 키 값으로 사용하는 것이다.

```javascript
function UserList({ users }) {
  return users.map((user, index) => <span key={index}>{user.name}</span>);
}
```

위와 같이 사용할 경우, 단순히 리스트를 출력하는데 문제는 없을 것이다. 다만 위 리스트를 삭제하거나 추가할 때 문제가 생긴다.

앞에 데이터가 추가된다면, `index` 가 `0` 으로 추가되고 곧 키의 값이 `0` 될 것이다.

여기서 리액트는 새로 추가된 `0` 의 요소를 이전에 있던 요소로 혼동을 하고, 이전 요소에 있던 데이터를 새로 추가된 요소에 데이터를 연결시킨다.

따라서, `map` 을 사용해 단순 리스트를 출력한다면 `index` 를 사용해도 문제는 없겠지만, 리스트를 업데이트해야 한다면 절대 `index` 를 사용하면 안되고, 고유한 값을 사용해야 한다.

> array.map ♥️ key

## 4. 비동기 상태 업데이트

setState 는 비동기로 동작합니다. 카운트 증가, 연속 클릭과 같이 상태를 변경할 땐 콜백 함수를 이용해 상태를 변경해야합니다.

```javascript
function App() {
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={handleIncrease}>+</button>
    </div>
  );
}
```

위 코드를 실행해서 (+) 버튼을 누르면 문제없이 동작한다. 하지만 아래와 같이 코드를 변경한다면 얘기가 달라진다.

```javascript
function App() {
  ...

  const handleIncrease = () => {
    setCount(count + 1);
    setCount(count + 1);
  };

  ...
}
```

(+) 버튼을 클릭할 때마가 2씩 증가할까?

답은 1씩 증가한다. 이유는 `setCount` 는 비동기로 동작하기 때문이다. 이전 값을 참조하여 특정 기능을 수행하야 한다면, 콜백으로 상태값을 변경해야 한다.

```javascript
function App() {
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    setCount((c) => c + 1);
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={handleIncrease}>+</button>
    </div>
  );
}
```

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
