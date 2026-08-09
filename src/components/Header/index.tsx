import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';
import { Header, HeaderContent, Brand, Profile, ProfileText } from './styles';
import logoImg from '../../assets/nahora.png';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import Menu from '../Menu';
import Avatar from '../Avatar';

function HeaderMenu() {
  const { user } = useAuth();
  const history = useHistory();
  const currentEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  return (
    <Header>
      <HeaderContent>
        <Brand onClick={() => history.push(routes.adminDashboard)}>
          <img src={logoImg} alt="NaHora" />
          <div>
            <span>NaHora Admin</span>
            <strong>Painel da sua empresa</strong>
          </div>
        </Brand>

        {currentEnterprise?.name && (
          <Profile className="header-enterprise">
            <FiBriefcase />
            <ProfileText>
              <span>Empresa</span>
              <Link to={routes.enterpriseProfile}>{currentEnterprise.name}</Link>
            </ProfileText>
          </Profile>
        )}

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
