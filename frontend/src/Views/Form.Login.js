import React, {useState} from 'react';
import { login } from "../backendApi";

export default function FormLogin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  function handleSubmit(event){
    event.preventDefault();
    login(username, password)
      .then(res => {
        if(res.code){
          return setLoginError(res.message);
        }
        props.setCurrentView('dashboard');
      })
      .catch(err => {
        setLoginError("Network Error: " + err.toString());
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {loginError && <p>{loginError}</p>}
        <p>
          <label htmlFor="username">Username</label><br/>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </p>
        <p>
          <label htmlFor="password">Password</label><br/>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </p>
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
      <a href="/#" onClick={(e) => {e.preventDefault(); props.setCurrentView('register')}}>Register</a>
    </div>
  );
}
