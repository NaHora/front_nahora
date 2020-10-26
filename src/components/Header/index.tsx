import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Header, HeaderContent, Profile } from './styles';
import logoImg from '../../assets/nahora.png';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import Menu from '../Menu';
import Avatar from '../Avatar';

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
          <Avatar
            width={56}
            height={56}
            name={user.name}
            isPrivate={false}
            avatarUrl={user.avatar_url}
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
