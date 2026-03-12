import axios, { AxiosError, AxiosInstance } from 'axios';

const signOut = () => {
  localStorage.removeItem('@NaHora:refresh_token');
  localStorage.removeItem('@NaHora:token');
  localStorage.removeItem('@NaHora:user');
  localStorage.removeItem('@NaHora:myEnterprise');
  return window.location.reload();
};

let isRefreshing = false;
let failedRequestQueue = [] as Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}>;

function setupAPIClient(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
      authorization: `Bearer ${localStorage.getItem('@NaHora:token')}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      const responseData = error.response?.data as
        | { message?: string }
        | undefined;

      if (error.response?.status === 401) {
        if (responseData?.message === 'Token expirou, refaça o login.') {
          const refreshToken = localStorage.getItem('@NaHora:refresh_token');

          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('/sessions/refresh-token', {
                current_refresh_token: refreshToken,
              })
              .then((response) => {
                const { token, refresh_token } = response.data;

                localStorage.setItem('@NaHora:refresh_token', refresh_token);
                localStorage.setItem('@NaHora:token', token);

                api.defaults.headers.authorization = `Bearer ${token}`;

                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token),
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) =>
                  request?.onFailure(err),
                );
                failedRequestQueue = [];

                signOut();
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                if (originalConfig?.headers) {
                  originalConfig.headers.authorization = `Bearer ${token}`;
                }

                resolve(api(originalConfig || {}));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }

        signOut();
      }

      return Promise.reject(error);
    },
  );

  return api;
}

const api = setupAPIClient();
export default api;
