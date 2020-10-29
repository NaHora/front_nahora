import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';

import { Link, useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import { Container, Span } from './styles';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';

interface MenuEnterpriseProps {
  primaryColor: string;
  secondaryColor: string;
}
interface Enterprise {
  isPrivate: boolean;
}

const MenuEnterprise: React.FC<MenuEnterpriseProps> = ({
  primaryColor,
  secondaryColor,
}) => {
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') as string,
  ) as Enterprise;
  const [openMenu, setOpenMenu] = useState(false);
  const { signOut } = useAuth();

  const history = useHistory();
  const { addToast } = useToast();

  // useEffect(() => {}, []);

  return (
    <>
      {/* <Badge badgeContent={} color="secondary"> */}

      <FiMenu
        cursor="pointer"
        onClick={() => setOpenMenu(!openMenu)}
        color={secondaryColor}
        size={30}
      />

      {/* </Badge> */}
      {openMenu && (
        <Container
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
        >
          <div>
            <FiMenu
              onClick={() => setOpenMenu(!openMenu)}
              color={secondaryColor}
              size={55}
            />
            <span onClick={() => setOpenMenu(false)}>Fechar</span>
          </div>
          <h2>Menu da empresa</h2>
          <>
            <Span
              primaryColor={primaryColor || '#28262e'}
              secondaryColor={secondaryColor || '#ff9000'}
              currentPage={history.location.pathname === routes.dashboard}
              onClick={() => history.push(routes.dashboard)}
            >
              Horários
            </Span>
            <Span
              primaryColor={primaryColor || '#28262e'}
              secondaryColor={secondaryColor || '#ff9000'}
              currentPage={history.location.pathname === routes.training}
              onClick={() => history.push(routes.training)}
            >
              Treino do dia
            </Span>
            <hr />

            <Span
              primaryColor={primaryColor || '#28262e'}
              secondaryColor={secondaryColor || '#ff9000'}
              currentPage={history.location.pathname === routes.enterprise}
              onClick={() => history.push(routes.enterprise)}
            >
              Voltar para empresas
            </Span>
          </>
        </Container>
      )}
    </>
  );
};

export default MenuEnterprise;
