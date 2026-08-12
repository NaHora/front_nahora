import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiMail,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import NumberFormat from 'react-number-format';
import { differenceInDays, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import AdminShell from '../../components/AdminShell';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import DialogModal from '../../components/DialogModal';
import InputDefault from '../../components/InputDefault';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { routes } from '../../routes';
import { removeMask } from '../../utils';
import {
  AlertCard,
  ClientActions,
  ClientBottom,
  ClientCard,
  ClientInfo,
  ClientList,
  ClientMeta,
  Column,
  DetailLink,
  EmptyState,
  FilterChip,
  FilterChips,
  HeroAction,
  IconButton,
  InviteForm,
  InviteGrid,
  Layout,
  MetaPill,
  MetricCard,
  MetricEyebrow,
  Metrics,
  ModalActions,
  ModalButton,
  ModalCard,
  ModalDateInput,
  ModalOverlay,
  NativeSelect,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PlanControls,
  SearchRow,
  SolicitationCard,
  SolicitationInfo,
  SolicitationList,
} from './styles';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  schedule_limit: number;
}

interface UserPlan {
  id: string;
  expiration_at: Date | string;
  plan_id: string;
}

interface Invite {
  id: string;
  user: User;
  accepted: number;
  currentPlan?: UserPlan;
}

type FilterKey = 'all' | 'active' | 'noPlan' | 'expiring';

