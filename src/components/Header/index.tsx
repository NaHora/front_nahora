import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Header, HeaderContent, Profile } from './styles';
import logoImg from '../../assets/nahora.png';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import Menu from '../Menu';

function HeaderMenu() {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <Header>
      <HeaderContent>
        <img
          onClick={() => history.push(routes.enterprise)}
          src={logoImg}
          alt="NaHora"
        />

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
          <Menu />
        </button>
      </HeaderContent>
    </Header>
  );
}

export default HeaderMenu;
