import { useState } from "react";

function useUser() {
  const users = [];
  const dispatch = () => {};

  return { users, dispatch };
}

function NotFound() {
  return <span>Not Found</span>;
}

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
        setErrors(error);
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
