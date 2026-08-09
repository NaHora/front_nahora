import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FiMenu,
  FiX,
  FiCreditCard,
  FiCalendar,
  FiBell,
  FiUser,
  FiLogOut,
  FiGrid,
  FiLayers,
  FiUsers,
  FiEdit3,
} from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import {
  Container,
  TriggerButton,
  TriggerText,
  Panel,
  PanelHeader,
  PanelBody,
  MenuSection,
  MenuItem,
  MenuItemText,
  MenuOverlay,
  CloseButton,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';

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
    const response = await api.get('/enterprises/sessionPayment');

    localStorage.setItem('session_id', response.data.id);

    if (response.data.enterprise === 'create') {
      history.push(`${routes.signupEnterprise}?session_id=redirected`);
      return;
    }

    if (response.data.url) {
      window.location.href = response.data.url;
      return;
    }

    const stripe: any = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    addToast({
      type: 'error',
      title: error,
    });
  };

  const getSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data);
    } catch {}
  }, []);

  useEffect(() => {
    socket.on('solicitation', (solicitation: Solicitation) => {
      setSolicitations((currentState) => [...currentState, solicitation]);
    });

    socket.on('acceptSolicitation', (solicitation: Solicitation) => {
      setSolicitations((currentState) =>
        currentState.filter((item) => item.id !== solicitation.id),
      );
    });

    socket.on('declineSolicitation', (solicitation: Solicitation) => {
      setSolicitations((currentState) =>
        currentState.filter((item) => item.id !== solicitation.id),
      );
    });
  }, [socket]);

  useEffect(() => {
    getSolicitations();
  }, [getSolicitations]);

  const menuContent =
    openMenu && typeof document !== 'undefined' ? (
      <>
        <MenuOverlay onClick={() => setOpenMenu(false)} />
        <Panel>
          <PanelHeader>
            <div>
              <span>Navegacao</span>
              <strong>Atalhos do painel</strong>
            </div>
            <CloseButton type="button" onClick={() => setOpenMenu(false)}>
              <FiX />
            </CloseButton>
          </PanelHeader>

          <PanelBody>
            <MenuSection>
              <span>Principal</span>
              <MenuItem
                currentPage={
                  history.location.pathname === routes.adminDashboard
                }
                onClick={() => history.push(routes.adminDashboard)}
              >
                <FiGrid />
                <MenuItemText>
                  <strong>Painel</strong>
                  <span>Visão geral do negócio.</span>
                </MenuItemText>
              </MenuItem>
              <MenuItem
                currentPage={history.location.pathname === routes.profile}
                onClick={() => history.push(routes.profile)}
              >
                <FiUser />
                <MenuItemText>
                  <strong>Perfil do usuario</strong>
                  <span>Dados pessoais e configuracoes da conta.</span>
                </MenuItemText>
              </MenuItem>
            </MenuSection>

            {myEnterprise && (
              <MenuSection>
                <span>Operacao da empresa</span>
                <MenuItem
                  currentPage={history.location.pathname === routes.financial}
                  onClick={() => history.push(routes.financial)}
                >
                  <FiCreditCard />
                  <MenuItemText>
                    <strong>Gestao financeira</strong>
                    <span>Receita, repasses e visao monetaria.</span>
                  </MenuItemText>
                </MenuItem>
                <MenuItem
                  currentPage={
                    history.location.pathname === routes.enterpriseSchedule
                  }
                  onClick={() => history.push(routes.enterpriseSchedule)}
                >
                  <FiCalendar />
                  <MenuItemText>
                    <strong>Gestao de horarios</strong>
                    <span>Monte agenda, turnos e vagas.</span>
                  </MenuItemText>
                </MenuItem>
                <MenuItem
                  currentPage={history.location.pathname === routes.training}
                  onClick={() => history.push(routes.training)}
                >
                  <FiEdit3 />
                  <MenuItemText>
                    <strong>Treino do dia</strong>
                    <span>Descreva o wod e as instrucoes para a turma.</span>
                  </MenuItemText>
                </MenuItem>
                <MenuItem
                  currentPage={history.location.pathname === routes.alert}
                  onClick={() => history.push(routes.alert)}
                >
                  <FiBell />
                  <MenuItemText>
                    <strong>Comunicados</strong>
                    <span>Aviso rapido publicado no app dos clientes.</span>
                  </MenuItemText>
                </MenuItem>
                <MenuItem
                  currentPage={
                    history.location.pathname === routes.enterpriseProfile
                  }
                  onClick={() => history.push(routes.enterpriseProfile)}
                >
                  <FiUser />
                  <MenuItemText>
                    <strong>Perfil da empresa</strong>
                    <span>Marca, dados publicos e configuracoes.</span>
                  </MenuItemText>
                </MenuItem>
                {myEnterprise.isPrivate && (
                  <>
                    <MenuItem
                      currentPage={
                        history.location.pathname === routes.adminClients
                      }
                      onClick={() => history.push(routes.adminClients)}
                    >
                      <Badge
                        badgeContent={solicitations.length}
                        color="secondary"
                      >
                        <FiUsers />
                      </Badge>
                      <MenuItemText>
                        <strong>Clientes</strong>
                        <span>Convites, aprovacoes e relacionamento da base.</span>
                      </MenuItemText>
                    </MenuItem>
                    <MenuItem
                      currentPage={history.location.pathname === routes.plan}
                      onClick={() => history.push(routes.plan)}
                    >
                      <FiLayers />
                      <MenuItemText>
                        <strong>Planos</strong>
                        <span>Catalogo, restricoes e cobertura da carteira.</span>
                      </MenuItemText>
                    </MenuItem>
                  </>
                )}
                <MenuItem currentPage={checkout} onClick={handleCheckout}>
                  <FiCreditCard />
                  <MenuItemText>
                    <strong>Minha assinatura</strong>
                    <span>Plano atual e fluxo de cobranca.</span>
                  </MenuItemText>
                </MenuItem>
              </MenuSection>
            )}

            {!myEnterprise && (
              <MenuSection>
                <span>Crescimento</span>
                <MenuItem currentPage={checkout} onClick={handleCheckout}>
                  <FiCreditCard />
                  <MenuItemText>
                    <strong>Cadastrar empresa</strong>
                    <span>Ative uma nova operacao na plataforma.</span>
                  </MenuItemText>
                </MenuItem>
              </MenuSection>
            )}

            <MenuSection>
              <span>Sessao</span>
              <MenuItem currentPage={false} onClick={() => signOut()}>
                <FiLogOut />
                <MenuItemText>
                  <strong>Sair</strong>
                  <span>Encerrar a sessao atual com seguranca.</span>
                </MenuItemText>
              </MenuItem>
            </MenuSection>
          </PanelBody>
        </Panel>
      </>
    ) : null;

  return (
    <Container>
      <Badge badgeContent={solicitations.length} color="secondary">
        <TriggerButton type="button" onClick={() => setOpenMenu(true)}>
          <FiMenu />
          <TriggerText>
            <span>Menu</span>
            <strong>Abrir atalhos</strong>
          </TriggerText>
        </TriggerButton>
      </Badge>
      {menuContent ? ReactDOM.createPortal(menuContent, document.body) : null}
    </Container>
  );
};

export default Menu;
