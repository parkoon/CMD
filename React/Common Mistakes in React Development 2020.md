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

불필요한 렌더링을 막고 리액트 앱 성능을 개선할 수 있는 가장 간단한 방법은 아래 2가지다.

1. 불필요한 렌더링을 막기위해서는 업데이트가 필요없는 컴포넌트를 분리하여 React.memo 를 이용해 메모리에
   저장해둔다.
2. useState 를 무분별하게 사용하면 안된다.

아래 예시는 메세지를 입력할 수 있고, 사진을 랜덤으로 5000개 불러와서 렌더링하고 있다.

```javascript
function App() {
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      const photos = await (
        await fetch("https://jsonplaceholder.typicode.com/photos")
      ).json();
      setPhotos(photos);
    }

    fetchPhotos();
  }, []);

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      {photos.map(({ id, title, thumbnailUrl }) => (
        <div key={id}>
          <h2>{title}</h2>
          <img src={thumbnailUrl} alt={title} width="200" height="200" />
        </div>
      ))}
    </div>
  );
}
```

위 앱을 실행하고 메세지를 입력하려고 하는 순가 아무리 빠른 컴퓨터라도 버벅임을 느낄 수 있을 것이다.

`message` 를 입력 할 때 계속해서 `re-rendering` 이 발생하는데 이 때마다 5000개의 사진에도 `re-rendering` 이 발생해서 생기는 문제다.

우리는 이 문제를, `PhotoList` 컴포넌트로 분리시키고 해당 컴포넌트의 `props` 가 변경되었을 때만 렌더링되게 수정하고자 한다.
(예제 특성상 성능개선에 목적이 있기 때문에 `PhotoList` 컴포넌트를 세부적으로 나누진 않을 것이다.)

```javascript
function App() {

  ...

  return (
    <div>
      ...
      <PhotoList photos={photos} />
    </div>
  );
}
```

```javascript
const PhotoList = ({ photos = [] }) => {
  return photos.map(({ id, title, thumbnailUrl }) => (
    <div key={id}>
      <h2>{title}</h2>
      <img src={thumbnailUrl} alt={title} width="200" height="200" />
    </div>
  ));
};
```

우선 `PhotoList` 컴포넌트를 생성했다. 그리고 여기에 `React.memo` 만 감싸주면 끝난다.

```javascript
const PhotoList = React.memo(({ photos = [] }) => {
  return photos.map(({ id, title, thumbnailUrl }) => (
    <div key={id}>
      <h2>{title}</h2>
      <img src={thumbnailUrl} alt={title} width="200" height="200" />
    </div>
  ));
});
```

이게 실행해서 `message` 의 값을 변경해도 `PhotoList` 의 `props` 인 `photos` 변경이 없으므로 `PhotoList`의 `re-rendering`은 발생하지 않는다.

두 번째 예시는 (+) 버튼을 클릭 할 때마다 카운트를 증가시키고 SUBMIT 버튼을 통해 서버로 데이터를 보내고 있다.

```javascript
function App() {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    setCount((c) => c + 1);
  };

  const submitCount = () => {
    sendCountToServer(count);
  };

  return (
    <div>
      <button onClick={handleIncrease}>+</button>
      <button type="submit" onClick={submitCount}>
        SUBMIT
      </button>
    </div>
  );
}
```

동작에는 문제 없지만, 불필요하게 `state` 를 사용하고 있다. `state` 를 사용할 때

> 과연 이 값이 화면에 변화를 일으키는가?

를 확인해봐야 한다.

`count` 값은 화면을 변화시키는 것이 아닌, 변화된 값을 서버로 전송하는 일을 하고 있으므로 `state`로 처리하는 것은 적합하지 않고 불필요한 렌더링을 발생시키는 원인이 된다.

위 코드를 `useRef` 를 이용해 변경하면 불필요한 `state` 를 제거함으로써 렌더링을 최적화할 수 있다.

```javascript
function App() {
  const count = useRef(0);

  const handleIncrease = () => {
    count.current++;
  };

  const submitCount = () => {
    sendCountToServer(count.current);
  };

  return (
    <div>
      <button onClick={handleIncrease}>+</button>
      <button type="submit" onClick={submitCount}>
        SUBMIT
      </button>
    </div>
  );
}
```

### 6. useEffect를 사용해 액션 핸들링

우리는 `useEffect` 를 통해 데이터를 `watching` 하고 있다가, 값이 충족되면 함수를 호출과 같은 특정 행동을 취할 수 있다.

아래는 `onSuccess` 라는 콜백을 `useEffect` 를 통해 호출하는 예시를 보여주고 있다.

```javascript
function App({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState(null);

  const fetchPhotos = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((photos) => setPhotos(photos))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!loading && !error && data) {
      onSuccess();
    }
  }, [loading, error, data, onSuccess]);

  return <div>{JSON.stringify(data)}</div>;
}
```

`useEffect` 함수는 정~말 편리한 `hook` 임에는 틀림없다. 하지만 위와 같이 많은 데이터를 `watching` 하고 있다면, 당장 내일이라도 어떤 상황에서 `useEffect` 가 실행되길 바랬지? 라는 생각을 하게된다. (그래서 우리는 여러줄의 주석을 `useEffect` 위에 작성하곤 한다.)

코드 가독성 뿐만 아니라, 정상 호출에 대해 장담할 수 없다.

