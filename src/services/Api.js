// src/services/Api.js

import axios from './axios';
import {headers, headers2, headers3} from '../util/header';

// -------------- CATEGORY -----------------

// GET /api/category
export const getAllCategory = () => {
  headers();
  return axios.get('/category');
};

// POST /api/category/create
export const AddCategory = formData => {
  headers();
  return axios.post('/category/create', formData);
};

// DELETE /api/category/delete/:id
export const deleteCategory = id => {
  headers();
  return axios.delete(`/category/delete/${id}`);
};

// PUT /api/category/update/:id
export const editCategory = (id, formData) => {
  headers();
  return axios.put(`/category/update/${id}`, formData);
};

// -------------- AUTH -----------------

// POST /api/auth/login
export const login = payload => {
  headers();
  console.log('Payload', payload);
  return axios.post('/auth/login', payload);
};

// -------------- DISHES -----------------

// POST /api/dishes/create
export const addDish = payload => {
  headers2();
  console.log('Payload', payload);
  return axios.post('/dishes/create', payload);
};

// GET /api/dishes
export const getDish = () => {
  headers();
  return axios.get('/dishes');
};

// DELETE /api/dishes/delete/:id
export const deleteDish = id => {
  headers();
  return axios.delete(`/dishes/delete/${id}`);
};

// PUT /api/dishes/update/:id
export const editDish = (id, formData) => {
  console.log('formData', formData);
  headers2();
  return axios.put(`/dishes/update/${id}`, formData);
};

// -------------- USERS (STAFF) -----------------

// POST /api/users/create
export const addUser = payload => {
  headers();
  return axios.post('/users/create', payload);
};

// PUT /api/users/update/:id
export const editUser = (id, payload) => {
  headers();
  return axios.put(`/users/update/${id}`, payload);
};

// DELETE /api/users/delete/:id
export const deleteUser = id => {
  headers();
  return axios.delete(`/users/delete/${id}`);
};

// GET /api/users
export const allUser = () => {
  headers();
  return axios.get('/users');
};

// -------------- ORDERS -----------------

// POST /api/orders/create
export const orderCheckout = payload => {
  headers();
  return axios.post('/orders/create', payload);
};

// GET /api/orders
export const getOrders = () => {
  headers();
  return axios.get('/orders');
};

// PUT /api/orders/update/:id
// payload is typically { status, order } (order is JSON string)
export const updateOrder = (id, payload) => {
  console.log('updateOrder payload', payload);
  headers();
  return axios.put(`/orders/update/${id}`, payload);
};

// DELETE /api/orders/delete/:id
export const deleteOrder = id => {
  headers();
  return axios.delete(`/orders/delete/${id}`);
};