const AdminClients: React.FC = () => {
  const history = useHistory();
  const toast = useToast();
  const { socket } = useSocket();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState<Invite[]>([]);
  const [solicitations, setSolicitations] = useState<Invite[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planSelection, setPlanSelection] = useState<{ [key: string]: string }>({});
  const [invite, setInvite] = useState({ name: '', email: '', celphone: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteToDelete, setInviteToDelete] = useState<string | null>(null);
  const [expirationEdit, setExpirationEdit] = useState<{
    invite: Invite | null;
    date: string;
  }>({ invite: null, date: '' });
  const [savingExpiration, setSavingExpiration] = useState(false);

  const loadAccepted = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');
      const list: Invite[] = response.data || [];
      const selections = list.reduce<{ [key: string]: string }>((acc, item) => {
        acc[item.user.id] = item.currentPlan ? item.currentPlan.plan_id : '';
        return acc;
      }, {});
      setPlanSelection(selections);
      setAccepted(list);
    } catch {}
  }, []);

  const loadSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data || []);
    } catch {}
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    loadAccepted();
    loadSolicitations();
    loadPlans();
  }, [loadAccepted, loadSolicitations, loadPlans]);

  useEffect(() => {
    socket.on('solicitation', () => {
      loadSolicitations();
    });
  }, [socket, loadSolicitations]);

  const sendInvite = useCallback(async () => {
    if (!invite.name?.trim() || !invite.email?.trim()) {
      toast.addToast({
        type: 'error',
        title: 'Preencha nome e e-mail para enviar o convite.',
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/invites/new-user', invite);
      toast.addToast({ type: 'success', title: 'Convite enviado.' });
      setInvite({ name: '', email: '', celphone: '' });
      loadAccepted();
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao enviar convite.',
      });
    } finally {
      setLoading(false);
    }
  }, [invite, loadAccepted, toast]);

  const acceptSolicitation = useCallback(
    async (inviteId: string) => {
      try {
        await api.put('/invites/accept', { invite_id: inviteId });
        toast.addToast({ type: 'success', title: 'Solicitação aceita.' });
        loadAccepted();
        loadSolicitations();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err?.response?.data?.message ||
            'Erro ao aceitar solicitação.',
        });
      }
    },
    [loadAccepted, loadSolicitations, toast],
  );

  const removeInvite = useCallback(
    async (inviteId: string) => {
      try {
        await api.delete(`/invites/${inviteId}`);
        toast.addToast({ type: 'success', title: 'Cliente removido.' });
        loadAccepted();
        loadSolicitations();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title: err?.response?.data?.message || 'Erro ao remover cliente.',
        });
      }
    },
    [loadAccepted, loadSolicitations, toast],
  );

  const activatePlan = useCallback(
    async (userId: string, planId: string) => {
      if (!planId) {
        toast.addToast({
          type: 'error',
          title: 'Selecione um plano antes de ativar.',
        });
        return;
      }
      try {
        await api.post('/plans/active', {
          recipient_id: userId,
          plan_id: planId,
        });
        toast.addToast({ type: 'success', title: 'Plano ativado.' });
        loadAccepted();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title: err?.response?.data?.message || 'Erro ao ativar plano.',
        });
      }
    },
    [loadAccepted, toast],
  );

  const openExpirationEdit = useCallback((invite: Invite) => {
    if (!invite.currentPlan) return;
    const raw = new Date(invite.currentPlan.expiration_at);
    const iso = Number.isNaN(raw.getTime())
      ? ''
      : format(raw, 'yyyy-MM-dd');
    setExpirationEdit({ invite, date: iso });
  }, []);

  const closeExpirationEdit = useCallback(() => {
    if (savingExpiration) return;
    setExpirationEdit({ invite: null, date: '' });
  }, [savingExpiration]);

  const saveExpiration = useCallback(async () => {
    if (!expirationEdit.invite?.currentPlan?.id || !expirationEdit.date) {
      toast.addToast({
        type: 'error',
        title: 'Escolha uma data válida.',
      });
      return;
    }
    setSavingExpiration(true);
    try {
      await api.put('/plans/expiration', {
        user_plan_id: expirationEdit.invite.currentPlan.id,
        expiration_at: expirationEdit.date,
      });
      toast.addToast({ type: 'success', title: 'Vigência atualizada.' });
      setExpirationEdit({ invite: null, date: '' });
      loadAccepted();
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
  }, [expirationEdit, loadAccepted, toast]);

  const cancelPlan = useCallback(
    async (activePlanId: string) => {
      try {
        await api.put(`/plans/${activePlanId}/cancel`);
        toast.addToast({ type: 'success', title: 'Plano cancelado.' });
        loadAccepted();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title: err?.response?.data?.message || 'Erro ao cancelar plano.',
        });
      }
    },
    [loadAccepted, toast],
  );

  const withPlanCount = useMemo(
    () => accepted.filter((item) => item.currentPlan).length,
    [accepted],
  );

  const expiringCount = useMemo(
    () =>
      accepted.filter((item) => {
        if (!item.currentPlan) return false;
        const days = differenceInDays(
          new Date(item.currentPlan.expiration_at),
          new Date(),
        );
        return days >= 0 && days < 7;
      }).length,
    [accepted],
  );

  const filteredClients = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return accepted.filter((item) => {
      if (normalized && !item.user.name.toLowerCase().includes(normalized)) {
        return false;
      }
      if (filter === 'active') return !!item.currentPlan;
      if (filter === 'noPlan') return !item.currentPlan;
      if (filter === 'expiring') {
        if (!item.currentPlan) return false;
        const days = differenceInDays(
          new Date(item.currentPlan.expiration_at),
          new Date(),
        );
        return days >= 0 && days < 7;
      }
      return true;
    });
  }, [accepted, filter, search]);

  const getPlanName = (planId?: string) =>
    plans.find((plan) => plan.id === planId)?.name;

  const getExpirationStatus = (invitePlan?: UserPlan) => {
    if (!invitePlan) return null;
    const days = differenceInDays(
      new Date(invitePlan.expiration_at),
      new Date(),
    );
    if (days < 0) return { tone: 'danger' as const, label: 'Plano vencido' };
    if (days < 7)
      return { tone: 'warn' as const, label: `Expira em ${days} dia(s)` };
    return null;
  };

  return (
    <AdminShell
      eyebrow="Base de clientes"
      title="Painel de clientes"
      description="Consulte, convide e ajuste os planos da sua base sem alternar entre telas."
      actions={
        <HeroAction
          type="button"
          onClick={() =>
            document
              .getElementById('painel-clientes-convite')
              ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        >
          <FiPlus /> Novo convite
        </HeroAction>
      }
    >
      <DialogModal
        text="Ao confirmar, este usuário deixará de seguir sua empresa."
        title="Remover este cliente?"
        onSubmit={() => inviteToDelete && removeInvite(inviteToDelete)}
        setOpenModal={setOpenDialog}
        openModal={openDialog}
      />

      <Metrics>
        <MetricCard>
          <MetricEyebrow>
            <FiUsers /> Clientes ativos
          </MetricEyebrow>
          <strong>{accepted.length}</strong>
          <span>Base com convite aceito.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiUserPlus /> Solicitações
          </MetricEyebrow>
          <strong>{solicitations.length}</strong>
          <span>Convites aguardando aprovação.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiCreditCard /> Com plano ativo
          </MetricEyebrow>
          <strong>{withPlanCount}</strong>
          <span>Clientes com cobertura vigente.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiAlertTriangle /> Vencendo em 7 dias
          </MetricEyebrow>
          <strong>{expiringCount}</strong>
          <span>Precisam de renovação em breve.</span>
        </MetricCard>
      </Metrics>

      <Layout>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Clientes vinculados</h2>
                <p>
                  Busque, filtre e ajuste rapidamente o plano de cada cliente.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <SearchRow>
              <InputDefault
                icon={FiSearch}
                name="search"
                type="text"
                value={search}
                placeholder="Filtrar por nome"
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchRow>

            <FilterChips>
              <FilterChip
                type="button"
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                Todos ({accepted.length})
              </FilterChip>
              <FilterChip
                type="button"
                active={filter === 'active'}
                onClick={() => setFilter('active')}
              >
                Com plano ({withPlanCount})
              </FilterChip>
              <FilterChip
                type="button"
                active={filter === 'noPlan'}
                onClick={() => setFilter('noPlan')}
              >
                Sem plano ({accepted.length - withPlanCount})
              </FilterChip>
              <FilterChip
                type="button"
                active={filter === 'expiring'}
                onClick={() => setFilter('expiring')}
              >
                Vencendo ({expiringCount})
              </FilterChip>
            </FilterChips>

            <ClientList>
              {filteredClients.length === 0 && (
                <EmptyState>Nenhum cliente encontrado para esse filtro.</EmptyState>
              )}
              {filteredClients.map((item) => {
                const expiration = getExpirationStatus(item.currentPlan);
                const currentPlanName = item.currentPlan
                  ? getPlanName(item.currentPlan.plan_id) || 'Plano ativo'
                  : null;
                return (
                  <ClientCard key={item.id}>
                    <Avatar
                      name={item.user.name}
                      isPrivate={false}
                      width={46}
                      height={46}
                      avatarUrl={item.user.avatar_url}
                      noMargin
                    />
                    <ClientInfo>
                      <h3>{item.user.name}</h3>
                      <ClientMeta>
                        {currentPlanName ? (
                          <MetaPill tone="accent">
                            <FiCreditCard /> {currentPlanName}
                          </MetaPill>
                        ) : (
                          <MetaPill>
                            <FiCreditCard /> Sem plano
                          </MetaPill>
                        )}
                        {item.currentPlan && (
                          <MetaPill>
                            <FiClock />{' '}
                            {format(
                              new Date(item.currentPlan.expiration_at),
                              'dd/MM/yyyy',
                            )}
                          </MetaPill>
                        )}
                        {expiration && (
                          <MetaPill tone={expiration.tone}>
                            <FiAlertTriangle /> {expiration.label}
                          </MetaPill>
                        )}
                        {item.user.celphone && (
                          <MetaPill>
                            <FiPhone /> {item.user.celphone}
                          </MetaPill>
                        )}
                      </ClientMeta>
                    </ClientInfo>
                    <ClientActions>
                      {item.user.celphone && (
                        <IconButton
                          as="a"
                          href={`https://api.whatsapp.com/send?phone=55${removeMask(
                            item.user.celphone,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir WhatsApp"
                        >
                          <FiPhone />
                        </IconButton>
                      )}
                      <IconButton
                        type="button"
                        variant="danger"
                        title="Remover cliente"
                        onClick={() => {
                          setInviteToDelete(item.id);
                          setOpenDialog(true);
                        }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </ClientActions>

                    <ClientBottom>
                      <PlanControls>
                        <NativeSelect
                          value={planSelection[item.user.id] || ''}
                          onChange={(e) =>
                            setPlanSelection({
                              ...planSelection,
                              [item.user.id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecionar plano</option>
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                        </NativeSelect>
                        <IconButton
                          type="button"
                          variant="success"
                          title="Ativar plano selecionado"
                          onClick={() =>
                            activatePlan(
                              item.user.id,
                              planSelection[item.user.id] || '',
                            )
                          }
                        >
                          <FiCheck />
                        </IconButton>
                        {item.currentPlan && (
                          <>
                            <IconButton
                              type="button"
                              title="Editar data de vigência"
                              onClick={() => openExpirationEdit(item)}
                            >
                              <FiCalendar />
                            </IconButton>
                            <IconButton
                              type="button"
                              variant="danger"
                              title="Cancelar plano atual"
                              onClick={() =>
                                item.currentPlan &&
                                cancelPlan(item.currentPlan.id)
                              }
                            >
                              <FiX />
                            </IconButton>
                          </>
                        )}
                      </PlanControls>
                      <DetailLink
                        type="button"
                        onClick={() =>
                          history.push(
                            `${routes.clientDetailNoParams}/${item.user.id}`,
                          )
                        }
                      >
                        Abrir ficha completa <FiArrowRight />
                      </DetailLink>
                    </ClientBottom>
                  </ClientCard>
                );
              })}
            </ClientList>
          </Panel>
        </Column>

        <Column>
          <Panel id="painel-clientes-convite">
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Convite rápido</h2>
                <p>Adicione um cliente novo com nome, telefone e e-mail.</p>
              </PanelTitleWrap>
            </PanelHeader>
            <InviteForm>
              <InviteGrid>
                <InputDefault
                  icon={FiUser}
                  name="name"
                  type="text"
                  value={invite.name}
                  onChange={(e) =>
                    setInvite({ ...invite, name: e.target.value })
                  }
                  placeholder="Nome"
                />
                <NumberFormat
                  customInput={InputDefault}
                  icon={FiPhone}
                  type="text"
                  format="(##) #####-####"
                  value={invite.celphone}
                  name="celphone"
                  mask="_"
                  placeholder="Telefone"
                  onValueChange={(value: { value: string }) =>
                    setInvite({ ...invite, celphone: value.value })
                  }
                />
              </InviteGrid>
              <InputDefault
                icon={FiMail}
                name="email"
                type="email"
                value={invite.email}
                onChange={(e) =>
                  setInvite({ ...invite, email: e.target.value })
                }
                placeholder="E-mail"
              />
              <Button loading={loading} onClick={sendInvite}>
                Enviar convite
              </Button>
            </InviteForm>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Solicitações</h2>
                <p>Quem pediu para seguir a sua operação.</p>
              </PanelTitleWrap>
            </PanelHeader>
            {solicitations.length === 0 ? (
              <EmptyState>Sem solicitações no momento.</EmptyState>
            ) : (
              <SolicitationList>
                {solicitations.map((solicitation) => (
                  <SolicitationCard key={solicitation.id}>
                    <Avatar
                      name={solicitation.user.name}
                      isPrivate={false}
                      width={40}
                      height={40}
                      avatarUrl={solicitation.user.avatar_url}
                      noMargin
                    />
                    <SolicitationInfo>
                      <strong>{solicitation.user.name}</strong>
                      {solicitation.user.celphone && (
                        <span>{solicitation.user.celphone}</span>
                      )}
                    </SolicitationInfo>
                    <IconButton
                      type="button"
                      variant="success"
                      title="Aceitar"
                      onClick={() => acceptSolicitation(solicitation.id)}
                    >
                      <FiCheck />
                    </IconButton>
                    <IconButton
                      type="button"
                      variant="danger"
                      title="Recusar"
                      onClick={() => removeInvite(solicitation.id)}
                    >
                      <FiX />
                    </IconButton>
                  </SolicitationCard>
                ))}
              </SolicitationList>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Vencimentos</h2>
                <p>Clientes que precisam de renovação nos próximos 7 dias.</p>
              </PanelTitleWrap>
            </PanelHeader>
            <AlertCard>
              <strong>{expiringCount}</strong>
              <span>
                {expiringCount === 0
                  ? 'Nenhum cliente com plano vencendo em breve.'
                  : expiringCount === 1
                  ? '1 cliente com plano vencendo em até 7 dias.'
                  : `${expiringCount} clientes com plano vencendo em até 7 dias.`}
              </span>
            </AlertCard>
          </Panel>
        </Column>
      </Layout>

      {expirationEdit.invite && (
        <>
          <ModalOverlay
            type="button"
            aria-label="Fechar"
            onClick={closeExpirationEdit}
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
              Cliente: <strong>{expirationEdit.invite.user.name}</strong>
            </p>
            <ModalDateInput
              type="date"
              value={expirationEdit.date}
              onChange={(e) =>
                setExpirationEdit({
                  ...expirationEdit,
                  date: e.target.value,
                })
              }
            />
            <ModalActions>
              <ModalButton
                type="button"
                variant="ghost"
                onClick={closeExpirationEdit}
                disabled={savingExpiration}
              >
                Cancelar
              </ModalButton>
              <ModalButton
                type="button"
                variant="primary"
                onClick={saveExpiration}
                disabled={savingExpiration || !expirationEdit.date}
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

export default AdminClients;
