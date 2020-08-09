import React, { useState, useCallback, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import api from '../../services/api';

interface Solicitation {
  id: string;
}

const Menu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { signOut } = useAuth();
  const history = useHistory();

  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

  const getSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data);
    } catch {}
  }, []);

  useEffect(() => {
    getSolicitations();
  }, []);

  return (
    <>
      <Badge badgeContent={solicitations.length} color="secondary">
        <FiMenu
          cursor="pointer"
          onClick={() => setOpenMenu(!openMenu)}
          color="#FF9D3B"
        />
      </Badge>
      {openMenu && (
        <Container>
          <div>
            <FiMenu
              onClick={() => setOpenMenu(!openMenu)}
              color="#FF9D3B"
              size={55}
            />
            <span onClick={() => setOpenMenu(false)}>Fechar</span>
          </div>
          <h2>Menu</h2>

          <span>Dashboard</span>
          <span onClick={() => history.push(routes.enterpriseSchedule)}>
            Gestão de horários
          </span>
          <span onClick={() => history.push(routes.enterpriseProfile)}>
            Perfil da Empresa
          </span>
          <Badge badgeContent={solicitations.length} color="secondary">
            <span onClick={() => history.push(routes.plan)}>
              Gestão de planos
            </span>
          </Badge>
          <hr />
          <span onClick={() => history.push(routes.enterprise)}>Home</span>
          <span onClick={() => history.push(routes.schedule)}>
            Agendamentos
          </span>
          <span onClick={() => history.push(routes.profile)}>
            Perfil do usuário
          </span>
          <span onClick={() => signOut()}>sair</span>
        </Container>
      )}
    </>
  );
};

export default Menu;
