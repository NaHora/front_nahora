import React, { useState, useCallback, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import { Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

interface Solicitation {
  id: string;
}

const Menu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { signOut } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

  const handleCheckout = async () => {
    // Call your backend to create the Checkout session.
    const response = await api.get('/enterprises/sessionPayment');

    localStorage.setItem('session_id', response.data.id);
    // When the customer clicks on the button, redirect them to Checkout.
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
          {localStorage.getItem('@NaHora:myEnterprise') ? (
            <>
              <span onClick={() => history.push(routes.enterprise)}>
                Empresas
              </span>

              {/* <span>Dashboard</span> */}
              <span onClick={() => history.push(routes.enterpriseSchedule)}>
                Gestão de horários
              </span>
              <span onClick={() => history.push(routes.enterpriseProfile)}>
                Perfil da empresa
              </span>
              <Badge badgeContent={solicitations.length} color="secondary">
                <span onClick={() => history.push(routes.plan)}>
                  Gestão de planos
                </span>
              </Badge>
              <hr />
              <span onClick={() => history.push(routes.schedule)}>
                Agendamentos
              </span>
              <span onClick={() => history.push(routes.profile)}>
                Perfil do usuário
              </span>
              <span onClick={() => signOut()}>Sair</span>
            </>
          ) : (
            <>
              <span onClick={() => history.push(routes.enterprise)}>
                Empresas
              </span>
              <span onClick={() => history.push(routes.schedule)}>
                Agendamentos
              </span>
              <hr />
              <span onClick={() => history.push(routes.profile)}>
                Perfil do usuário
              </span>
              <span onClick={handleCheckout}>Cadastrar empresa</span>
              <span onClick={() => signOut()}>Sair</span>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default Menu;
