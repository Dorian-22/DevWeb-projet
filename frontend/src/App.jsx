import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "./components/button";
import RegisterForm from "./views/registerForm";
import LoginForm from "./views/loginForm";
import ArticleList from "./views/article";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  return (
    <>
      <div className="card">
        {!user && (
          <p>
            <LoginForm setUser={setUser} />
            <RegisterForm />
          </p>
        )}
        {user && (
          <>
            <p>Connected as {user.name}</p>
            <ArticleList />
          </>
        )}
      </div>
    </>
  );
}

export default App;