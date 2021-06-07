import React, { createContext, useCallback, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { routes } from '../routes';

interface User {
  id: string;
  name: string;
  celphone: string;
  isPrivate: boolean;
  email: string;
  avatar_url: string;
  gender: string;
}

interface AuthState {
  token: string;
  refresh_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInCredentialsSocial {
  email: string;
  password: string;
  name: string;
  celphone?: string;
  photoUrl?: string;
  gender?: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signInSocial(credentials: SignInCredentialsSocial): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem('@NaHora:refresh_token');
    const token = localStorage.getItem('@NaHora:token');
    const user = localStorage.getItem('@NaHora:user');

    if (token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user), refresh_token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user, refresh_token } = response.data;

    localStorage.setItem('@NaHora:refresh_token', refresh_token);
    localStorage.setItem('@NaHora:token', token);
    localStorage.setItem('@NaHora:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user, refresh_token });
  }, []);

  const signInSocial = useCallback(
    async ({ name, email, password, celphone, photoUrl, gender }) => {
      const response = await api.post('users/social', {
        name,
        email,
        password,
        celphone,
        photoUrl,
        gender,
      });

      const { token, user, refresh_token } = response.data;

      localStorage.setItem('@NaHora:refresh_token', refresh_token);
      localStorage.setItem('@NaHora:token', token);
      localStorage.setItem('@NaHora:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user, refresh_token });

      if (!user.celphone) {
        return history.push(routes.profile);
      }
      return history.push(routes.enterprise);
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@NaHora:refresh_token');
    localStorage.removeItem('@NaHora:token');
    localStorage.removeItem('@NaHora:user');
    localStorage.removeItem('@NaHora:myEnterprise');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@NaHora:user', JSON.stringify(user));

      setData({
        ...data,
        user,
      });
    },
    [setData, data],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, signInSocial }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
