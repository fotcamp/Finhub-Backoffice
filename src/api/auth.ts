import {
  getLocalStorageItem,
  getStorageItem,
  removeLocalStorageItem,
  removeStorageItem,
  setLocalStorageItem,
  setStorageItem,
} from '../utils/storage';
import { ApiResposne, client } from './client';

const login = async (email: string, password: string) => {
  const response: ApiResposne = await client.post('/admin/login', {
    email,
    password,
  });

  setStorageItem('accessToken', response.data.accessToken ?? '');
  setLocalStorageItem('refreshToken', response.data.refreshToken ?? '');
};

const verifyToken = async () => {
  const response: ApiResposne = await client.post('/auth/autoLogin', {
    accessToken: getStorageItem('accessToken'),
    refreshToken: getLocalStorageItem('refreshToken'),
  });

  return response.status === 'SUCCESS';
};

const logout = () => {
  removeStorageItem('accessToken');
  removeLocalStorageItem('refreshToken');
};

export const authAPI = {
  login,
  verifyToken,
  logout,
};
