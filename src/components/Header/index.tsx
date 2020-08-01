import React from 'react';
import { FiPower } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import { Header, HeaderContent, Profile } from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

function HeaderMenu() {
  const { signOut, user } = useAuth();

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

        <button onClick={signOut} type="button">
          <FiPower />
        </button>
      </HeaderContent>
    </Header>
  );
}

export default HeaderMenu;
