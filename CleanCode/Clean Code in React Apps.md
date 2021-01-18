# Clean Code in React Apps

어떻게하면 리액트에서 클린한 코드를 작성할 수 있는지 공유하고자 한다.

클린 코드엔 특별한 정답이 없으며, 실무경험 + 여러 블로그 포스트를 참고했다.

## 1. Props 를 구조분해해서 사용하자.

구조분해를하면 해당 컴포넌트가 어떤 동작을 하는지 쉽게 이해할 수 있다. 무엇보다 코드가 깔끔해진다.

```javascript
// BAD 💩
const Component = (props) => {
  return (
    <div style={props.wrapperStyle}>
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      <button onClick={props.someAction}>ADD</button>
    </div>
  );
};

// GOOD 🙂
const Component = ({ title, description, someAction, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={someAction}>ACTION</button>
    </div>
  );
};
```

## 2. 가능한 Props 를 전달하는 숫자를 줄이자.

우선, 너무 많은 `props` 를 컴포넌트에 전달하고 있다면, 컴포넌트가 너무 많은 책임을 갖고 있지 않나 점검해야 하고 컴포넌트를 분리해야할 시기다.

최소한의 `props` 로 판단된다면, 전달하는 `props` 를 구조화 할 필요가 있다.

```javascript
// BAD 💩
<Receipt
    productId={1}
    title="Lorem product"
    discountPrice={5000}
    originPrice={10000}
    totalPrice={5000}
    onSubmit={handleSubmit}
    onCancel={handleCancel}
/>

// GOOD 🙂
// product = { id: 1, title: "Lorem product"}
// price = { discount: 5000, origin: 10000, total: 5000 }
// action = { onSubmit: handleSubmit, onCancel: handleCancel }
<Receipt
  product={product}
  price={price}
  action={action}
/>
```

> **TIP❕** 객체를 컴포넌트에 직접 할당하면 불필요한 렌더링이 발생한다. 변수로 설정해놓고 컴포넌트에 주입해야 한다.

## 3. 관리에 용이하고 확장 가능한 컴포넌트 폴더 구조를 가져가자.

기능이 동일한 컴포넌트를 폴더로 묶는다, 아래 _BAD_ 케이스의 경우, `Typography` 와 `Text` 가 동일한 기능임에도 묶여있지 않다. 추 후, `Title` 이라는 컴포넌트를 추가해야 한다면, `components` 의 폴더는 더러워 질 것이다.

_BAD 💩_

- src
  - components
    - Typography.tsx
    - Text.tsx
    - Input
      - index.ts
      - Input.tsx
      - styles.ts
      - helper.ts
    - Card
      - index.ts
      - Card.tsx
      - CardHeader.tsx

_GOOD 🙂_

- src
  - components
    - Typography
      - index.ts
      - Text.tsx
    - Input
      - index.ts
      - Input.tsx
      - styles.ts
      - helper.ts
    - Card
      - index.ts
      - Card.tsx
      - CardHeader.tsx

그리고 폴더의 `entry point` 를 `index.tx` 로 처리함으로써 아래와 같이 불필요한 코딩을 방지한다.

```javascript
import Input from "../components/Input/Input";
```

실무에서 개발하보면 제일 많인 괴롭히는 폴더가 `components` 폴더이며, 프로젝트 시작할 때 신중하게 설계해서 팀원들과 공유해야한다. 이 시간을 절대 아까워해서는 안된다.

실무에서 사용했던 컴포넌트 폴더 구조를 공유하면 아래와 같다. (절대 정답은 아니며 더 나은 구조가 있을 수 있다.)

- src

  - components

    - login
      - LoginBanner
        - index.ts
        - HomeBanner.tsx
        - HomeBannerImage.tsx
        - styles.ts
        - helper.ts
        - types.ts
    - profile
      - ProfileCard
        - index.ts
        - ProfileCard.tsx
        - helper.ts
        - types.ts
    - shared
      - Typography
        - index.ts
        - Text.tsx
        - styles.ts
      - Input
        - index.ts
        - Input.tsx
        - styles.ts
        - helper.ts

`page` 는 소문자로 표현했고, 각 페이지에서만 사용하는 컴포넌트를 그 폴더에 정리했다. 그리고 모든 페이지에서 공통으로 사용하는 컴포넌트는 `shared` 에 정리했다. `shared` 에 들어가는 컴포넌트들을 모두 `atomic` 한 컴포넌트들이었다.

## 4. View 와 Controller 를 구분합니다.

화면에 **보여지는 것**과 화면에 보여지기 위해 필요한 **서비스 로직**을 분리합니다. 이는 가독성 뿐 아니라 테스트 가능한 컴포넌트를 작성하는데 도움이 됩니다. `Container` & `Presentation` 패턴이랑 비교했을 때 `Container` 는 `Controller` 와 `Presentation` 은 `View` 와 연결될 수 있습니다.

```javascript
// BAD 💩
function App() {
  return <EditUser id={1} />;
}

function EditUser({ id }) {
  let { users, dispatch } = useUser();

  let user = users.find((u) => u.id === id);
  if (!user) {
    return <NotFound />;
  }

  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const save = () => {
    setLoading(true);
    fetch({
      url: `/api/user/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => res.json())
      .then((user) =>
        dispatch({
          type: "UPDATE_USER",
          payload: formatChangeForFrontend(user),
        })
      )
      .catch((err) => {
        setErrors(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {errors && <Error errors={errors} />}
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={save} disabled={loading}>
        Save
      </button>
    </div>
  );
}
```

```javascript
// GOOD 🙂
function App() {
  return <EditUserController id={1} />;
}

function EditUserController({ id }) {
  let { users, dispatch } = useUser();

  let user = users.find((u) => u.id === id);
  if (!user) {
    return <NotFound />;
  }

  const save = (newUser) => {
    return fetch({
      url: `/api/user/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((user) =>
        dispatch({
          type: "UPDATE_USER",
          payload: formatChangeForFrontend(user),
        })
      );
  };

  return <EditUserForm onSave={save} initialUser={user} />;
}

function EditUserForm({ initialUser, onSave }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState();
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);

  const onSaveWrapped = () => {
    setLoading(true);
    onSave({ name, email })
      .catch((err) => setErrors(err))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {errors && <Error errors={errors} />}
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={onSaveWrapped} disabled={loading}>
        Save
      </button>
    </div>
  );
}
```

서비스 로직을 담당하는 `EditUserController` 와 화면을 담당하는 `EditUserForm` 로 구분했습니다. `EditUserForm` 에서 `state` 사용할 수 있지만 UI 와 관련된 `state` 이외엔 사용하지 않습니다.
