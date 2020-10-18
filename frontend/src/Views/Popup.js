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
      <div className='popup_inner inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all p-6'>

        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm leading-5 font-medium text-gray-600">
              Useragent
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {user.logged_in_useragent}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm leading-5 font-medium text-gray-600">
              Created At
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {user.created_at}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm leading-5 font-medium text-gray-600">
              Login Count
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {user.login_count}
            </dd>
          </div>
        </dl>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <button onClick={props.closePopup} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500">
              Cancel
            </button>
      </span>
    </div>
      </div>
    </div>
  );
}
