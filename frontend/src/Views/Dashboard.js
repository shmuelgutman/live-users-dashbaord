import React, { useEffect, useState } from "react";
import { getOnlineUsers, logout } from "../backendApi";
import Popup from "./Popup";

export default function(props){
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [popupState, setPopupState] = useState('close');
  const [popupUserId, setPopupUserId] = useState();
  
  useEffect(() => {
    const interval = setInterval(() => {
      getOnlineUsers()
        .then(({users}) => setOnlineUsers(users));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  function handleLogout(e){
    e.preventDefault();
    logout().then(() => props.setCurrentView('login'))
  }
  function openPopup(userId) {
    setPopupUserId(userId);
    setPopupState('open');
  }
  function closePopup() {
    setPopupUserId(null);
    setPopupState('close');
  }
  
  return (
    <div>
      <a href="/#" onClick={handleLogout}>Logout</a>
      <p>Hello {props.currentUser.username}</p>
      <table>
        <thead>
        <tr>
          <th>Username</th>
          <th>Login time</th>
          <th>Last update time</th>
          <th>User IP</th>
        </tr>
        </thead>
        <tbody>
        {onlineUsers.map(user => (
            <tr key={"user-" + user.id}>
              <td><a href="/#" onClick={(e) => {e.preventDefault(); openPopup(user.id)}}>{user.username}</a></td>
              <td>{user.logged_in_at}</td>
              <td>{user.updated_at}</td>
              <td>{user.logged_in_ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {popupState === 'open' && (
        <Popup userId={popupUserId} closePopup={closePopup}/>
      )}
    </div>
  );
}
