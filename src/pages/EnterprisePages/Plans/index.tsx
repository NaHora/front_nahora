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
  FiAlertTriangle,
  FiArrowRight,
} from 'react-icons/fi';
import { Tooltip } from '@material-ui/core';
import {
  differenceInDays,
  formatDistance,
  getMonth,
  getYear,
  isAfter,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import numeral from 'numeral';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
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
import { routes } from '../../../routes';
import Select from '../../../components/Select';
import Avatar from '../../../components/Avatar';

interface User {
  id: string;
  avatar_url: string;
  name: string;
}

interface Category {
  id: string;
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
  week_limit: number;
  delete_limit: number;
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

interface Restrict {
  id: string;
  plan: Plan;
  category: Category;
}

const Plans: React.FC = () => {
  numeral.locale('pt-br');
  const { socket } = useSocket();
  const history = useHistory();
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );
  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('0');
  const [openSolicitationSection, setOpenSolicitationSection] = useState(true);
  const [openActiveSection, setOpenActiveSection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openRestrict, setOpenRestrict] = useState(false);
  const [openPlanSection, setOpenPlanSection] = useState(true);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    celphone: '',
  });
  const [restrictData, setRestrictData] = useState({
    plan_id: '',
    category_id: '',
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [restricts, setRestricts] = useState<Restrict[]>([]);

  const getRestricts = useCallback(async () => {
    api.get(`/plans/restrict`).then((response) => {
      setRestricts(response.data);
    });
  }, []);

  const getCategories = useCallback(async () => {
    api.get(`/services/category/${myEnterprise.id}`).then((response) => {
      setCategories(response.data);
    });
  }, [myEnterprise.id]);

  useEffect(() => {
    getCategories();
    getRestricts();
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
        week_limit: '',
        delete_limit: '',
        days_to_expire: '',
        type_expiration: 'month',
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

  const deleteRestrict = useCallback(
    async (restrict_id) => {
      try {
        await api.delete(`/plans/restrict/${restrict_id}`);

        toast.addToast({
          type: 'success',
          title: 'Restrição deletado com sucesso.',
        });

        getRestricts();
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao deletar restrição, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao deletar restrição, tente novamente',
          });
        }
      }
    },
    [toast, getRestricts],
  );

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
              'Ocorreu um erro ao deletar o plano, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao deletar o plano, tente novamente',
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

  const createRestriction = useCallback(async () => {
    const { category_id, plan_id } = restrictData;
    try {
      const body = {
        category_id,
        plan_id,
      };

      await api.post('/plans/restrict', body);
      getRestricts();
      toast.addToast({
        type: 'success',
        title: 'Plano restringido com sucesso.',
      });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao restringir o plano, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao restringir o plano, tente novamente',
        });
      }
    }
  }, [toast, restrictData, getRestricts]);

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
                Convidar
              </span>
            </header>
            {openInvite && (
              <div
                style={{
                  margin: '24px 0',
                  padding: 16,
                  border: '1px solid #ff9000',
                }}
              >
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
                <div
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <InputDefault
                    maxWidth="300px"
                    icon={FiSearch}
                    name="search"
                    type="text"
                    value={searchValue}
                    placeholder="Filtrar por nome"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                  <Select
                    maxWidth="300px"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    name="selectValue"
                  >
                    <option style={{ background: 'lightblue' }} value="0">
                      Todos
                    </option>
                    <option style={{ background: 'red' }} value="1">
                      Plano expirado
                    </option>
                    <option style={{ background: 'yellow' }} value="2">
                      7 dias para expirar
                    </option>
                    <option style={{ background: 'green' }} value="3">
                      Plano ativo
                    </option>
                  </Select>
                </div>
                <div>
                  {allUsersEnterpriseAccepted &&
                    selectedSolicitation &&
                    allUsersEnterpriseAccepted
                      .filter((invite) => {
                        return selectValue === '1'
                          ? differenceInDays(
                              new Date(
                                invite?.currentPlan?.expiration_at || 2000,
                              ),
                              new Date(),
                            ) < 0
                          : selectValue === '2'
                          ? differenceInDays(
                              new Date(
                                invite?.currentPlan?.expiration_at || 2000,
                              ),
                              new Date(),
                            ) < 7 &&
                            differenceInDays(
                              new Date(
                                invite?.currentPlan?.expiration_at || 2000,
                              ),
                              new Date(),
                            ) >= 0
                          : selectValue === '3'
                          ? differenceInDays(
                              new Date(
                                invite?.currentPlan?.expiration_at || 2000,
                              ),
                              new Date(),
                            ) > 7
                          : invite;
                      })
                      .filter((invite) =>
                        invite.user.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()),
                      )
                      .map((invite) => (
                        <CardSolicitation
                          status={differenceInDays(
                            new Date(
                              invite?.currentPlan?.expiration_at || 2000,
                            ),
                            new Date(),
                          )}
                        >
                          <div>
                            <Avatar
                              name={invite.user.name}
                              isPrivate={false}
                              width={35}
                              height={35}
                              avatarUrl={invite.user.avatar_url}
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
                            {invite.currentPlan ? (
                              isAfter(
                                new Date(invite.currentPlan?.expiration_at),
                                new Date(),
                              ) ? (
                                formatDistance(
                                  new Date(invite.currentPlan?.expiration_at),
                                  new Date(),
                                  { addSuffix: true, locale: ptBR },
                                )
                              ) : (
                                <>
                                  Expirou{' '}
                                  {formatDistance(
                                    new Date(invite.currentPlan?.expiration_at),
                                    new Date(),
                                    { addSuffix: true, locale: ptBR },
                                  )}
                                </>
                              )
                            ) : (
                              'usuário sem plano'
                            )}
                          </main>
                          {invite.currentPlan &&
                            isAfter(
                              new Date(invite.currentPlan.expiration_at),
                              new Date(),
                            ) && (
                              <span
                                onClick={() =>
                                  history.push(
                                    `${routes.clientDetailNoParams}/${invite.user.id}`,
                                  )
                                }
                                style={{
                                  color: '#ff9000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                <FiPlus
                                  style={{ marginRight: '4px' }}
                                  cursor="pointer"
                                  size={20}
                                  color="#ff9000"
                                />
                                detalhes
                              </span>
                            )}
                        </CardSolicitation>
                      ))}
                </div>
              </>
            )}
          </ActiveSection>
          {/* <CardSolicitation>
            Ganho total este mês: R${numeral(totalMoney).format('0,0.00')}
          </CardSolicitation> */}

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
                        <div style={{ justifyContent: 'space-between' }}>
                          <div
                            style={{
                              display: 'flex',
                              width: '100%',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar
                              name={solicitation.user.name}
                              isPrivate={false}
                              width={35}
                              height={35}
                              avatarUrl={solicitation.user.avatar_url}
                            />

                            <span>{solicitation.user.name}</span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              width: '70px',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                            }}
                          >
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
            <header>
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
              <span
                onClick={() => setOpenRestrict(!openRestrict)}
                style={{ color: '#ff9000' }}
              >
                <FiPlus
                  style={{ marginRight: '8px' }}
                  cursor="pointer"
                  size={20}
                  color="#ff9000"
                />
                Restrição
              </span>
            </header>
            {openRestrict && (
              <div
                style={{
                  margin: '24px 0',
                  padding: 16,
                  border: '1px solid #ff9000',
                }}
              >
                <label>
                  Plano
                  <select
                    value={restrictData.plan_id}
                    onChange={(e) =>
                      setRestrictData({
                        ...restrictData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="plan_id"
                  >
                    {' '}
                    <option value="">-</option>
                    {enterprisePlans.map((plan) => {
                      return (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  Serviço
                  <select
                    value={restrictData.category_id}
                    onChange={(e) =>
                      setRestrictData({
                        ...restrictData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="category_id"
                  >
                    <option value="">-</option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <Button loading={loading} onClick={createRestriction}>
                  Restringir
                </Button>
              </div>
            )}
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
                      <Tooltip
                        placement="top"
                        title="Quantidade de vezes por semana que o usuário poderá realizar agendamentos"
                      >
                        <th>
                          Limite <br /> semanal
                        </th>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        title="Quantidade de vezes até o plano expirar que o usuário poderá cancelar agendamentos"
                      >
                        <th>
                          Limite de
                          <br /> cancelamentos
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
                        <input
                          value={planData.week_limit}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          name="week_limit"
                          placeholder="Limite Semanal"
                          type="number"
                        />
                      </td>
                      <td>
                        <input
                          value={planData.delete_limit}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          name="delete_limit"
                          placeholder="Limite de Cancelamento"
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
                            <td>{plan.week_limit}</td>
                            <td>{plan.delete_limit}</td>
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
                Restrições de planos:
                <br />
                {restricts.length > 0 ? (
                  restricts.map((restrict) => (
                    <CardSolicitation>
                      <div>
                        <FiAlertTriangle />
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span>{restrict.plan.name}</span>
                          <FiArrowRight style={{ margin: '0 8px' }} />
                          <span>{restrict.category.name}</span>
                        </div>
                        <FiX
                          color="#fc384c"
                          onClick={() => deleteRestrict(restrict.id)}
                          cursor="pointer"
                          size={25}
                        />
                      </div>
                    </CardSolicitation>
                  ))
                ) : (
                  <span>Nenhum plano com restrição</span>
                )}
              </div>
            )}
          </PlanSection>
        </Content>
      </div>
    </Container>
  );
};

export default Plans;
