import axios from 'axios';

export const addUser = (newUser) => {
  return axios.post('/api/create/user', {newUser})
    .then(resp => resp.data);
};

export const fetchUserBalance = (userID) => {
  return axios.post('/api/user/balance', {userID})
    .then(resp => resp.data);
};

export const fetchEvents = () => {
  return axios.get('/api/events')
    .then(resp => resp.data);
};

export const addEvent = (newEvent) => {
  return axios.post('/api/create/event', {newEvent})
    .then(resp => resp.data);
};

export const depositToEvent = (payload) => {
  return axios.post('/api/deposit/event', {payload})
    .then(resp => resp.data);
};

export const withdrawFromEvent = (payload) => {
  return axios.post('/api/withdraw/event', {payload})
    .then(resp => resp.data);
};
