import React, {useState} from 'react';
import { login } from "../backendApi";

export default function FormLogin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  function handleSubmit(event){
    event.preventDefault();
    setLoginError("");
    login(username, password)
      .then(res => {
        if(typeof res === 'string'){
          return setLoginError(res);
        }
        if(res.code){
          return setLoginError(res.message);
        }
        // Success login
        props.setCurrentView('dashboard');
      })
      .catch(err => {
        setLoginError("Network Error: " + err.toString());
      });
  }

  return (
    <div className="max-w-md m-auto p-6 rounded-lg shadow-xl bg-white">
      <h3 className="text-lg font-semibold">Login</h3>
      <form onSubmit={handleSubmit}>
        {loginError &&
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{loginError}</span>
        </div>}
        <p className="mt-6">
          <label className="block" htmlFor="username">Username</label>
          <input name="username" id="username" type="text" value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded focus:outline-none focus:shadow-outline-blue sm:text-sm sm:leading-5"
                 />
        </p>
        <p className="mt-6">
          <label className="block" htmlFor="password">Password</label>
          <input name="password" id="password" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded focus:outline-none focus:shadow-outline-blue sm:text-sm sm:leading-5"
          />
        </p>
        <p className="mt-6">
          <button type="submit"
                  className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600">
            Login
          </button>
        </p>
      </form>
      
      <div className="mt-6">
        <button type="button"
                onClick={(e) => {e.preventDefault(); props.setCurrentView('register')}}
                className="relative w-full flex justify-center py-2 px-4 border border-color-indigo text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white">
          Register
        </button>
      </div>
      </div>
  );
}
