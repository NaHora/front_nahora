import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiMail,
  FiPhone,
  FiPlus,
  FiUser,
} from 'react-icons/fi';
import { addDays, differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHistory, useParams } from 'react-router-dom';
import AdminShell from '../../../components/AdminShell';
import Avatar from '../../../components/Avatar';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import api from '../../../services/api';
import { removeMask } from '../../../utils';
import {
  AppointmentBadge,
  AppointmentInfo,
  AppointmentList,
  AppointmentRow,
  Chip,
  ChipRow,
  Column,
  CountsCard,
  CountsRow,
  EmptyState,
  Field,
  FormPanel,
  HeroAction,
  InlineGrid,
  Input,
  Layout,
  ModalActions,
  ModalButton,
  ModalCard,
  ModalOverlay,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PlanBadge,
  PlanBadgeInfo,
  PrimaryButton,
  ProfileMetaGrid,
  ProfileMetaRow,
  ProfilePanel,
} from './styles';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email?: string;
  celphone?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  start_hour: string;
  category_id: string;
  capacity: number;
  day_week: number;
}

interface CurrentPlan {
  id: string;
  plan_id: string;
  expiration_at: string;
  plan?: { id: string; name: string };
}

interface Appointment {
  id: string;
  date: string;
  service?: { id: string; capacity: number; start_hour?: string } | null;
}

interface ClientParams {
  client_id: string;
}

const weekDays = [
  { id: 0, label: 'Dom' },
  { id: 1, label: 'Seg' },
  { id: 2, label: 'Ter' },
  { id: 3, label: 'Qua' },
  { id: 4, label: 'Qui' },
  { id: 5, label: 'Sex' },
  { id: 6, label: 'Sáb' },
];

