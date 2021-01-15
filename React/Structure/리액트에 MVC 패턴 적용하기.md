# 리액트에 Model View Controller 패턴 적용하기

`MVC` 에 대해 잘 정리되어 있는 블로그 및 [유튜브](https://www.youtube.com/watch?v=AERY1ZGoYc8&t=214s) 가 있으니 참고하도록 하자.

바로 리팩토링으로 들어간다.

## 리펙토링이 필요한 코드

현재 아래코드는 `view` 와 `controller` 함께 작성되어 있다.
아래 두 가지를 생각하면서 **View Component** 와 **Controller Component** 를 분리합시다.

> 컨트롤러는 어떻게 데이터를 조작하는지, 어디에서 조작할 수 있는지 등의 모든 것들을 알고 있다.

> 뷰는 어플리케이션의 상태, 네트워크 프로토콜 등 아무것도 모르고 있습니다. 데이터 통신을 할 수 없다.

_뷰는 `local state` 를 가질 수 있습니다. 단, 컴포넌트의 UI 컨트롤만 할 수 있다._

```javascript
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

### 1. 뷰와 컨트롤러 나누기

나누는 과정에서 몇가지 난관에 봉착한다.

1. 에러와 로딩에 관련된 상태를 뷰로 모두 넘기고, 컨트롤러에서 API 를 호출해서 결과에 따라 state 를 처리해야하는데 할 수 없게 되었다.

(1)의 경우, `save` 함수를 `Promise` 를 리턴하도록 변경하고 뷰로 넘겨줘서 처리 할 수 있다.

**Controller**

컨트롤러 네이밍은 뒤에 `Controller` 를 붙여줍니다.

```javascript
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
```

**View**

```javascript
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

1. `<EditUserForm />` 컴포넌트는 이제 네트워크나 `provider/context` 설정 없이도 단위 테스트가 가능해졌다.
2. UI 와 관련되어 있는 상태값들은 모두 `<EditUserForm />` 컴포넌트로 이동했다. `<EditUserForm />` 는 `initialUser` 와 `onSave` 콜백만 전달 받는다.

### 3. 컨트롤러 변형시켜 재활용성 증가시키기

```javascript
function App() {
  const something = {};
  return (
    <EditUserController id={1}>
      <CustomerForm something={something} />
    </EditUserController>
  );
}

function EditUserController({ id, children }) {
  // ... 이전 코드와 동일

  return React.cloneElement(children, {
    initialUser: user,
    onSave: save,
  });
}
```

컨트롤러를 위와 같이 변경을 하면

1. 컨트롤러는 뷰로부터 완전 해방이다. 그리고 `initialUser` 와 `onSave` 를 필요로 하는 컴포넌트와 함께 할 수 있게 되었다.
2. 뷰는 더 많은 `props` 를 전달 받을 수 있다. (컨트롤러에게는 비밀)

### 도메인 로직 분리하기

> 리액트 컴포넌트가 도메인 로직을 들고 있을 필요가 있을까?

I believe...🎶

우리 데이터는요 `fetch` 를 이용해서 처리되고 있어요.

우리 백엔드에서는요 `JSON` 형태의 데이터를 받고 있어요.

우리 백엔드는 이상하게도 스네이크 케이스로 데이터를 주고 있어요.

우리 백엔드는요 사용자를 변경할 때 "name" 과 "email" 을 요구해요.

## _알 필요 없다! 분리하자_

```javascript
function EditCustomerController(props) {
  // ...

  let save = async (newUser) => {
    let latestUser = await performUserUpdate(props.id, newUser);
    dispatch({
      type: "UPDATE_USER",
      payload: formatChangeForFrontend(user),
    });

    // ...
  };
}

async function performUserUpdate(id, newUser) {
  let res = await fetch({
    url: `/api/user/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  let apiUser = await response.json();
  return formatChangeForFronted(apiUser);
}
```

우리는 도메인 로직을 컴포넌트로부터 분리시켰다. 단순히 `performUserUpdate` 만 한다면 함수로 작성해도 되지만, 더 많은 작업을 한다면 클래스를 이용하는게 효율적이다.

```javascript
function EditCustomerController(props) {
  // ...

  let save = async (newUser) => {
    let gateway = new UserGateway();
    let latestUser = await gateway.update(props.id, newUser);
    dispatch({
      type: "UPDATE_USER",
      payload: formatChangeForFrontend(user),
    });

    // ...
  };
}

class UserGateway {
  constructor(fetchFn = fetch) {
    this.fetch = fetchFn;
  }

  async update() {
    await this.fetch({
      url: `/api/user/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    let formattedData = this.formatChangeForFronted(await response.json());

    // do more things ...
    return formattedData;
  }

  formatChangeForFronted(apiData) {
    // return transform data from snake_case to camelCase
  }
}
```

마지막으로 우리는 컨트롤러에 클래스를 주입해 줄 수 있다.
의존성 주입을 사용하게되면, 객체간의 결합도를 줄이고 유연한 코드를 작성 할 수 있다.
다시 말해, **한 클래스를 수정했을 때, 다른 클래스도 수정해야 하는 상황**을 방지할 수 있다.

```javascript
function EditCustomerController({ Gateway = UserGateway, ...props }) {
  // ...

  let save = async (newUser) => {
    let gateway = new UserGateway();
    let latestUser = await gateway.update(props.id, newUser);
    dispatch({
      type: "UPDATE_USER",
      payload: formatChangeForFrontend(user),
    });

    // ...
  };
}
```

## 참고

- [A Model View Controller Pattern for React](https://blog.testdouble.com/posts/2019-11-04-react-mvc)
