import API from '../services/axios';

export const headers = () => {
  return API.defaults.headers;
};
export const headers3 = () => {
  return (API.defaults.headers.common['Content-Type'] = 'application/json');
};
export const headers2 = () => {
  return (API.defaults.headers.post['Content-Type'] = 'multipart/form-data');
};
