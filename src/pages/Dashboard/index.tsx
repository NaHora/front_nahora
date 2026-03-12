import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiMail,
  FiShield,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import {
  endOfMonth,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  startOfMonth,
  differenceInDays,
  isAfter,
} from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { useHistory } from 'react-router-dom';
import numeral from 'numeral';
import AdminShell from '../../components/AdminShell';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import api from '../../services/api';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { useLoad } from '../../hooks/load';
import {
  DashboardGrid,
  MainColumn,
  SideColumn,
  Panel,
  PanelTitle,
  PanelText,
  MetricsGrid,
  MetricCard,
  MetricEyebrow,
  FiltersRow,
  FilterChip,
  BookingToolbar,
  SelectField,
  ServiceSection,
  ServiceList,
  ServiceCard,
  ServiceMeta,
  ServiceActions,
  ParticipantList,
  CalendarPanel,
  HighlightCard,
  AlertCard,
  EmptyState,
  InsightGrid,
  InsightCard,
  InsightList,
  InsightListItem,
  QuickActions,
  QuickActionCard,
  StatusPill,
  InlineValue,
  ExecutiveGrid,
  ExecutiveCard,
  DataHighlights,
  DataHighlight,
  FinanceStrip,
  FinancePill,
  PriorityList,
  PriorityCard,
  ToneBadge,
} from './styles';
import 'react-day-picker/lib/style.css';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
  isPrivate: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  service_id: string;
  enterprise_id: string;
  user: User;
  date: Date;
}

interface Service {
  id: string;
  disabled: boolean;
  start_hour: string;
  capacity: number;
  category_id: string;
  appointments: Appointment[];
  description?: {
    title: string;
    description: string;
  } | null;
}

interface UserPlan {
  id: string;
  user: User;
  expiration_at: Date;
  plan_id: string;
}

interface Invite {
  id: string;
  user: User;
  accepted: number;
  currentPlan?: UserPlan;
}

interface AboutDays {
  availableDays: number[];
  disabledDays: number[];
}

interface Alert {
  id: string;
  title?: string;
  description?: string;
  enterprise_id: string;
}

interface Solicitation {
  id: string;
  user: User;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  schedule_limit: number;
  week_limit: number;
  delete_limit: number;
  days_to_expire: number;
  type_expiration: string;
}

