import React from 'react';
import {
  FiActivity,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiEdit3,
  FiGrid,
  FiUsers,
} from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import HeaderMenu from '../Header';
import { routes } from '../../routes';
import {
  Container,
  Hero,
  HeroContent,
  Eyebrow,
  Title,
  Description,
  Actions,
  Main,
  WorkspaceNav,
  WorkspaceTab,
} from './styles';

interface AdminShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

const AdminShell: React.FC<AdminShellProps> = ({
  title,
  description,
  eyebrow,
  actions,
  children,
}) => {
  const history = useHistory();
  const currentPath = history.location.pathname;
  const currentEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const workspaceTabs = [
    {
      key: 'admin-dashboard',
      label: 'Painel',
      route: routes.adminDashboard,
      icon: FiGrid,
    },
    {
      key: 'admin-clients',
      label: 'Clientes',
      route: routes.adminClients,
      icon: FiUsers,
    },
    { key: 'plans', label: 'Planos', route: routes.plan, icon: FiCreditCard },
    {
      key: 'schedule',
      label: 'Horários',
      route: routes.enterpriseSchedule,
      icon: FiCalendar,
    },
    {
      key: 'training',
      label: 'Treino do dia',
      route: routes.training,
      icon: FiEdit3,
    },
    {
      key: 'financial',
      label: 'Financeiro',
      route: routes.financial,
      icon: FiActivity,
    },
    { key: 'alert', label: 'Comunicados', route: routes.alert, icon: FiBell },
    {
      key: 'profile',
      label: 'Perfil da empresa',
      route: routes.enterpriseProfile,
      icon: FiBriefcase,
    },
  ];

  const legacyRoutes = [
    routes.dashboard,
    routes.customers,
    routes.enterprise,
    routes.clientDetailNoParams,
  ];

  const showWorkspaceTabs =
    !!currentEnterprise?.id &&
    (workspaceTabs.some((tab) => currentPath.startsWith(tab.route)) ||
      legacyRoutes.some((route) => currentPath.startsWith(route)));

  return (
    <Container>
      <HeaderMenu />
      <Hero>
        <HeroContent>
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
          </div>
          {actions && <Actions>{actions}</Actions>}
        </HeroContent>
        {showWorkspaceTabs && (
          <WorkspaceNav>
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                currentPath.startsWith(tab.route) ||
                (tab.route === routes.adminClients &&
                  currentPath.startsWith(routes.clientDetailNoParams));

              return (
                <WorkspaceTab
                  key={tab.key}
                  type="button"
                  active={isActive}
                  onClick={() => history.push(tab.route)}
                >
                  <Icon />
                  {tab.label}
                </WorkspaceTab>
              );
            })}
          </WorkspaceNav>
        )}
      </Hero>
      <Main>{children}</Main>
    </Container>
  );
};

export default AdminShell;
