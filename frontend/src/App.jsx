import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "./components/Button";
import RegisterForm from "./views/security/register-form";
import LoginForm from "./views/security/login-form";

function App() {
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");
  let userDecoded = null;
  if (token) {
    const [, payloadEncoded] = token.split(".");
    userDecoded = JSON.parse(atob(payloadEncoded));
  }
  const [user, setUser] = useState(userDecoded);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <>
      <div className="card">
        <p>
          {user === null && (
            <>
              <h2>Register</h2>
              <RegisterForm />
              <h2>Login</h2>
              <LoginForm setUser={setUser} />
            </>
          )}
          {user && (
            <>
              <h2>Connected as {user.user_id}</h2>
              <Button
                variant="delete"
                title="se déconnecter"
                onClick={handleLogout}
              />
              <CategoryList />
            </>
          )}
        </p>
      </div>
    </>
  );
}

export default App;