interface Restrict {
  id: string;
  plan: Plan;
  category: Category;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  numeral.locale('pt-br');
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
  const { start, stop } = useLoad();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const ownerEnterprise = thisEnterprise.owner_id === user.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekDay, setCurrentWeekDay] = useState(getDay(new Date()));
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [aboutDays, setAboutDays] = useState<AboutDays>({
    availableDays: [],
    disabledDays: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [allUsersEnterpriseAccepted, setAllUsersEnterpriseAccepted] = useState<
    Invite[]
  >([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [enterprisePlans, setEnterprisePlans] = useState<Plan[]>([]);
  const [restricts, setRestricts] = useState<Restrict[]>([]);
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  });

  useEffect(() => {
    if (!thisEnterprise.id) {
      history.push(routes.enterprise);
    }
  }, [history, thisEnterprise.id]);

  const getMyAlerts = useCallback(async () => {
    try {
      const response = await api.get(`/alert/${thisEnterprise.id}`);
      setCurrentAlert(response.data);
    } catch {}
  }, [thisEnterprise.id]);

  const getAllEnterpriseAcceptedInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');
      setAllUsersEnterpriseAccepted(response.data);
    } catch {}
  }, []);

  const getSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data);
    } catch {}
  }, []);

  const getEnterprisePlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setEnterprisePlans(response.data);
    } catch {}
  }, []);

  const getRestricts = useCallback(async () => {
    try {
      const response = await api.get('/plans/restrict');
      setRestricts(response.data);
    } catch {}
  }, []);

  const getFinancialBalance = useCallback(async () => {
    try {
      const response = await api.post('/financial/byDate', {
        start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
      });
      setBalance(response.data.balance);
    } catch {}
  }, []);

  useEffect(() => {
    getMyAlerts();
    getAllEnterpriseAcceptedInvites();
    getSolicitations();
    getEnterprisePlans();
    getRestricts();
    getFinancialBalance();
  }, [
    getAllEnterpriseAcceptedInvites,
    getEnterprisePlans,
    getFinancialBalance,
    getMyAlerts,
    getRestricts,
    getSolicitations,
  ]);

  useEffect(() => {
    api.get(`/services/category/${thisEnterprise.id}`).then((response) => {
      setSelectedCategory(response.data[0]);
      setCategories(response.data);
    });
  }, [thisEnterprise.id]);

  const getAvailableDays = useCallback(async () => {
    start();
    try {
      const response = await api.get(
        `/services/enterprise/${thisEnterprise.id}/category/${selectedCategory?.id}`,
      );
      setAboutDays(response.data);
    } finally {
      stop();
    }
  }, [selectedCategory, start, stop, thisEnterprise.id]);

  useEffect(() => {
    if (selectedCategory && thisEnterprise.id) {
      getAvailableDays();
    }
  }, [getAvailableDays, selectedCategory, thisEnterprise.id]);

  const handleServices = useCallback(async () => {
    start();
    try {
      const response = await api.get(
        `/services/enterprise/${
          thisEnterprise.id
        }/day/${currentWeekDay}/category/${selectedCategory?.id}/${getYear(
          selectedDate,
        )}/${getMonth(selectedDate)}/${getDate(selectedDate)}`,
      );
      setServices(response.data);
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao procurar os servicos',
      });
    } finally {
      stop();
    }
  }, [
    currentWeekDay,
    selectedCategory,
    selectedDate,
    start,
    stop,
    thisEnterprise.id,
    toast,
  ]);

  useEffect(() => {
    if (thisEnterprise.id && selectedCategory) {
      handleServices();
    }
  }, [
    currentWeekDay,
    handleServices,
    selectedCategory,
    selectedDate,
    thisEnterprise.id,
  ]);

  const handleDateChange = useCallback(
    (day: Date, modifiers: DayModifiers) => {
      if ((modifiers.available && !modifiers.disabled) || ownerEnterprise) {
        setSelectedDate(day);
        setCurrentWeekDay(getDay(day));
        return;
      }

      toast.addToast({
        type: 'error',
        title: 'Sem horario disponivel neste dia',
      });
    },
    [ownerEnterprise, toast],
  );

  const handleAppointment = useCallback(
    async (service_id: string) => {
      if (ownerEnterprise && !currentCustomer) {
        toast.addToast({
          type: 'error',
          title: 'Selecione um cliente ou encerre a vaga',
        });
        return;
      }

      setLoading(true);
      start();
      try {
        if (currentCustomer === 'full-schedule-service') {
          await api.post('/appointments/full-time', {
            service_id,
            service_date: selectedDate,
          });
        } else {
          await api.post('/appointments', {
            service_id,
            enterprise_id: thisEnterprise.id,
            service_date: selectedDate,
            customer_id: currentCustomer,
          });
        }

        if (!currentCustomer && !ownerEnterprise) {
          history.push(routes.enterpriseUserSchedule);
        }

        setCurrentCustomer('');
        await handleServices();
        getFinancialBalance();

        toast.addToast({
          type: 'success',
          title: 'Agendamento realizado com sucesso',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao agendar este horario',
        });
      } finally {
        stop();
        setLoading(false);
      }
    },
    [
      currentCustomer,
      getFinancialBalance,
      handleServices,
      history,
      ownerEnterprise,
      selectedDate,
      start,
      stop,
      thisEnterprise.id,
      toast,
    ],
  );

  const deleteSchedule = useCallback(
    async (appointment_id: string) => {
      setLoading(true);
      try {
        await api.delete(`/appointments/${appointment_id}`);
        await handleServices();
        toast.addToast({
          title: 'Agendamento removido',
          type: 'success',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao remover o agendamento',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleServices, toast],
  );

  const deleteService = useCallback(
    async (service_id: string) => {
      setLoading(true);
      try {
        await api.delete(`/services/${service_id}`);
        await handleServices();
        toast.addToast({
          type: 'success',
          title: 'Horario excluido',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao excluir este horario',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleServices, toast],
  );

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "dd 'de' MMMM", {
      locale: ptBr,
    });
  }, [selectedDate]);

  const groupedServices = useMemo(() => {
    return {
      morning: services.filter(
        (service) => Number(service.start_hour.replace(':', '')) < 1200,
      ),
      afternoon: services.filter((service) => {
        const hour = Number(service.start_hour.replace(':', ''));
        return hour >= 1200 && hour < 1800;
      }),
      night: services.filter(
        (service) => Number(service.start_hour.replace(':', '')) >= 1800,
      ),
    };
  }, [services]);

  const totalReserved = useMemo(
    () => services.reduce((total, service) => total + service.appointments.length, 0),
    [services],
  );

  const totalCapacity = useMemo(
    () => services.reduce((total, service) => total + service.capacity, 0),
    [services],
  );

  const occupancyRate = useMemo(() => {
    if (!totalCapacity) return 0;
    return Math.round((totalReserved / totalCapacity) * 100);
  }, [totalCapacity, totalReserved]);

  const monthlyResultTone = balance.total >= 0 ? 'positive' : 'negative';

  const activePlansCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => invite.currentPlan).length;
  }, [allUsersEnterpriseAccepted]);

  const expiredPlansCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => {
      if (!invite.currentPlan) return false;
      return !isAfter(new Date(invite.currentPlan.expiration_at), new Date());
    }).length;
  }, [allUsersEnterpriseAccepted]);

  const expiringPlans = useMemo(() => {
    return allUsersEnterpriseAccepted
      .filter((invite) => invite.currentPlan)
      .filter((invite) => {
        const days = differenceInDays(
          new Date(invite.currentPlan!.expiration_at),
          new Date(),
        );
        return days <= 7;
      })
      .sort((a, b) => {
        const aDays = differenceInDays(
          new Date(a.currentPlan!.expiration_at),
          new Date(),
        );
        const bDays = differenceInDays(
          new Date(b.currentPlan!.expiration_at),
          new Date(),
        );
        return aDays - bDays;
      })
      .slice(0, 5);
  }, [allUsersEnterpriseAccepted]);

  const categoryUtilization = useMemo(() => {
    return categories.map((category) => {
      const categoryServices = services.filter(
        (service) => service.category_id === category.id,
      );
      const reserved = categoryServices.reduce(
        (total, service) => total + service.appointments.length,
        0,
      );
      const capacity = categoryServices.reduce(
        (total, service) => total + service.capacity,
        0,
      );

      return {
        id: category.id,
        name: category.name,
        reserved,
        capacity,
      };
    });
  }, [categories, services]);

  const nextService = useMemo(() => {
    return services
      .filter((service) => !service.disabled)
      .sort((a, b) => a.start_hour.localeCompare(b.start_hour))[0];
  }, [services]);

  const servicesByPeriod = useMemo(() => {
    return [
      {
        label: 'Manhã',
        total: groupedServices.morning.length,
        reserved: groupedServices.morning.reduce(
          (total, service) => total + service.appointments.length,
          0,
        ),
      },
      {
        label: 'Tarde',
        total: groupedServices.afternoon.length,
        reserved: groupedServices.afternoon.reduce(
          (total, service) => total + service.appointments.length,
          0,
        ),
      },
      {
        label: 'Noite',
        total: groupedServices.night.length,
        reserved: groupedServices.night.reduce(
          (total, service) => total + service.appointments.length,
          0,
        ),
      },
    ];
  }, [groupedServices]);

  const averageRevenuePerCustomer = useMemo(() => {
    if (!allUsersEnterpriseAccepted.length) return 0;
    return balance.income / allUsersEnterpriseAccepted.length;
  }, [allUsersEnterpriseAccepted.length, balance.income]);

  const pendingCoverageRate = useMemo(() => {
    if (!allUsersEnterpriseAccepted.length) return 0;
    return Math.round((activePlansCount / allUsersEnterpriseAccepted.length) * 100);
  }, [activePlansCount, allUsersEnterpriseAccepted.length]);

  const operationalPriorities = useMemo(() => {
    const priorities = [];

    if (solicitations.length > 0) {
      priorities.push({
        title: 'Solicitações aguardando resposta',
        description: `${solicitations.length} cliente(s) aguardando aprovação para entrar na base da empresa.`,
        badge: `${solicitations.length} pendente(s)`,
        tone: 'warning' as const,
      });
    }

    if (expiringPlans.length > 0) {
      priorities.push({
        title: 'Clientes em risco de cancelamento',
        description: `${expiringPlans.length} plano(s) vencem em até 7 dias ou já estão expirados.`,
        badge: 'renovar',
        tone: 'danger' as const,
      });
    }

    if (occupancyRate < 40) {
      priorities.push({
        title: 'Agenda com baixa ocupação',
        description: `A ocupação do dia está em ${occupancyRate}%. Vale impulsionar horários livres e reativar clientes.`,
        badge: 'atenção',
        tone: 'info' as const,
      });
    }

    if (currentAlert) {
      priorities.push({
        title: 'Comunicado público ativo',
        description: 'Existe um alerta em exibição no app. Revise se a mensagem ainda faz sentido para hoje.',
        badge: 'ao vivo',
        tone: 'success' as const,
      });
    }

    if (!priorities.length) {
      priorities.push({
        title: 'Operação estável',
        description: 'Sem gargalos imediatos identificados. O foco pode ficar em eficiência e crescimento.',
        badge: 'estável',
        tone: 'success' as const,
      });
    }

    return priorities.slice(0, 4);
  }, [currentAlert, expiringPlans.length, occupancyRate, solicitations.length]);

  const formatMoney = useCallback(
    (value: number) => `R$ ${numeral(value).format('0,0.00')}`,
    [],
  );

  const renderServiceSection = (title: string, list: Service[]) => (
    <ServiceSection>
      <div>
        <PanelTitle>{title}</PanelTitle>
        <PanelText>
          {list.length} horarios ativos para {selectedDateAsText}.
        </PanelText>
      </div>

      <ServiceList>
        {list.map((service) => {
          const userAppointment = service.appointments.find(
            (appointment) => appointment.user.id === user.id,
          );
          const serviceTitle =
            service.description?.title || 'Horário sem título definido';
          const serviceDescription =
            service.description?.description ||
            'Este horário não possui uma descrição cadastrada.';

          return (
            <ServiceCard key={service.id}>
              <div>
                <div>
                  <h3>{serviceTitle}</h3>
                  <p>{serviceDescription}</p>
                </div>
                {ownerEnterprise && (
                  <button type="button" onClick={() => deleteService(service.id)}>
                    <FiTrash2 />
                  </button>
                )}
              </div>

              <ServiceMeta>
                <span>
                  <FiClock />
                  {service.start_hour}
                </span>
                <span>
                  <FiUsers />
                  {service.appointments.length}/{service.capacity} vagas ocupadas
                </span>
              </ServiceMeta>

              <ParticipantList>
                {service.appointments.map((appointment) => (
                  <li key={appointment.id}>
                    <div>
                      <Avatar
                        width={38}
                        height={38}
                        name={appointment.user.name}
                        isPrivate={appointment.user.isPrivate}
                        avatarUrl={appointment.user.avatar_url}
                      />
                      <span>
                        {appointment.user.isPrivate
                          ? 'Anonimo'
                          : appointment.user.name}
                      </span>
                    </div>

                    {ownerEnterprise && (
                      <button
                        type="button"
                        onClick={() => deleteSchedule(appointment.id)}
                      >
                        <FiX />
                      </button>
                    )}
                  </li>
                ))}
              </ParticipantList>

              <ServiceActions>
                {!ownerEnterprise && !userAppointment && (
                  <Button
                    onClick={() => handleAppointment(service.id)}
                    disabled={service.disabled}
                    loading={loading}
                  >
                    Reservar vaga
                    <FiArrowRight />
                  </Button>
                )}

                {!ownerEnterprise && !!userAppointment && (
                  <Button
                    transparent
                    secondaryColor="#d34f4f"
                    primaryColor="#ffffff"
                    onClick={() => deleteSchedule(userAppointment.id)}
                    loading={loading}
                  >
                    Cancelar reserva
                  </Button>
                )}

                {ownerEnterprise && (
                  <Button
                    onClick={() => handleAppointment(service.id)}
                    disabled={service.disabled || !currentCustomer}
                    loading={loading}
                  >
                    Aplicar acao
                    <FiCheck />
                  </Button>
                )}
              </ServiceActions>
            </ServiceCard>
          );
        })}

        {list.length === 0 && (
          <EmptyState>Nenhum horario cadastrado neste periodo.</EmptyState>
        )}
      </ServiceList>
    </ServiceSection>
  );

  return (
    <AdminShell
      eyebrow={ownerEnterprise ? 'Painel da empresa' : 'Agenda da empresa'}
      title={thisEnterprise.name || 'Dashboard da operacao'}
      description={`Acompanhe ocupacao, clientes ativos, caixa do mes e saude operacional de ${selectedDateAsText}.`}
      actions={
        ownerEnterprise ? (
          <BookingToolbar>
            <SelectField
              value={currentCustomer}
              onChange={(e) => setCurrentCustomer(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              <option value="full-schedule-service">Encerrar vaga manualmente</option>
              {allUsersEnterpriseAccepted.map((invite) => (
                <option key={invite.id} value={invite.user.id}>
                  {invite.user.name}
                </option>
              ))}
            </SelectField>
          </BookingToolbar>
        ) : undefined
      }
    >
      <MetricsGrid>
        <MetricCard>
          <MetricEyebrow>Agenda do dia</MetricEyebrow>
          <strong>{services.length}</strong>
          <span>Horários publicados para a data selecionada</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Ocupação</MetricEyebrow>
          <strong>{occupancyRate}%</strong>
          <span>{totalReserved} reservas sobre {totalCapacity || 0} vagas</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Clientes vinculados</MetricEyebrow>
          <strong>{allUsersEnterpriseAccepted.length}</strong>
          <span>Base total aprovada na empresa</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Resultado mensal</MetricEyebrow>
          <strong>{formatMoney(balance.total)}</strong>
          <span>Saldo acumulado do mês corrente</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Receita</MetricEyebrow>
          <strong>{formatMoney(balance.income)}</strong>
          <span>Entradas lançadas neste mês</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Planos ativos</MetricEyebrow>
          <strong>{activePlansCount}</strong>
          <span>{pendingCoverageRate}% da base com cobertura atual</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Solicitações</MetricEyebrow>
          <strong>{solicitations.length}</strong>
          <span>Clientes aguardando decisão</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>Risco imediato</MetricEyebrow>
          <strong>{expiredPlansCount + expiringPlans.length}</strong>
          <span>Planos vencidos ou perto do vencimento</span>
        </MetricCard>
      </MetricsGrid>

      <DashboardGrid>
        <MainColumn>
          <Panel>
            <PanelTitle>Comando da operação</PanelTitle>
            <PanelText>
              A leitura principal do dia combina agenda, carteira, caixa e pressão comercial para facilitar decisões rápidas.
            </PanelText>

            <ExecutiveGrid>
              <ExecutiveCard>
                <div>
                  <FiCalendar />
                  <span>Próximo horário</span>
                </div>
                <strong>{nextService ? nextService.start_hour : 'Sem agenda'}</strong>
                <p>
                  {nextService
                    ? nextService.description?.title || 'Horário sem título definido'
                    : 'Nenhum serviço disponível para esta data.'}
                </p>
              </ExecutiveCard>

              <ExecutiveCard>
                <div>
                  <FiActivity />
                  <span>Capacidade livre</span>
                </div>
                <strong>{Math.max(totalCapacity - totalReserved, 0)}</strong>
                <p>Vagas ainda disponíveis na agenda selecionada.</p>
              </ExecutiveCard>

              <ExecutiveCard>
                <div>
                  <FiShield />
                  <span>Planos em risco</span>
                </div>
                <strong>{expiringPlans.length}</strong>
                <p>Clientes com plano expirado ou prestes a expirar.</p>
              </ExecutiveCard>

              <ExecutiveCard>
                <div>
                  <FiTrendingUp />
                  <span>Receita por cliente</span>
                </div>
                <strong>{formatMoney(averageRevenuePerCustomer)}</strong>
                <p>Média simples de entrada mensal por cliente vinculado.</p>
              </ExecutiveCard>
            </ExecutiveGrid>

            <DataHighlights>
              <DataHighlight>
                <span>Portfólio</span>
                <strong>{enterprisePlans.length} plano(s)</strong>
              </DataHighlight>
              <DataHighlight>
                <span>Restrições</span>
                <strong>{restricts.length} regra(s)</strong>
              </DataHighlight>
              <DataHighlight>
                <span>Saúde da base</span>
                <strong>{pendingCoverageRate}% coberta</strong>
              </DataHighlight>
            </DataHighlights>
          </Panel>

          <Panel>
            <PanelTitle>Demanda por categoria</PanelTitle>
            <PanelText>
              Selecione uma categoria para reorganizar a agenda e entender onde a demanda está concentrada.
            </PanelText>

            <FiltersRow>
              {categories.map((category) => (
                <FilterChip
                  key={category.id}
                  selected={selectedCategory?.id === category.id}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.name}
                </FilterChip>
              ))}
            </FiltersRow>

            <InsightList>
              {categoryUtilization.map((category) => (
                <InsightListItem key={category.id}>
                  <div>
                    <strong>{category.name}</strong>
                    <span>
                      {category.reserved}/{category.capacity || 0} reservas
                    </span>
                  </div>
                  <InlineValue>
                    {category.capacity
                      ? `${Math.round((category.reserved / category.capacity) * 100)}%`
                      : '0%'}
                  </InlineValue>
                </InsightListItem>
              ))}
            </InsightList>
          </Panel>

          <Panel>
            <PanelTitle>Financeiro do mês</PanelTitle>
            <PanelText>
              Resultado acumulado entre {format(startOfMonth(new Date()), 'dd/MM')} e{' '}
              {format(endOfMonth(new Date()), 'dd/MM')}, com foco em caixa e margem operacional.
            </PanelText>

            <FinanceStrip>
              <FinancePill tone="positive">
                <span>Entradas</span>
                <strong>{formatMoney(balance.income)}</strong>
              </FinancePill>
              <FinancePill tone="negative">
                <span>Saídas</span>
                <strong>{formatMoney(balance.outcome)}</strong>
              </FinancePill>
              <FinancePill tone={monthlyResultTone}>
                <span>Resultado</span>
                <strong>{formatMoney(balance.total)}</strong>
              </FinancePill>
            </FinanceStrip>
          </Panel>

          <Panel>
            <PanelTitle>Ritmo da agenda</PanelTitle>
            <PanelText>
              Distribuição da operação por período para enxergar o peso de manhã, tarde e noite.
            </PanelText>

            <InsightGrid>
              {servicesByPeriod.map((period) => (
                <InsightCard key={period.label}>
                  <div>
                    <FiClock />
                    <span>{period.label}</span>
                  </div>
                  <strong>{period.total}</strong>
                  <p>{period.reserved} reservas registradas neste período.</p>
                </InsightCard>
              ))}
            </InsightGrid>
          </Panel>

          {renderServiceSection('Manhã', groupedServices.morning)}
          {renderServiceSection('Tarde', groupedServices.afternoon)}
          {renderServiceSection('Noite', groupedServices.night)}
        </MainColumn>

        <SideColumn>
          <CalendarPanel>
            <PanelTitle>Calendário operacional</PanelTitle>
            <PanelText>
              Dias destacados indicam disponibilidade para a categoria atual.
            </PanelText>

            <DayPicker
              weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
              months={[
                'Janeiro',
                'Fevereiro',
                'Marco',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ]}
              selectedDays={selectedDate}
              disabledDays={[
                {
                  daysOfWeek: aboutDays.disabledDays,
                },
              ]}
              modifiers={{
                available: {
                  daysOfWeek: aboutDays.availableDays,
                },
              }}
              onDayClick={handleDateChange}
            />

            <HighlightCard>
              <div>
                <span>Dia selecionado</span>
                <strong>{selectedDateAsText}</strong>
              </div>
              <span>
                <FiCalendar />
                {format(selectedDate, 'cccc', {
                  locale: ptBr,
                })}
              </span>
            </HighlightCard>
          </CalendarPanel>

          {currentAlert && (
            <AlertCard>
              <div>
                <FiAlertCircle />
                <span>Comunicado ativo</span>
              </div>
              <strong>{currentAlert.title || 'Aviso da operação'}</strong>
              <p>{currentAlert.description || 'Sem detalhes adicionais.'}</p>
            </AlertCard>
          )}

          <Panel>
            <PanelTitle>Prioridades do dia</PanelTitle>
            <PanelText>
              O que merece resposta imediata para proteger receita, agenda e relacionamento.
            </PanelText>

            <PriorityList>
              {operationalPriorities.map((priority) => (
                <PriorityCard key={priority.title}>
                  <div>
                    <strong>{priority.title}</strong>
                    <ToneBadge tone={priority.tone}>{priority.badge}</ToneBadge>
                  </div>
                  <p>{priority.description}</p>
                </PriorityCard>
              ))}
            </PriorityList>
          </Panel>

          <Panel>
            <PanelTitle>Clientes em atenção</PanelTitle>
            <PanelText>
              Priorize contato com quem está perto do vencimento ou já perdeu cobertura.
            </PanelText>

            {expiringPlans.length > 0 ? (
              <InsightList>
                {expiringPlans.map((invite) => {
                  const expiration = new Date(invite.currentPlan!.expiration_at);
                  const isExpired = !isAfter(expiration, new Date());

                  return (
                    <InsightListItem key={invite.id}>
                      <div>
                        <strong>{invite.user.name}</strong>
                        <span>{format(expiration, 'dd/MM/yyyy')}</span>
                      </div>
                      <StatusPill expired={isExpired}>
                        {isExpired
                          ? 'Expirado'
                          : `${differenceInDays(expiration, new Date())} dias`}
                      </StatusPill>
                    </InsightListItem>
                  );
                })}
              </InsightList>
            ) : (
              <EmptyState>Nenhum cliente em risco imediato.</EmptyState>
            )}
          </Panel>

          <Panel>
            <PanelTitle>Atalhos de gestão</PanelTitle>
            <PanelText>
              Acesse rapidamente as áreas mais importantes da operação.
            </PanelText>

            <QuickActions>
              <QuickActionCard onClick={() => history.push(routes.customers)}>
                <FiUsers />
                <div>
                  <strong>Clientes</strong>
                  <span>Planos, convites e base ativa</span>
                </div>
              </QuickActionCard>

              <QuickActionCard onClick={() => history.push(routes.plan)}>
                <FiLayers />
                <div>
                  <strong>Planos</strong>
                  <span>Catálogo, restrições e cobertura</span>
                </div>
              </QuickActionCard>

              <QuickActionCard onClick={() => history.push(routes.financial)}>
                <FiDollarSign />
                <div>
                  <strong>Financeiro</strong>
                  <span>Transações, caixa e balanço</span>
                </div>
              </QuickActionCard>

              <QuickActionCard onClick={() => history.push(routes.enterprise)}>
                <FiBriefcase />
                <div>
                  <strong>Empresa</strong>
                  <span>Dados cadastrais e configurações gerais</span>
                </div>
              </QuickActionCard>

              <QuickActionCard
                onClick={() => history.push(routes.enterpriseSchedule)}
              >
                <FiLayers />
                <div>
                  <strong>Horários</strong>
                  <span>Cadastro e gestão da agenda</span>
                </div>
              </QuickActionCard>

              <QuickActionCard onClick={() => history.push(routes.alert)}>
                <FiMail />
                <div>
                  <strong>Alertas</strong>
                  <span>Comunicados exibidos no app</span>
                </div>
              </QuickActionCard>
            </QuickActions>
          </Panel>
        </SideColumn>
      </DashboardGrid>
    </AdminShell>
  );
};

export default Dashboard;
