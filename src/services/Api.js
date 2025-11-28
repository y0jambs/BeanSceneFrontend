import axios from './axios';
import {headers, headers2, headers3} from '../util/header';
// const getFormData = payload => {
//   const formData = new FormData();
//   Object.keys(payload).forEach(key => {
//     if (Array.isArray(payload[key])) {
//       payload[key].forEach(item => {
//         formData.append(key, item);
//       });
//     } else {
//       formData.append(key, payload[key]);
//     }
//   });
//   return formData;
// };

//Category
export const getAllCategory = () => {
  headers();
  return axios.get('/category');
};
//Add Category
export const AddCategory = formData => {
  headers();
  return axios.post('/category/create', formData);
};
//delete Category
export const deleteCategory = id => {
  headers();
  return axios.delete(`/category/delete/${id}`);
};
//edit Category
export const editCategory = (id, formData) => {
  headers();
  return axios.put(`/category/update/${id}`, formData);
};
//login
export const login = payload => {
  headers();
  console.log('Payload', payload);
  return axios.post('/auth/login', payload);
};
export const addDish = payload => {
  headers2();
  console.log('Payload', payload);
  return axios.post('/dishes/create', payload);
};
export const getDish = () => {
  headers();
  return axios.get('/dishes');
};
export const deleteDish = id => {
  headers();
  return axios.delete(`/dishes/delete/${id}`);
};
export const editDish = (id, formData) => {
  console.log('formData', formData);
  headers2();
  return axios.put(`/dishes/update/${id}`, formData);
};
export const addUser = payload => {
  headers();
  return axios.post('/users/create', payload);
};
export const editUser = (id, payload) => {
  headers();
  return axios.put(`/users/update/${id}`, payload);
};
export const deleteUser = id => {
  headers();
  return axios.delete(`/users/delete/${id}`);
};
export const allUser = () => {
  headers();
  return axios.get('/users');
};
export const orderCheckout = payload => {
  headers();
  return axios.post('/orders/create', payload);
};
export const getAllOrder = () => {
  headers();
  return axios.get('/orders');
};
export const updateOrder = (id, payload) => {
  console.log('payload', payload);
  headers();
  return axios.put(`/orders/update/${id}`, payload);
};
export const deleteOrder = id => {
  headers();
  return axios.delete(`/orders/delete/${id}`);
};
