import React, { useState, useCallback, useEffect } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiCheck,
  FiX,
  FiPlus,
  FiUser,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import { Tooltip } from '@material-ui/core';
import { formatDistance, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import numeral from 'numeral';
import NumberFormat from 'react-number-format';
import HeaderMenu from '../../../components/Header';
import {
  Container,
  MenuTitles,
  Content,
  CardSolicitation,
  SolicitationSection,
  ActiveSection,
  PlanSection,
  Span,
} from './styles';

import InputDefault from '../../../components/InputDefault';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import 'numeral/locales/pt-br';
import { useSocket } from '../../../hooks/socket';
import Button from '../../../components/Button';

interface User {
  id: string;
  avatar_url: string;
  name: string;
}

interface SelectSolicitation {
  [key: string]: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  schedule_limit: number;
  days_to_expire: number;
  type_expiration: string;
}

interface Solicitation {
  id: string;
  user: User;
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

const Plans: React.FC = () => {
  numeral.locale('pt-br');
  const { socket } = useSocket();

  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [openSolicitationSection, setOpenSolicitationSection] = useState(true);
  const [openActiveSection, setOpenActiveSection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openPlanSection, setOpenPlanSection] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    celphone: '',
  });
  const [planData, setPlanData] = useState<Plan | any>({
    type_expiration: 'month',
  });
  // const [totalMoney, setTotalMoney] = useState(0);

  const [selectedSolicitation, setSelectionSolicitation] = useState<
    SelectSolicitation
  >({});
  const [allUsersEnterpriseAccepted, setAllUsersEnterpriseAccepted] = useState<
    Invite[]
  >([]);
  const [enterprisePlans, setEnterprisePlans] = useState<Plan[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

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

  const getAllEnterpriseAcceptedInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');

      response.data.forEach((invite: any) => {
        return Object.assign(selectedSolicitation, {
          [invite.user.id]: invite.currentPlan
            ? invite.currentPlan.plan_id
            : '',
        });
      });

      setAllUsersEnterpriseAccepted(response.data);
    } catch {}
  }, [selectedSolicitation]);

  // const getTotalMoney = useCallback(async () => {
  //   try {
  //     const response = await api.get(
  //       `/plans/money/month/${getMonth(new Date()) + 1}/year/${getYear(
  //         new Date(),
  //       )}`,
  //     );
  //     setTotalMoney(response.data);
  //   } catch (err) {}
  // }, []);

  // useEffect(() => {
  //   getTotalMoney();
  // }, []);

  const createPlan = useCallback(async () => {
    try {
      await api.post('/plans', planData);

      toast.addToast({
        type: 'success',
        title: 'Plano criado com sucesso.',
      });

      setPlanData({
        name: '',
        price: '',
        schedule_limit: '',
        days_to_expire: '',
      });

      setOpenActiveSection(true);

      getEnterprisePlans();
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao criar o plano, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao criar o plano, tente novamente',
        });
      }
    }
  }, [toast, getEnterprisePlans, planData, setPlanData]);

  const deletePlan = useCallback(
    async (plan_id) => {
      try {
        await api.delete(`/plans/${plan_id}`);

        toast.addToast({
          type: 'success',
          title: 'Plano deletado com sucesso.',
        });

        getEnterprisePlans();
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao criar o plano, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao criar o plano, tente novamente',
          });
        }
      }
    },
    [toast, getEnterprisePlans],
  );

  const activeUserPlan = useCallback(
    async (user_id, plan_id) => {
      try {
        const body = {
          recipient_id: user_id,
          plan_id,
        };

        await api.post('/plans/active', body);
        getAllEnterpriseAcceptedInvites();
        // getTotalMoney();
        toast.addToast({
          type: 'success',
          title: 'Plano ativado com sucesso.',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao ativar o plano, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao ativar o plano, tente novamente',
          });
        }
      }
    },
    [toast, getAllEnterpriseAcceptedInvites],
  );

  const acceptUser = useCallback(
    async (invite_id) => {
      try {
        const body = {
          invite_id,
        };

        await api.put('/invites/accept', body);

        toast.addToast({
          type: 'success',
          title: 'Você aceitou a solicitação, ative um plano para o usuário.',
        });

        if (enterprisePlans.length === 0) {
          setOpenPlanSection(true);
        } else {
          setOpenActiveSection(true);
        }

        getAllEnterpriseAcceptedInvites();
        getSolicitations();
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao procurar empresas, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao procurar os serviços, tente novamente',
          });
        }
      }
    },
    [
      toast,
      getSolicitations,
      getAllEnterpriseAcceptedInvites,
      enterprisePlans.length,
    ],
  );

  const inviteUser = useCallback(async () => {
    setLoading(true);
    try {
      const { name, email, celphone } = inviteData;

      const body = {
        name,
        email,
        celphone,
      };

      await api.post('/invites/new-user', body);

      toast.addToast({
        type: 'success',
        title: 'Convite enviado com sucesso.',
      });

      setOpenActiveSection(true);

      getAllEnterpriseAcceptedInvites();

      setInviteData({
        name: '',
        email: '',
        celphone: '',
      });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao enviar o convite, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao enviar o convite, tente novamente',
        });
      }
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
          title: 'Você recusou a solicitação.',
        });

        getSolicitations();
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao recusar, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao recusar, tente novamente',
          });
        }
      }
    },
    [toast, getSolicitations],
  );

  const cancelUserPlan = useCallback(
    async (active_plan_id) => {
      try {
        await api.put(`/plans/${active_plan_id}/cancel`);
        getAllEnterpriseAcceptedInvites();
        toast.addToast({
          type: 'success',
          title: 'Você cancelou a plano do usuário.',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cancelar o plano, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao cancelar o plano, tente novamente',
          });
        }
      }
    },
    [toast, getAllEnterpriseAcceptedInvites],
  );

  useEffect(() => {
    socket.on('solicitation', (solicitation: Solicitation) => {
      getSolicitations();
    });
  }, [socket, getSolicitations]);

  useEffect(() => {
    Promise.all([
      getEnterprisePlans(),
      getSolicitations(),
      getAllEnterpriseAcceptedInvites(),
    ]);
  }, []);

  const handleSelectSolicitation = useCallback(
    (user_id, plan_id, current_plan_id) => {
      if (selectedSolicitation[user_id] === 'cancelActivatedPlanNow') {
        cancelUserPlan(current_plan_id);
      } else {
        activeUserPlan(user_id, plan_id);
      }
    },
    [cancelUserPlan, activeUserPlan, selectedSolicitation],
  );

  return (
    <Container>
      <HeaderMenu />
      <div>
        <Content>
          {/* <Span
            onClick={() => {
              setOpenPlanSection(false);
              setOpenActiveSection(false);
              setOpenSolicitationSection(true);
            }}
            currentSection={openSolicitationSection}
          >
            Solicitações
          </Span>
          <Span
            onClick={() => {
              setOpenPlanSection(true);
              setOpenActiveSection(false);
              setOpenSolicitationSection(false);
            }}
            currentSection={openPlanSection}
          >
            Planos
          </Span>
          <Span
            onClick={() => {
              setOpenPlanSection(false);
              setOpenActiveSection(true);
              setOpenSolicitationSection(false);
            }}
            currentSection={openActiveSection}
          >
            Usuários
          </Span> */}
          <ActiveSection>
            <header>
              <span onClick={() => setOpenActiveSection(!openActiveSection)}>
                {!openActiveSection ? (
                  <FiChevronDown
                    style={{ marginRight: '8px' }}
                    cursor="pointer"
                    size={20}
                    color="#ff9000"
                  />
                ) : (
                  <FiChevronUp
                    style={{ marginRight: '8px' }}
                    cursor="pointer"
                    size={20}
                    color="#ff9000"
                  />
                )}
                Usuários
              </span>
              <span
                onClick={() => setOpenInvite(!openInvite)}
                style={{ color: '#ff9000' }}
              >
                <FiPlus
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
                Convidar cliente
              </span>
            </header>
            {openInvite && (
              <div style={{ margin: '24px 0', padding: 8 }}>
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
                  // allowLeadingZeros
                  // allowEmptyFormatting
                  mask="_"
                  placeholder="Telefone"
                  onValueChange={(text) =>
                    setInviteData({
                      ...inviteData,
                      celphone: text.value,
                    })
                  }
                />

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
                  Convidar
                </Button>
              </div>
            )}
            {openActiveSection && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <InputDefault
                    icon={FiSearch}
                    name="search"
                    type="text"
                    value={searchValue}
                    placeholder="Filtrar usuários"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                </div>
                <div>
                  {allUsersEnterpriseAccepted &&
                    selectedSolicitation &&
                    allUsersEnterpriseAccepted
                      .filter((invite) =>
                        invite.user.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()),
                      )
                      .map((invite) => (
                        <CardSolicitation>
                          <div>
                            <img
                              src={
                                invite.user.avatar_url ||
                                `https://api.adorable.io/avatars/285/${invite.user.id}.png`
                              }
                              alt=""
                            />
                            <span>{invite.user.name}</span>
                            <select
                              onChange={(e) =>
                                setSelectionSolicitation({
                                  ...selectedSolicitation,
                                  [invite.user.id]: e.target.value,
                                })
                              }
                              name="selectedSolicitation"
                              value={selectedSolicitation[invite.user.id]}
                            >
                              <option value="">-</option>
                              <option value="cancelActivatedPlanNow">
                                Cancelar Plano Atual
                              </option>

                              {enterprisePlans &&
                                enterprisePlans.map((plan) => {
                                  return (
                                    <option value={plan.id}>{plan.name}</option>
                                  );
                                })}
                            </select>

                            <FiCheck
                              onClick={() =>
                                handleSelectSolicitation(
                                  invite.user.id,
                                  selectedSolicitation[invite.user.id],
                                  invite.currentPlan?.id,
                                )
                              }
                              color="#1ec657"
                              cursor="pointer"
                              size={25}
                            />
                          </div>
                          <main>
                            expiração do plano:{' '}
                            {invite.currentPlan
                              ? formatDistance(
                                  new Date(invite.currentPlan?.expiration_at),
                                  new Date(),
                                  { addSuffix: true, locale: ptBR },
                                )
                              : 'usuário sem plano'}
                          </main>
                        </CardSolicitation>
                      ))}
                </div>
              </>
            )}
          </ActiveSection>
          {/* <CardSolicitation>
            Ganho total este mês: R${numeral(totalMoney).format('0,0.00')}
          </CardSolicitation> */}
        </Content>
        <Content>
          <SolicitationSection>
            <span
              onClick={() =>
                setOpenSolicitationSection(!openSolicitationSection)
              }
            >
              {!openSolicitationSection ? (
                <FiChevronDown
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
              ) : (
                <FiChevronUp
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
              )}
              Solicitações
            </span>
            {openSolicitationSection && (
              <div>
                {solicitations && solicitations.length > 0 ? (
                  solicitations.map((solicitation) => {
                    return (
                      <CardSolicitation>
                        <div>
                          <img
                            src={
                              solicitation.user.avatar_url ||
                              `https://api.adorable.io/avatars/285/${solicitation.user.id}.png`
                            }
                            alt=""
                          />
                          <span>{solicitation.user.name}</span>
                        </div>
                        <div>
                          <FiCheck
                            onClick={() => acceptUser(solicitation.id)}
                            color="#1ec657"
                            cursor="pointer"
                            size={25}
                          />
                          <FiX
                            onClick={() => recuseInvite(solicitation.id)}
                            color="#fc384c"
                            cursor="pointer"
                            size={25}
                          />
                        </div>
                      </CardSolicitation>
                    );
                  })
                ) : (
                  <span>Nenhuma solicitação encontrada</span>
                )}
              </div>
            )}
          </SolicitationSection>
          <PlanSection>
            <span onClick={() => setOpenPlanSection(!openPlanSection)}>
              {!openPlanSection ? (
                <FiChevronDown
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
              ) : (
                <FiChevronUp
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
              )}
              Planos
            </span>
            {openPlanSection && (
              <div>
                <CardSolicitation>
                  <table>
                    <tr>
                      <Tooltip
                        placement="top"
                        title="Nome que dará para o plano que está criando"
                      >
                        <th>
                          Nome do <br /> plano
                        </th>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        title="Valor do plano que está criando"
                      >
                        <th>Valor</th>
                      </Tooltip>

                      <Tooltip
                        placement="top"
                        title="Tempo para o plano do usuário expirar"
                      >
                        <th>
                          Tempo de <br /> expiração
                        </th>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        title="Quantidade de vezes no plano que o usuário poderá realizar agendamentos"
                      >
                        <th>
                          Limite de <br /> agendamentos
                        </th>
                      </Tooltip>
                      <th />
                    </tr>

                    <tr>
                      <td>
                        <input
                          name="name"
                          value={planData?.name}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          placeholder="Nome"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          name="price"
                          value={planData.price}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          placeholder="Valor"
                          type="text"
                        />
                      </td>

                      <td>
                        <div style={{ display: 'flex' }}>
                          <input
                            value={planData.days_to_expire}
                            onChange={(e) =>
                              setPlanData({
                                ...planData,
                                [e.target.name]: e.target.value,
                              })
                            }
                            style={{ borderRadius: '5px 0 0 5px' }}
                            name="days_to_expire"
                            placeholder="Expiração"
                            type="number"
                          />
                          <select
                            value={planData.type_expiration}
                            onChange={(e) =>
                              setPlanData({
                                ...planData,
                                [e.target.name]: e.target.value,
                              })
                            }
                            name="type_expiration"
                          >
                            <option value="day">Dia</option>
                            <option value="month">Mês</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <input
                          value={planData.schedule_limit}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          name="schedule_limit"
                          placeholder="Limite"
                          type="number"
                        />
                      </td>
                      <td>
                        <FiCheck
                          color="#1ec657"
                          onClick={createPlan}
                          cursor="pointer"
                          size={25}
                        />
                      </td>
                    </tr>
                    {enterprisePlans &&
                      enterprisePlans.map((plan) => {
                        return (
                          <tr>
                            <td>{plan.name}</td>
                            <td>{plan.price}</td>

                            <td>
                              {plan.days_to_expire}{' '}
                              {plan.type_expiration === 'month' &&
                              plan.days_to_expire === 1
                                ? 'mês'
                                : plan.type_expiration === 'day' &&
                                  plan.days_to_expire === 1
                                ? 'dia'
                                : plan.type_expiration === 'month' &&
                                  plan.days_to_expire !== 1
                                ? 'meses'
                                : 'dias'}
                            </td>
                            <td>{plan.schedule_limit}</td>
                            <td>
                              <FiX
                                color="#fc384c"
                                onClick={() => deletePlan(plan.id)}
                                cursor="pointer"
                                size={25}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </table>
                </CardSolicitation>
              </div>
            )}
          </PlanSection>
        </Content>
      </div>
    </Container>
  );
};

export default Plans;
