import React, { useEffect, useState } from "react";
import { getMe } from "../backendApi";


export default function Popup(props) {
  const [user ,setUser] = useState({});
  
  useEffect(() => {
    getMe()
      .then((user) => {
        setUser(user);
      });
  }, []);
  return (
    <div className='popup'>
      <div className='popup_inner'>
        <p>{user.logged_in_useragent}</p>
        <p>{user.created_at}</p>
        <p>{user.login_count}</p>
        <button onClick={props.closePopup}>Close</button>
      </div>
    </div>
  );
}
