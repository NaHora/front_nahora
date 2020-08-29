import axios from 'axios';
import { isAfter } from 'date-fns';
import jwt from 'jsonwebtoken';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

export async function getNewRefreshToken() {
  const userToken = localStorage.getItem('@NaHora:token') as any;

  const tokenExpiration = jwt.decode(userToken) as { exp: any };

  if (isAfter(new Date(), new Date(tokenExpiration?.exp * 1000))) {
    try {
      localStorage.removeItem('@NaHora:token');
      localStorage.removeItem('@NaHora:user');
      localStorage.removeItem('@NaHora:myEnterprise');
    } catch (err) {}
  }
}

function observeToken(instance: any) {
  instance.interceptors.response.use(
    (response: Response) => {
      return response;
    },
    (error: any) => {
      if (error.response.status === 401) {
        return getNewRefreshToken();
      }
      return Promise.reject(error);
    },
  );
}

observeToken(api);

export default api;
