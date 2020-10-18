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
    <div className="max-w-3xl m-auto">
      <div className="bg-white flex justify-between items-center border-b-2 border-gray-200 p-6">
        <p className="text-md font-semibold">Hello {props.currentUser.username}</p>
        <p><button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
                   onClick={handleLogout}>Logout</button></p>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Username</th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Login time</th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Last update time</th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">User IP</th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {onlineUsers.map(user => (
            <tr key={"user-" + user.id} className="hover:bg-gray-100 hover:cursor-pointer"
            onClick={(e) => {e.preventDefault(); openPopup(user.id)}}>
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4">{user.logged_in_at}</td>
              <td className="px-6 py-4">{user.updated_at}</td>
              <td className="px-6 py-4">{user.logged_in_ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {popupState === 'open' && (
        <Popup userId={popupUserId} closePopup={closePopup}/>
      )}
    </div>
    </div>
  );
}
