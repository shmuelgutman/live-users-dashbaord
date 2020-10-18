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
    <div className="max-w-md m-auto p-6 rounded-lg shadow-xl bg-white">
      <h3 className="text-lg font-semibold">Please register</h3>
      <form onSubmit={handleSubmit}>
        {registrationError &&
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{{registrationError}}</span>
        </div>}
        <p className="mt-6">
          <label htmlFor="username">Username</label><br/>
          <input id="username" type="text" value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded focus:outline-none focus:shadow-outline-blue sm:text-sm sm:leading-5"
          />
        </p>
        <p className="mt-6">
          <label htmlFor="password">Password</label><br/>
          <input id="password" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded focus:outline-none focus:shadow-outline-blue sm:text-sm sm:leading-5"
          />
        </p>
        <p className="mt-6">
          <button type="submit"
                  className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600">
            Register
          </button>
        </p>
      </form>
      <p className="mt-6">
      <button type="button"
              onClick={(e) => {e.preventDefault(); props.setCurrentView('login')}}
              className="relative w-full flex justify-center py-2 px-4 border border-color-indigo text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white">
        Login
      </button>
      </p>
    </div>
  );
}