const ClientDetail: React.FC = () => {
  const { client_id } = useParams<ClientParams>();
  const history = useHistory();
  const toast = useToast();

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const [user, setUser] = useState<User>({} as User);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>(
    [],
  );
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingExpiration, setSavingExpiration] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [expirationModal, setExpirationModal] = useState<{
    open: boolean;
    date: string;
  }>({ open: false, date: '' });

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get(`/invites/client-detail/${client_id}`);
      setUser(response.data || ({} as User));
      setCurrentPlan(response.data?.currentPlan || null);
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Não foi possível carregar os dados do cliente.',
      });
    }
  }, [client_id, toast]);

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const response = await api.get(`/appointments/client/${client_id}`);
      setFutureAppointments(response.data?.futureAppointments || []);
      setPastAppointments(response.data?.pastAppointments || []);
    } catch (err: any) {
      setFutureAppointments([]);
      setPastAppointments([]);
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Não foi possível carregar os agendamentos.',
      });
    } finally {
      setLoadingAppointments(false);
    }
  }, [client_id, toast]);

  const loadCategories = useCallback(async () => {
    if (!myEnterprise?.id) return;
    try {
      const response = await api.get(`/services/category/${myEnterprise.id}`);
      const list: Category[] = response.data || [];
      setCategories(list);
      if (list.length > 0 && !selectedCategory) {
        setSelectedCategory(list[0].id);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myEnterprise?.id]);

  const loadServices = useCallback(async () => {
    if (!selectedCategory) return;
    try {
      const response = await api.get(
        `/services/category/${selectedCategory}/day/${selectedDay}`,
      );
      setServices(response.data || []);
      setSelectedService('');
    } catch {
      setServices([]);
    }
  }, [selectedCategory, selectedDay]);

  useEffect(() => {
    loadUser();
    loadAppointments();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const createAppointmentsBatch = useCallback(async () => {
    if (!selectedService) {
      toast.addToast({
        type: 'error',
        title: 'Selecione um horário para agendar.',
      });
      return;
    }
    setCreating(true);
    try {
      const response = await api.post(`/appointments/create-list`, {
        service_id: selectedService,
        customer_id: client_id,
        start_date: addDays(new Date(startDate), 1),
      });
      toast.addToast({
        type: 'success',
        title: `${response.data?.length || 0} horário(s) agendado(s).`,
      });
      loadAppointments();
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Erro ao agendar horários fixos para este cliente.',
      });
    } finally {
      setCreating(false);
    }
  }, [
    selectedService,
    client_id,
    startDate,
    loadAppointments,
    toast,
  ]);

  const openExpirationModal = () => {
    if (!currentPlan) return;
    const raw = new Date(currentPlan.expiration_at);
    const iso = Number.isNaN(raw.getTime()) ? '' : format(raw, 'yyyy-MM-dd');
    setExpirationModal({ open: true, date: iso });
  };

  const closeExpirationModal = () => {
    if (savingExpiration) return;
    setExpirationModal({ open: false, date: '' });
  };

  const saveExpiration = useCallback(async () => {
    if (!currentPlan?.id || !expirationModal.date) {
      toast.addToast({
        type: 'error',
        title: 'Escolha uma data válida.',
      });
      return;
    }
    setSavingExpiration(true);
    try {
      await api.put('/plans/expiration', {
        user_plan_id: currentPlan.id,
        expiration_at: expirationModal.date,
      });
      toast.addToast({ type: 'success', title: 'Vigência atualizada.' });
      setExpirationModal({ open: false, date: '' });
      loadUser();
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Erro ao atualizar a vigência do plano.',
      });
    } finally {
      setSavingExpiration(false);
    }
  }, [currentPlan?.id, expirationModal.date, loadUser, toast]);

  const planStatus = useMemo(() => {
    if (!currentPlan) {
      return {
        tone: 'none' as const,
        title: 'Sem plano ativo',
        subtitle: 'Este cliente ainda não tem cobertura vigente.',
      };
    }
    const exp = new Date(currentPlan.expiration_at);
    const days = differenceInDays(exp, new Date());
    const nice = format(exp, 'dd/MM/yyyy');
    const planName = currentPlan.plan?.name || 'Plano ativo';
    if (days < 0)
      return {
        tone: 'danger' as const,
        title: `${planName} — expirado`,
        subtitle: `Vencido em ${nice}.`,
      };
    if (days < 7)
      return {
        tone: 'warn' as const,
        title: `${planName} — vencendo`,
        subtitle: `Expira em ${days} dia(s), ${nice}.`,
      };
    return {
      tone: 'active' as const,
      title: planName,
      subtitle: `Vigente até ${nice}.`,
    };
  }, [currentPlan]);

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return format(d, "HH:mm'h'");
  };

  return (
    <AdminShell
      eyebrow="Ficha do cliente"
      title={user?.name || 'Cliente'}
      description="Dados, cobertura vigente, agendamentos fixos e histórico deste cliente."
      actions={
        <HeroAction
          type="button"
          onClick={() => history.push(routes.adminClients)}
        >
          <FiArrowLeft /> Voltar para clientes
        </HeroAction>
      }
    >
      <Layout>
        <Column>
          <ProfilePanel>
            <Avatar
              width={140}
              height={140}
              name={user?.name || 'Cliente'}
              isPrivate={false}
              avatarUrl={user?.avatar_url}
              noMargin
            />
            <h2>{user?.name}</h2>
            <ProfileMetaGrid>
              {user?.email && (
                <ProfileMetaRow>
                  <FiMail />
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </ProfileMetaRow>
              )}
              {user?.celphone && (
                <ProfileMetaRow>
                  <FiPhone />
                  <a
                    href={`https://api.whatsapp.com/send?phone=55${removeMask(
                      user.celphone,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.celphone}
                  </a>
                </ProfileMetaRow>
              )}
              {!user?.email && !user?.celphone && (
                <ProfileMetaRow>
                  <FiUser />
                  <span>Sem contato cadastrado</span>
                </ProfileMetaRow>
              )}
            </ProfileMetaGrid>

            <CountsRow>
              <CountsCard>
                <strong>{futureAppointments.length}</strong>
                <span>Futuros</span>
              </CountsCard>
              <CountsCard>
                <strong>{pastAppointments.length}</strong>
                <span>Passados</span>
              </CountsCard>
            </CountsRow>
          </ProfilePanel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Plano vigente</h2>
                <p>Cobertura atual deste cliente.</p>
              </PanelTitleWrap>
              {currentPlan && (
                <HeroAction type="button" onClick={openExpirationModal}>
                  <FiEdit3 /> Vigência
                </HeroAction>
              )}
            </PanelHeader>

            <div style={{ marginTop: 16 }}>
              <PlanBadge tone={planStatus.tone}>
                <FiCreditCard />
                <PlanBadgeInfo>
                  <strong>{planStatus.title}</strong>
                  <span>{planStatus.subtitle}</span>
                </PlanBadgeInfo>
              </PlanBadge>
            </div>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Agendar horários fixos</h2>
                <p>
                  Cria agendamentos recorrentes até a data de expiração do
                  plano.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <Field>
                <span>Serviço</span>
                {categories.length === 0 ? (
                  <EmptyState style={{ marginTop: 0 }}>
                    Nenhuma categoria cadastrada. Vá em <strong>Horários</strong>{' '}
                    para criar.
                  </EmptyState>
                ) : (
                  <ChipRow>
                    {categories.map((category) => (
                      <Chip
                        key={category.id}
                        type="button"
                        active={selectedCategory === category.id}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Chip>
                    ))}
                  </ChipRow>
                )}
              </Field>

              <Field>
                <span>Dia da semana</span>
                <ChipRow>
                  {weekDays.map((day) => (
                    <Chip
                      key={day.id}
                      type="button"
                      active={selectedDay === day.id}
                      onClick={() => setSelectedDay(day.id)}
                    >
                      {day.label}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>

              <Field>
                <span>Horário</span>
                {services.length === 0 ? (
                  <EmptyState style={{ marginTop: 0 }}>
                    Nenhum horário publicado para esse dia/categoria.
                  </EmptyState>
                ) : (
                  <ChipRow>
                    {services.map((service) => (
                      <Chip
                        key={service.id}
                        type="button"
                        active={selectedService === service.id}
                        onClick={() => setSelectedService(service.id)}
                      >
                        {service.start_hour}
                      </Chip>
                    ))}
                  </ChipRow>
                )}
              </Field>

              <InlineGrid>
                <Field>
                  <span>A partir de</span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Field>
              </InlineGrid>

              <PrimaryButton
                type="button"
                onClick={createAppointmentsBatch}
                disabled={
                  creating || !selectedService || categories.length === 0
                }
              >
                <FiCheckCircle />
                {creating ? 'Agendando...' : 'Confirmar agendamentos'}
              </PrimaryButton>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Próximos agendamentos</h2>
                <p>Aulas futuras deste cliente.</p>
              </PanelTitleWrap>
            </PanelHeader>

            {loadingAppointments ? (
              <EmptyState>Carregando...</EmptyState>
            ) : futureAppointments.length === 0 ? (
              <EmptyState>Nenhum agendamento futuro.</EmptyState>
            ) : (
              <AppointmentList>
                {futureAppointments.slice(0, 12).map((appointment) => (
                  <AppointmentRow key={appointment.id}>
                    <AppointmentBadge tone="future">
                      <FiCalendar />
                    </AppointmentBadge>
                    <AppointmentInfo>
                      <strong>{formatDate(appointment.date)}</strong>
                      <span>{formatTime(appointment.date)}</span>
                    </AppointmentInfo>
                    <FiArrowRight color="#a0aec0" />
                  </AppointmentRow>
                ))}
              </AppointmentList>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Últimas presenças</h2>
                <p>Histórico recente.</p>
              </PanelTitleWrap>
            </PanelHeader>

            {loadingAppointments ? (
              <EmptyState>Carregando...</EmptyState>
            ) : pastAppointments.length === 0 ? (
              <EmptyState>Sem histórico anterior.</EmptyState>
            ) : (
              <AppointmentList>
                {pastAppointments.slice(0, 12).map((appointment) => (
                  <AppointmentRow key={appointment.id}>
                    <AppointmentBadge tone="past">
                      <FiClock />
                    </AppointmentBadge>
                    <AppointmentInfo>
                      <strong>{formatDate(appointment.date)}</strong>
                      <span>{formatTime(appointment.date)}</span>
                    </AppointmentInfo>
                  </AppointmentRow>
                ))}
              </AppointmentList>
            )}
          </Panel>
        </Column>
      </Layout>

      {expirationModal.open && (
        <>
          <ModalOverlay
            type="button"
            aria-label="Fechar"
            onClick={closeExpirationModal}
          />
          <ModalCard>
            <h3>
              <FiEdit3
                style={{
                  display: 'inline',
                  marginRight: 8,
                  verticalAlign: '-3px',
                  color: '#ff9000',
                }}
              />
              Editar vigência
            </h3>
            <p>
              Cliente: <strong>{user?.name}</strong>
            </p>
            <Input
              type="date"
              value={expirationModal.date}
              onChange={(e) =>
                setExpirationModal({ ...expirationModal, date: e.target.value })
              }
            />
            <ModalActions>
              <ModalButton
                type="button"
                variant="ghost"
                onClick={closeExpirationModal}
                disabled={savingExpiration}
              >
                Cancelar
              </ModalButton>
              <ModalButton
                type="button"
                variant="primary"
                onClick={saveExpiration}
                disabled={savingExpiration || !expirationModal.date}
              >
                {savingExpiration ? 'Salvando...' : 'Salvar nova data'}
              </ModalButton>
            </ModalActions>
          </ModalCard>
        </>
      )}
    </AdminShell>
  );
};

export default ClientDetail;
