import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/v1.0',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────
export const login = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);
export const activateAccount = (token) => API.get(`/activate?token=${token}`);

// ─── Dashboard ────────────────────────────────────────
export const getDashboard = () => API.get('/dashboard');

// ─── Expenses ─────────────────────────────────────────
export const getExpenses = () => API.get('/expenses');
export const addExpense = (data) => API.post('/expenses', data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const filterExpenses = (params) => API.get('/expenses/filter', { params });

// ─── Incomes ──────────────────────────────────────────
export const getIncomes = () => API.get('/incomes');
export const addIncome = (data) => API.post('/incomes', data);
export const deleteIncome = (id) => API.delete(`/incomes/${id}`);
export const filterIncomes = (params) => API.get('/incomes/filter', { params });

// ─── Categories ───────────────────────────────────────
export const getCategories = () => API.get('/categories');
export const getCategoriesByType = (type) => API.get(`/categories/${type}`);
export const saveCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);

export default API;
