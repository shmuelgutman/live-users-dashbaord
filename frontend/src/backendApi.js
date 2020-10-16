import axios from 'axios';

const client = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json'
  }
});

function setAuthorizationHeader(token){
  client.defaults.headers['Authorization'] = 'Bearer ' + token
}
function clearAuthorizationHeader(){
  delete client.defaults.headers['Authorization'];
}
export const login = (username, password) => {
  
  return client.post('login', {username, password})
    .then(({data}) => {
      if(data.jwt){
        setAuthorizationHeader(data.jwt);
      }
      return data;
    })
    .catch((err) => err.response ? err.response.data : Promise.reject(err) );
  
};

export const register = (username, password) => {
  return client.post('register', {username, password})
    .then(({data}) => {
      if(data.jwt){
        setAuthorizationHeader(data.jwt);
      }
      return data;
    });
};

export const logout = () => {
  return client.post('logout')
    .then(() => clearAuthorizationHeader())
};

export const getMe = () => {
  return client.get('api/me').then(({data}) => data);
};

export const getOnlineUsers = () => {
  return client.get('api/users').then(({data}) => data);
};