위 코드를 수정한다면, `useEffect` 를 지우고 API 호출 성공했을 때 `onSuccess` 를 호출해주면 끝난다.

```javascript
function App({ onSuccess }) {

  ...

  const fetchPhotos = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((photos) => {
        setPhotos(photos)
        onSuccess() // 추가된 코드
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  //  useEffect(() => {
  //     if (!loading && !error && data) {
  //       onSuccess();
  //     }
  //   }, [loading, error, data, onSuccess]);

  ...
}
```

### 7. 단일 책임 원칙을 준수한 컴포넌트

클린 코드를 공부해봤다면 `SOLID` 에 대해서 들어봤을 것이다.
여기서 `S` 인 `Single Responsibility Principle` 을 컴포넌트에 적용한 예이다.

```javascript
function Header({ something }) {
  return (
    <header>
      <HeaderInner something={something} />
    </header>
  );
}
```

아래 코드르 보기전에 `HeaderInner` 컴포넌트의 이름을 잠시 들여다보자. 조금만 더 들여다보자.

`HeaderInner` 라는 포장지 안에 어떤 선물이 들어있을지 아무도 모를 것이다.

코드에서 깜짝 서프라이즈는 개발자 수명에 매우 좋지 않다.

아마 `HeaderInner` 라는 명칭을 사용한 개발자는 아래를 점검했어야 했다.

> 컴포넌트가 두 가지 일을 한번에 하려고해서 네이밍이 힘들었던게 아닐까?

네이밍이 힘들다는 것은 컴포넌트를 분리해야 한다는 신호다.

이제 `HeaderInner` 를 공개한다.

```javascript
function HeaderInner() {
  return isMobile ? (
    <BurgerButton something={something} />
  ) : (
    <Tabs something={something} />
  );
}
```

`isMobile` 값을 이용해 모바일인지 확인하고 햄버거 버튼 또는 탭을 렌더링 하고 있었다.

아주 놀라운 선물이다. ~~7시 칼퇴 🔥~~

칼퇴하고 싶으면 `단일 책임 원칙`을 지켜서 컴포넌트를 만들도록 하자.

```javascript
function Header(props) {
  return (
    <header>
      {isMobile() ? (
        <BurgerButton menuItems={menuItems} />
      ) : (
        <Tabs tabData={menuItems} />
      )}
    </header>
  );
}
```

### 8. 단일 책임 원칙을 준수한 useEffect

위 6번에서 `useEffect` 훅을 조심히 잘 다뤄야 한다에 이어지는 내용일 수 있겠다.

단일 책임 원칙에 대해서는 7번에서 간단히 설명했으니 이해했을거라 생각한다.

아래 `useEffect`를 보자

```javascript
useEffect(() => {
  onCountChange(count);
  onUsernameChange(username);
}, [count, username]);
```

`count` 와 `username` 이 변경될 때마다 `useEffect` 가 실행될 것이다. 그리고 `onCountChange`, `onUsernameChange` 호출하여 변경된 데이터를 전달하고 있다.

긴말할 필요 없이 아래 처럼 당장 바꿔라.

```javascript
useEffect(() => {
  onCountChange(count);
}, [count]);

useEffect(() => {
  onUsernameChange(username);
}, [username]);
```

**TMI** 사실 예제를 만들려고 위와 같이 훅을 구성했지만, 하나의 컴포넌트에서 `username`, `count` 에 대한 훅이 2개가 있다면 단일 책임 원칙을 준수하지 못한 컴포넌트다.

숫자가 변경될 때 카운터가 실행되고, fetch 한다면, 훅을 따로써야지?

### 9. 잘못된 HOC 의 사용

아래는 동작에는 문제 없지만, 컴포넌트 트리를 해치는 `hoc` 를 보여주고 있다.

```javascript
function App() {
  const ComponentAWithFoo = withFoo(ComponentA);
  return <ComponentAWithFoo />;
}

function withFoo(Component) {
  return class Wrapper extends React.Component {
    render() {
      return <Component foo="bar" {...this.props} />;
    }
  };
}

const ComponentA = ({ foo }) => {
  return <div>I'm Component A with {foo}</div>;
};
```

코드에는 문제 없지만, **React devTool** 을 설치하고 **Components** 탭을 들어가서 `HOC` 가 적용된 `ComponentA` 이름을 확인해보면 `ComponentA` 만 출력되고 있어 해당 컴포넌트가 `HOC` 가 적용되었는지 알 수 없다.

따라서, 제대로된 이름을 출력하기 위해서는 `hoc` 두번째 인자로 컴포넌트 이름을 보내줄 수 있지만, 아래 라이브러리를 추천한다.

```
npm i recompose
```

위에서 설치한 라이브러리를 이용해 위 코드를 변경하면 다음과 같다.

```javascript
import React from "react";
import getDisplayName from "recompose/getDisplayName";

function App() {
  const ComponentAWithFoo = withFoo(ComponentA);
  return <ComponentAWithFoo />;
}

function withFoo(Component) {
  Component.displayName = `withFoo_${getDisplayName(Component)}`;

  return class Wrapper extends React.Component {
    render() {
      return <Component foo="bar" {...this.props} />;
    }
  };
}

const ComponentA = ({ foo }) => {
  return <div>I'm Component A with {foo}</div>;
};
```

### 10. router.push 를 이용한 라우팅 이동
