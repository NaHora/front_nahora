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
    const token = localStorage.getItem('@NaHora:token');
    const user = localStorage.getItem('@NaHora:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@NaHora:token', token);
    localStorage.setItem('@NaHora:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
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

      const { token, user } = response.data;

      localStorage.setItem('@NaHora:token', token);
      localStorage.setItem('@NaHora:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user });

      if (!user.celphone) {
        return history.push(routes.profile);
      }
      return history.push(routes.enterprise);
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@NaHora:token');
    localStorage.removeItem('@NaHora:user');
    localStorage.removeItem('@NaHora:myEnterprise');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@NaHora:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
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
