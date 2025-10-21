import axios from 'axios';

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost/api/picnode';
  }
  return 'https://a2insights.com.br/api/picnode';
};

const apiService = axios.create({
  baseURL: getBaseUrl(),
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('picnode_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (userData: any) => {
  try {
    const response = await apiService.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await apiService.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiService.delete('/logout');
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const updateProfile = async (userData: any) => {
  try {
    const response = await apiService.put('/user/profile-information', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async () => {
  try {
    const response = await apiService.post('/user/email-verification');
    return response.data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await apiService.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default apiService;
