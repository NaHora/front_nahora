import React from 'react';
import { FiHome, FiCheckCircle } from 'react-icons/fi';

import { Link, useHistory } from 'react-router-dom';
import { Header, HeaderContent, Profile } from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import Menu from '../Menu';

function HeaderMenu() {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <Header>
      <HeaderContent>
        <img src={logoImg} alt="GoBarber" />

        <Profile>
          <img
            src={
              user.avatar_url ||
              `https://api.adorable.io/avatars/285/${user.id}.png`
            }
            alt={user.name}
          />
          <div>
            <span>Bem-vindo,</span>
            <Link to={routes.profile}>
              <strong>{user.name}</strong>
            </Link>
          </div>
        </Profile>
        <button>
          {localStorage.getItem('@NaHora:myEnterprise') ? (
            <Menu />
          ) : history.location.pathname === routes.enterprise ? (
            <Link to={routes.schedule}>
              <FiCheckCircle />
              <span>Agendados</span>
            </Link>
          ) : (
            <Link to={routes.enterprise}>
              <FiHome />
              <span>Home</span>
            </Link>
          )}
        </button>
      </HeaderContent>
    </Header>
  );
}

export default HeaderMenu;
