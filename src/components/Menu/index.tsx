import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiMenu } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import { Container, Span } from './styles';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

interface Solicitation {
  id: string;
}
interface Enterprise {
  isPrivate: boolean;
}

const Menu: React.FC = () => {
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') as string,
  ) as Enterprise;
  const [openMenu, setOpenMenu] = useState(false);
  const { signOut } = useAuth();
  const { socket } = useSocket();
  const history = useHistory();
  const { addToast } = useToast();

  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [checkout, setCheckoutPage] = useState(false);

  const handleCheckout = async () => {
    setCheckoutPage(true);
    // Call your backend to create the Checkout session.
    const response = await api.get('/enterprises/sessionPayment');

    localStorage.setItem('session_id', response.data.id);
    // When the customer clicks on the button, redirect them to Checkout.
    if (response.data.enterprise === 'create') {
      return history.push(`${routes.signupEnterprise}?session_id=redirected`);
    }

    if (response.data.url) {
      return (window.location.href = response.data.url);
    }
    const stripe: any = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    addToast({
      type: 'error',
      title: error,
    });

    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
  };

  const getSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data);
    } catch {}
  }, []);

  useEffect(() => {
    socket.on('solicitation', (solicitation: Solicitation) => {
      setSolicitations([...solicitations, solicitation]);
    });

    socket.on('acceptSolicitation', (solicitation: Solicitation) => {
      const oldSolicitations = [...solicitations];

      const newSolicitations = oldSolicitations.filter(
        (currentSolicitation) => currentSolicitation.id !== solicitation.id,
      );

      setSolicitations(newSolicitations);
    });

    socket.on('declineSolicitation', (solicitation: Solicitation) => {
      const oldSolicitations = [...solicitations];

      const newSolicitations = oldSolicitations.filter(
        (currentSolicitation) => currentSolicitation.id !== solicitation.id,
      );

      setSolicitations(newSolicitations);
    });
  }, [socket, solicitations]);

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
          {myEnterprise ? (
            <>
              <Span
                currentPage={history.location.pathname === routes.enterprise}
                onClick={() => history.push(routes.enterprise)}
              >
                Empresas
              </Span>

              {/* <Span>Dashboard</Span> */}
              <Span
                currentPage={
                  history.location.pathname === routes.enterpriseSchedule
                }
                onClick={() => history.push(routes.enterpriseSchedule)}
              >
                Gestão de horários
              </Span>
              <Span
                currentPage={
                  history.location.pathname === routes.enterpriseProfile
                }
                onClick={() => history.push(routes.enterpriseProfile)}
              >
                Perfil da empresa
              </Span>
              {myEnterprise.isPrivate ? (
                <Badge
                  style={{
                    margin: '17px 0',
                  }}
                  badgeContent={solicitations.length}
                  color="secondary"
                >
                  <Span
                    style={{ margin: 0 }}
                    currentPage={history.location.pathname === routes.plan}
                    onClick={() => history.push(routes.plan)}
                  >
                    Gestão de planos
                  </Span>
                </Badge>
              ) : (
                ''
              )}
              <Span currentPage={checkout} onClick={handleCheckout}>
                Minha Assinatura
              </Span>
              <hr />
              <Span
                currentPage={history.location.pathname === routes.schedule}
                onClick={() => history.push(routes.schedule)}
              >
                Agendamentos
              </Span>
              <Span
                currentPage={history.location.pathname === routes.profile}
                onClick={() => history.push(routes.profile)}
              >
                Perfil do usuário
              </Span>
              <Span currentPage={false} onClick={() => signOut()}>
                Sair
              </Span>
            </>
          ) : (
            <>
              <Span
                currentPage={history.location.pathname === routes.enterprise}
                onClick={() => history.push(routes.enterprise)}
              >
                Empresas
              </Span>
              <Span
                currentPage={history.location.pathname === routes.schedule}
                onClick={() => history.push(routes.schedule)}
              >
                Agendamentos
              </Span>
              <hr />
              <Span
                currentPage={history.location.pathname === routes.profile}
                onClick={() => history.push(routes.profile)}
              >
                Perfil do usuário
              </Span>
              <Span currentPage={checkout} onClick={handleCheckout}>
                Cadastrar empresa
              </Span>
              <Span currentPage={false} onClick={() => signOut()}>
                Sair
              </Span>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default Menu;
