import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiMail,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
import AdminShell from '../../../components/AdminShell';
import {
  HeroAction,
  Metrics,
  MetricCard,
  Grid,
  Column,
  SectionCard,
  SectionHeader,
  SectionTitleWrap,
  HeaderAction,
  FiltersRow,
  FormPanel,
  InlineGrid,
  CustomersList,
  CustomerCard,
  CustomerTop,
  CustomerIdentity,
  CustomerActions,
  ActionIconButton,
  CustomerMeta,
  MetaBox,
  PlanControls,
  NativeSelect,
  DetailLink,
  SolicitationCard,
  SolicitationIdentity,
  SmallMeta,
  SmallMetaPill,
  EmptyState,
  StatusBadge,
} from './styles';
import { differenceInDays, format } from 'date-fns';
import InputDefault from '../../../components/InputDefault';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import { useSocket } from '../../../hooks/socket';
import Button from '../../../components/Button';
import { routes } from '../../../routes';
import Avatar from '../../../components/Avatar';
import DialogModal from '../../../components/DialogModal';
import { removeMask } from '../../../utils';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
}

interface Solicitation {
  id: string;
  user: User;
}

interface Invite {
  id: string;
  user: User;
  accepted: number;
  currentPlan?: UserPlan;
}

interface UserPlan {
  id: string;
  expiration_at: Date | string;
  plan_id: string;
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

const Plans: React.FC = () => {
  const { socket } = useSocket();
  const history = useHistory();
  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [openInvite, setOpenInvite] = useState(true);
  const [currentInviteId, setCurrentInviteId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    celphone: '',
  });
  const [allUsersEnterpriseAccepted, setAllUsersEnterpriseAccepted] = useState<
    Invite[]
  >([]);
  const [enterprisePlans, setEnterprisePlans] = useState<Plan[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [selectedSolicitation, setSelectionSolicitation] = useState<{
    [key: string]: string;
  }>({});

  const getSolicitations = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise-invites');
      setSolicitations(response.data);
    } catch {}
  }, []);

  const getAllEnterpriseAcceptedInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');
      const planSelections = response.data.reduce((acc, invite: Invite) => {
        acc[invite.user.id] = invite.currentPlan ? invite.currentPlan.plan_id : '';
        return acc;
      }, {});
      setSelectionSolicitation(planSelections);
      setAllUsersEnterpriseAccepted(response.data);
    } catch {}
  }, []);

  const getEnterprisePlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setEnterprisePlans(response.data);
    } catch {}
  }, []);

  const acceptUser = useCallback(
    async (invite_id) => {
      try {
        await api.put('/invites/accept', {
          invite_id,
        });
        toast.addToast({
          type: 'success',
          title:
            'Solicitação aceita. A cobertura pode ser configurada em Gestão de planos.',
        });
        getAllEnterpriseAcceptedInvites();
        getSolicitations();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao aceitar a solicitação',
        });
      }
    },
    [toast, getSolicitations, getAllEnterpriseAcceptedInvites],
  );

  const inviteUser = useCallback(async () => {
    setLoading(true);
    try {
      await api.post('/invites/new-user', inviteData);
      toast.addToast({
        type: 'success',
        title: 'Convite enviado com sucesso.',
      });
      getAllEnterpriseAcceptedInvites();
      setInviteData({
        name: '',
        email: '',
        celphone: '',
      });
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao enviar o convite, tente novamente',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, getAllEnterpriseAcceptedInvites, inviteData]);

  const recuseInvite = useCallback(
    async (invite_id) => {
      try {
        await api.delete(`/invites/${invite_id}`);
        toast.addToast({
          type: 'success',
          title: 'Cliente removido com sucesso.',
        });
        getAllEnterpriseAcceptedInvites();
        getSolicitations();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao remover este cliente',
        });
      }
    },
    [toast, getSolicitations, getAllEnterpriseAcceptedInvites],
  );

  const activeUserPlan = useCallback(
    async (user_id, plan_id) => {
      try {
        await api.post('/plans/active', {
          recipient_id: user_id,
          plan_id,
        });
        getAllEnterpriseAcceptedInvites();
        toast.addToast({
          type: 'success',
          title: 'Plano ativado com sucesso.',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao ativar o plano, tente novamente',
        });
      }
    },
    [toast, getAllEnterpriseAcceptedInvites],
  );

  const cancelUserPlan = useCallback(
    async (active_plan_id) => {
      try {
        await api.put(`/plans/${active_plan_id}/cancel`);
        getAllEnterpriseAcceptedInvites();
        toast.addToast({
          type: 'success',
          title: 'Plano cancelado com sucesso.',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao cancelar o plano',
        });
      }
    },
    [toast, getAllEnterpriseAcceptedInvites],
  );

  useEffect(() => {
    socket.on('solicitation', () => {
      getSolicitations();
    });
  }, [socket, getSolicitations]);

  useEffect(() => {
    Promise.all([
      getSolicitations(),
      getAllEnterpriseAcceptedInvites(),
      getEnterprisePlans(),
    ]);
  }, [getSolicitations, getAllEnterpriseAcceptedInvites, getEnterprisePlans]);

  const filteredCustomers = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) =>
      invite.user.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [allUsersEnterpriseAccepted, searchValue]);

  const customersWithPhoneCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => !!invite.user.celphone)
      .length;
  }, [allUsersEnterpriseAccepted]);

  const activePlansCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => invite.currentPlan).length;
  }, [allUsersEnterpriseAccepted]);

  const expiringPlansCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => {
      if (!invite.currentPlan) return false;
      const days = differenceInDays(
        new Date(invite.currentPlan.expiration_at),
        new Date(),
      );
      return days >= 0 && days < 7;
    }).length;
  }, [allUsersEnterpriseAccepted]);

  return (
    <AdminShell
      eyebrow="Base privada"
      title="Gestão de clientes"
      description="Centralize convites, aprovações e relacionamento com a carteira sem misturar catálogo e regras de plano."
      actions={
        <HeroAction type="button" onClick={() => setOpenInvite(true)}>
          <FiPlus />
          Novo convite
        </HeroAction>
      }
    >
      <DialogModal
        text="Ao confirmar, este usuário deixará de seguir sua empresa."
        title="Tem certeza que deseja excluir este cliente?"
        onSubmit={() => recuseInvite(currentInviteId)}
        setOpenModal={setOpenDialog}
        openModal={openDialog}
      />

      <Metrics>
        <MetricCard>
          <strong>{allUsersEnterpriseAccepted.length}</strong>
          <span>Clientes vinculados</span>
        </MetricCard>
        <MetricCard>
          <strong>{solicitations.length}</strong>
          <span>Solicitações pendentes</span>
        </MetricCard>
        <MetricCard>
          <strong>{customersWithPhoneCount}</strong>
          <span>Contatos com WhatsApp</span>
        </MetricCard>
        <MetricCard>
          <strong>{activePlansCount}</strong>
          <span>Clientes com plano ativo</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Clientes ativos</h2>
                <p>
                  Consulte a base privada, acesse detalhes do cliente e defina o
                  plano no mesmo contexto da pessoa.
                </p>
              </SectionTitleWrap>
              <HeaderAction
                type="button"
                onClick={() => history.push(routes.plan)}
              >
                <FiArrowRight />
                Gestão de planos
              </HeaderAction>
            </SectionHeader>

            <FiltersRow style={{ gridTemplateColumns: '1fr' }}>
              <InputDefault
                icon={FiSearch}
                name="search"
                type="text"
                value={searchValue}
                placeholder="Filtrar por nome"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </FiltersRow>

            <CustomersList>
              {filteredCustomers.map((invite) => (
                <CustomerCard key={invite.id}>
                  <CustomerTop>
                    <CustomerIdentity>
                      <Avatar
                        name={invite.user.name}
                        isPrivate={false}
                        width={46}
                        height={46}
                        avatarUrl={invite.user.avatar_url}
                      />
                      <div>
                        <h3>{invite.user.name}</h3>
                        <StatusBadge tone="none">Cliente vinculado</StatusBadge>
                      </div>
                    </CustomerIdentity>

                    <CustomerActions>
                      <ActionIconButton
                        type="button"
                        variant="danger"
                        onClick={() => {
                          setOpenDialog(true);
                          setCurrentInviteId(invite.id);
                        }}
                      >
                        <FiTrash2 />
                      </ActionIconButton>
                    </CustomerActions>
                  </CustomerTop>

                  <SmallMeta>
                    <SmallMetaPill>
                      <FiUsers />
                      Base privada
                    </SmallMetaPill>
                    <SmallMetaPill>
                      <FiClock />
                      {invite.currentPlan
                        ? enterprisePlans.find(
                            (plan) => plan.id === invite.currentPlan?.plan_id,
                          )?.name || 'Plano ativo'
                        : 'Sem plano'}
                    </SmallMetaPill>
                    {invite.user.celphone && (
                      <SmallMetaPill>
                        <FiPhone />
                        {invite.user.celphone}
                      </SmallMetaPill>
                    )}
                  </SmallMeta>

                  <CustomerMeta>
                    <MetaBox>
                      <span>Plano do cliente</span>
                      <PlanControls>
                        <NativeSelect
                          onChange={(e) =>
                            setSelectionSolicitation({
                              ...selectedSolicitation,
                              [invite.user.id]: e.target.value,
                            })
                          }
                          value={selectedSolicitation[invite.user.id] || ''}
                        >
                          <option value="">Selecionar plano</option>
                          {enterprisePlans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                        </NativeSelect>

                        <ActionIconButton
                          type="button"
                          variant="success"
                          onClick={() =>
                            selectedSolicitation[invite.user.id] &&
                            activeUserPlan(
                              invite.user.id,
                              selectedSolicitation[invite.user.id],
                            )
                          }
                        >
                          <FiCheck />
                        </ActionIconButton>

                        <ActionIconButton
                          type="button"
                          variant="danger"
                          onClick={() =>
                            invite.currentPlan && cancelUserPlan(invite.currentPlan.id)
                          }
                        >
                          <FiX />
                        </ActionIconButton>
                      </PlanControls>
                    </MetaBox>

                    <MetaBox>
                      <span>Vigência atual</span>
                      {invite.currentPlan ? (
                        <>
                          <strong>
                            {format(
                              new Date(invite.currentPlan.expiration_at),
                              'dd/MM/yyyy',
                            )}
                          </strong>
                          {differenceInDays(
                            new Date(invite.currentPlan.expiration_at),
                            new Date(),
                          ) < 7 && (
                            <div style={{ marginTop: 8, color: '#9a6200' }}>
                              Expira em breve
                            </div>
                          )}
                        </>
                      ) : (
                        <strong>Sem cobertura ativa</strong>
                      )}
                    </MetaBox>

                    <MetaBox>
                      <span>WhatsApp</span>
                      {invite.user.celphone ? (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`https://api.whatsapp.com/send?phone=55${removeMask(
                            invite.user.celphone,
                          )}`}
                        >
                          {invite.user.celphone}
                        </a>
                      ) : (
                        <strong>Telefone não informado</strong>
                      )}
                    </MetaBox>

                  </CustomerMeta>

                  <DetailLink
                    type="button"
                    onClick={() =>
                      history.push(
                        `${routes.clientDetailNoParams}/${invite.user.id}`,
                      )
                    }
                  >
                    <FiArrowRight />
                    Abrir ficha completa
                  </DetailLink>
                </CustomerCard>
              ))}

              {filteredCustomers.length === 0 && (
                <EmptyState>Nenhum cliente encontrado para esse filtro.</EmptyState>
              )}
            </CustomersList>
          </SectionCard>
        </Column>

        <Column>
          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Convite rápido</h2>
                <p>Adicione um cliente novo manualmente com os dados essenciais.</p>
              </SectionTitleWrap>
              <HeaderAction type="button" onClick={() => setOpenInvite(!openInvite)}>
                <FiPlus />
                {openInvite ? 'Recolher' : 'Expandir'}
              </HeaderAction>
            </SectionHeader>

            {openInvite && (
              <FormPanel>
                <InlineGrid>
                  <InputDefault
                    icon={FiUser}
                    name="name"
                    type="text"
                    value={inviteData.name}
                    onChange={(e) =>
                      setInviteData({
                        ...inviteData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Nome"
                  />
                  <NumberFormat
                    customInput={InputDefault}
                    icon={FiPhone}
                    type="text"
                    format="(##) #####-####"
                    value={inviteData.celphone}
                    name="celphone"
                    mask="_"
                    placeholder="Telefone"
                    onValueChange={(text) =>
                      setInviteData({
                        ...inviteData,
                        celphone: text.value,
                      })
                    }
                  />
                </InlineGrid>

                <InputDefault
                  value={inviteData.email}
                  icon={FiMail}
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  onChange={(e) =>
                    setInviteData({
                      ...inviteData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />

                <Button loading={loading} onClick={inviteUser}>
                  Enviar convite
                </Button>
              </FormPanel>
            )}
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Solicitações</h2>
                <p>Revise rapidamente quem pediu acesso à sua operação.</p>
              </SectionTitleWrap>
            </SectionHeader>

            {solicitations.length > 0 ? (
              solicitations.map((solicitation) => (
                <SolicitationCard key={solicitation.id}>
                  <SolicitationIdentity>
                    <Avatar
                      name={solicitation.user.name}
                      isPrivate={false}
                      width={42}
                      height={42}
                      avatarUrl={solicitation.user.avatar_url}
                    />
                    <strong>{solicitation.user.name}</strong>
                  </SolicitationIdentity>

                  <CustomerActions>
                    <ActionIconButton
                      type="button"
                      variant="success"
                      onClick={() => acceptUser(solicitation.id)}
                    >
                      <FiCheck />
                    </ActionIconButton>
                    <ActionIconButton
                      type="button"
                      variant="danger"
                      onClick={() => recuseInvite(solicitation.id)}
                    >
                      <FiX />
                    </ActionIconButton>
                  </CustomerActions>
                </SolicitationCard>
              ))
            ) : (
              <EmptyState>Nenhuma solicitação encontrada.</EmptyState>
            )}
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Governança de planos</h2>
                <p>
                  Catálogo e restrições agora vivem em uma área dedicada.
                </p>
              </SectionTitleWrap>
            </SectionHeader>

            <FormPanel>
              <Button onClick={() => history.push(routes.plan)}>
                Abrir gestão de planos
              </Button>
            </FormPanel>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Alertas de vigência</h2>
                <p>Resumo rápido dos clientes que exigem atenção comercial.</p>
              </SectionTitleWrap>
            </SectionHeader>

            <FormPanel>
              <div style={{ color: '#0c1729', fontWeight: 700 }}>
                {expiringPlansCount} cliente(s) com plano vencendo nos próximos 7 dias.
              </div>
            </FormPanel>
          </SectionCard>
        </Column>
      </Grid>
    </AdminShell>
  );
};

export default Plans;
