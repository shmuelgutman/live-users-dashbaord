import React, { useState } from "react";
import {register} from "../backendApi";

export default function FormRegister(props){
  const [registrationError, setRegistrationError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  function handleSubmit(e){
    e.preventDefault();
    register(username, password)
      .then(() => {
        props.setCurrentView('dashboard');
      })
      .catch((err) => {
        console.log(err);
        setRegistrationError(err.toString());
      })
  }
  return (
    <div>
      <p>Please register</p>
      <form onSubmit={handleSubmit}>
        {registrationError && <p>{registrationError}</p>}
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
      <a href="/#" onClick={(e) => {e.preventDefault(); props.setCurrentView('login')}}>Register</a>
    </div>
  );
}
