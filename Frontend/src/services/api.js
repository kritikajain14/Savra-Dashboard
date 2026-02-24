import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOverview = async (period = 'week') => {
  const response = await api.get(`/overview?period=${period}`);
  return response.data;
};

export const getAllTeachers = async () => {
  const response = await api.get('/teachers');
  return response.data;
};

export const getTeacherData = async (teacherId, period = 'week') => {
  const response = await api.get(`/teacher/${teacherId}`, {
    params: { period }
  });
  return response.data;
};
export const getTrends = async (teacherId = null, period = 'week') => {
  const params = new URLSearchParams();
  if (teacherId) params.append('teacher_id', teacherId);
  params.append('period', period);
  const response = await api.get(`/trends?${params.toString()}`);
  return response.data;
};

export const getTeacherDistribution = async (period = 'week') => {
  const response = await api.get(`/teacher-distribution?period=${period}`);
  return response.data;
};

export const getSubjectDistribution = async () => {
  const response = await api.get('/subject-distribution');
  return response.data;
};

export const getMonthlyGrowth = async () => {
  const response = await api.get('/monthly-growth');
  return response.data;
};

export default api;