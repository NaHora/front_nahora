import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';
import { Header, HeaderContent, Brand, Profile, ProfileText } from './styles';
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
        <Brand onClick={() => history.push(routes.enterprise)}>
          <img src={logoImg} alt="NaHora" />
          <div>
            <span>NaHora Admin</span>
            <strong>Operacao, agenda e crescimento</strong>
          </div>
        </Brand>

        <Profile>
          <FiCompass />
          <ProfileText>
            <span>Area ativa</span>
            <Link to={routes.enterprise}>Empresas</Link>
          </ProfileText>
        </Profile>

        <Profile>
          <Avatar
            width={54}
            height={54}
            name={user.name}
            isPrivate={false}
            avatarUrl={user.avatar_url}
          />
          <ProfileText>
            <span>Bem-vindo</span>
            <Link to={routes.profile}>{user.name}</Link>
          </ProfileText>
        </Profile>

        <Menu />
      </HeaderContent>
    </Header>
  );
}

export default HeaderMenu;
