import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiMail,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { useHistory } from 'react-router-dom';
import numeral from 'numeral';
import AdminShell from '../../components/AdminShell';
import Avatar from '../../components/Avatar';
import api from '../../services/api';
import { routes } from '../../routes';
import {
  AlertCard,
  Column,
  EmptyState,
  FinancePill,
  FinanceRow,
  Grid,
  HeaderLink,
  List,
  ListBadge,
  ListInfo,
  ListItem,
  MetricCard,
  MetricEyebrow,
  Metrics,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  QuickActionCard,
  QuickActions,
} from './styles';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
}

interface Invite {
  id: string;
  user: User;
  accepted: number;
  created_at?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  schedule_limit: number;
  isDeleted?: number;
}

interface Alert {
  id: string;
  title?: string;
  description?: string;
  message?: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const currency = (value: number) =>
  `R$ ${numeral(Number(value || 0) / 100).format('0,0.00')}`;

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const enterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const [accepted, setAccepted] = useState<Invite[]>([]);
  const [pending, setPending] = useState<Invite[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  });

  useEffect(() => {
    if (!enterprise?.id) {
      history.push(routes.enterprise);
    }
  }, [enterprise?.id, history]);

  const loadAccepted = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');
      setAccepted(response.data || []);
    } catch {}
  }, []);

  const loadPending = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setPending(response.data || []);
    } catch {}
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data || []);
    } catch {}
  }, []);

  const loadAlert = useCallback(async () => {
    if (!enterprise?.id) return;
    try {
      const response = await api.get(`/alert/${enterprise.id}`);
      setAlert(response.data || null);
    } catch {}
  }, [enterprise?.id]);

  const loadFinancial = useCallback(async () => {
    try {
      const response = await api.post('/financial/byDate', {
        start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
      });
      setBalance(
        response.data?.balance || { income: 0, outcome: 0, total: 0 },
      );
    } catch {}
  }, []);

  useEffect(() => {
    loadAccepted();
    loadPending();
    loadPlans();
    loadAlert();
    loadFinancial();
  }, [loadAccepted, loadPending, loadPlans, loadAlert, loadFinancial]);

  const activePlans = useMemo(
    () => plans.filter((plan) => plan?.isDeleted !== 1),
    [plans],
  );

  const recentAccepted = useMemo(() => accepted.slice(0, 5), [accepted]);
  const recentPending = useMemo(() => pending.slice(0, 5), [pending]);

  const currentMonthLabel = useMemo(
    () => format(new Date(), "MMMM 'de' yyyy", { locale: ptBr }),
    [],
  );

  return (
    <AdminShell
      eyebrow="Painel do administrador"
      title={enterprise?.name ? `Olá, ${enterprise.name}` : 'Painel'}
      description="Visão geral do seu negócio: clientes, planos, agenda e financeiro em um só lugar."
    >
      <Metrics>
        <MetricCard>
          <MetricEyebrow>
            <FiUsers /> Clientes ativos
          </MetricEyebrow>
          <strong>{accepted.length}</strong>
          <span>Total de clientes com convite aceito.</span>
        </MetricCard>

        <MetricCard>
          <MetricEyebrow>
            <FiUserPlus /> Solicitações
          </MetricEyebrow>
          <strong>{pending.length}</strong>
          <span>Convites aguardando aprovação.</span>
        </MetricCard>

        <MetricCard>
          <MetricEyebrow>
            <FiCreditCard /> Planos ativos
          </MetricEyebrow>
          <strong>{activePlans.length}</strong>
          <span>Planos disponíveis para os clientes.</span>
        </MetricCard>

        <MetricCard>
          <MetricEyebrow>
            <FiDollarSign /> Receita do mês
          </MetricEyebrow>
          <strong>{currency(balance.total)}</strong>
          <span>Saldo líquido em {currentMonthLabel}.</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Financeiro do mês</h2>
                <p>
                  Balanço consolidado de entradas e saídas em{' '}
                  {currentMonthLabel}.
                </p>
              </PanelTitleWrap>
              <HeaderLink onClick={() => history.push(routes.financial)}>
                Ver detalhes <FiArrowRight />
              </HeaderLink>
            </PanelHeader>
            <FinanceRow>
              <FinancePill tone="income">
                <span>Entradas</span>
                <strong>{currency(balance.income)}</strong>
              </FinancePill>
              <FinancePill tone="outcome">
                <span>Saídas</span>
                <strong>{currency(balance.outcome)}</strong>
              </FinancePill>
              <FinancePill tone="total">
                <span>Total</span>
                <strong>{currency(balance.total)}</strong>
              </FinancePill>
            </FinanceRow>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Clientes recentes</h2>
                <p>Últimos clientes que entraram no seu box.</p>
              </PanelTitleWrap>
              <HeaderLink onClick={() => history.push(routes.customers)}>
                Ver todos <FiArrowRight />
              </HeaderLink>
            </PanelHeader>
            {recentAccepted.length === 0 ? (
              <EmptyState>Nenhum cliente aceito ainda.</EmptyState>
            ) : (
              <List>
                {recentAccepted.map((invite) => (
                  <ListItem key={invite.id}>
                    <Avatar
                      avatarUrl={invite.user?.avatar_url}
                      name={invite.user?.name || 'Cliente'}
                      width={40}
                      height={40}
                      isPrivate={false}
                      noMargin
                    />
                    <ListInfo>
                      <strong>{invite.user?.name}</strong>
                      <span>{invite.user?.celphone || 'Sem telefone'}</span>
                    </ListInfo>
                    <ListBadge tone="muted">Ativo</ListBadge>
                  </ListItem>
                ))}
              </List>
            )}
          </Panel>
        </Column>

        <Column>
          {alert && (alert.title || alert.message || alert.description) && (
            <Panel>
              <PanelHeader>
                <PanelTitleWrap>
                  <h2>Alerta em destaque</h2>
                  <p>Comunicado atual visível aos clientes.</p>
                </PanelTitleWrap>
                <HeaderLink onClick={() => history.push(routes.alert)}>
                  Gerenciar <FiArrowRight />
                </HeaderLink>
              </PanelHeader>
              <AlertCard>
                <strong>{alert.title || 'Aviso'}</strong>
                <span>{alert.message || alert.description}</span>
              </AlertCard>
            </Panel>
          )}

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Solicitações pendentes</h2>
                <p>Convites aguardando sua aprovação.</p>
              </PanelTitleWrap>
              <HeaderLink onClick={() => history.push(routes.customers)}>
                Aprovar <FiArrowRight />
              </HeaderLink>
            </PanelHeader>
            {recentPending.length === 0 ? (
              <EmptyState>Sem solicitações no momento.</EmptyState>
            ) : (
              <List>
                {recentPending.map((invite) => (
                  <ListItem key={invite.id}>
                    <Avatar
                      avatarUrl={invite.user?.avatar_url}
                      name={invite.user?.name || 'Cliente'}
                      width={40}
                      height={40}
                      isPrivate={false}
                      noMargin
                    />
                    <ListInfo>
                      <strong>{invite.user?.name}</strong>
                      <span>{invite.user?.celphone || 'Sem telefone'}</span>
                    </ListInfo>
                    <ListBadge tone="accent">Pendente</ListBadge>
                  </ListItem>
                ))}
              </List>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Planos</h2>
                <p>Resumo dos planos oferecidos.</p>
              </PanelTitleWrap>
              <HeaderLink onClick={() => history.push(routes.plan)}>
                Gerenciar planos <FiArrowRight />
              </HeaderLink>
            </PanelHeader>
            {activePlans.length === 0 ? (
              <EmptyState>Você ainda não cadastrou planos.</EmptyState>
            ) : (
              <List>
                {activePlans.slice(0, 5).map((plan) => (
                  <ListItem key={plan.id}>
                    <ListInfo>
                      <strong>{plan.name}</strong>
                      <span>
                        {plan.schedule_limit
                          ? `${plan.schedule_limit} agendamentos`
                          : 'Sem limite de agendamentos'}
                      </span>
                    </ListInfo>
                    <ListBadge tone="accent">{currency(plan.price)}</ListBadge>
                  </ListItem>
                ))}
              </List>
            )}
          </Panel>
        </Column>
      </Grid>

      <QuickActions>
        <QuickActionCard
          onClick={() => history.push(routes.enterpriseSchedule)}
        >
          <FiCalendar />
          <strong>Gestão de horários</strong>
          <span>Cadastre e organize as aulas do seu box.</span>
        </QuickActionCard>
        <QuickActionCard onClick={() => history.push(routes.customers)}>
          <FiUsers />
          <strong>Gestão de clientes</strong>
          <span>Aprovar, editar e acompanhar seus clientes.</span>
        </QuickActionCard>
        <QuickActionCard onClick={() => history.push(routes.plan)}>
          <FiCreditCard />
          <strong>Gestão de planos</strong>
          <span>Crie, edite e restrinja os planos oferecidos.</span>
        </QuickActionCard>
        <QuickActionCard onClick={() => history.push(routes.financial)}>
          <FiActivity />
          <strong>Financeiro</strong>
          <span>Entradas, saídas e histórico completo.</span>
        </QuickActionCard>
      </QuickActions>
    </AdminShell>
  );
};

export default AdminDashboard;
