import React, {useState, useEffect} from 'react';
import './App.css';
import { getMe } from "./backendApi";
import FormLogin from "./Views/Form.Login";
import FormRegister from "./Views/Form.Register"
import Dashboard from "./Views/Dashboard";

function App() {
  
  const [currentUser, setCurrentUser] = useState({});
  const [currentView, setCurrentView] = useState("login");

  useEffect(() => {
    if(currentView === 'dashboard') {
      getMe().then((user) => {
        setCurrentUser(user);
        setCurrentView('dashboard')
      })
        .catch(err => {
          setCurrentUser({});
          setCurrentView('login')
        });
    }
  }, [currentUser.id, currentView]);
  return (
    <div className="App">
      {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} currentUser={currentUser}/>}
      {currentView === 'login' && <FormLogin setCurrentView={setCurrentView}/>}
      {currentView === 'register' && <FormRegister setCurrentView={setCurrentView}/>}
    </div>
  );
}

export default App;
