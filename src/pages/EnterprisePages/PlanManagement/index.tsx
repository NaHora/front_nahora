import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiLayers,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { Tooltip } from '@material-ui/core';
import { differenceInDays, format, formatDistance, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';
import AdminShell from '../../../components/AdminShell';
import InputDefault from '../../../components/InputDefault';
import Button from '../../../components/Button';
import {
  HeroAction,
  Metrics,
  MetricCard,
  Grid,
  Column,
  FullWidth,
  SectionCard,
  SectionHeader,
  SectionTitleWrap,
  HeaderAction,
  FiltersRow,
  FormPanel,
  InlineGrid,
  Label,
  NativeSelect,
  NativeInput,
  CustomersList,
  CustomerCard,
  CustomerTop,
  CustomerIdentity,
  CustomerActions,
  ActionIconButton,
  CustomerMeta,
  MetaBox,
  PlanControls,
  DetailLink,
  SmallMeta,
  SmallMetaPill,
  TableWrap,
  PlansTable,
  RestrictList,
  RestrictCard,
  RestrictInfo,
  EmptyState,
  StatusBadge,
} from '../Plans/styles';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import Select from '../../../components/Select';
import Avatar from '../../../components/Avatar';
import { MdEdit } from 'react-icons/md';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
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

interface UserPlan {
  id: string;
  user: User;
  expiration_at: Date | string;
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

const PlanManagement: React.FC = () => {
  const history = useHistory();
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );
  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [editPlan, setEditPlan] = useState<UserPlan>({} as UserPlan);
  const [selectValue, setSelectValue] = useState('0');
  const [editMode, setEditMode] = useState(false);
  const [openRestrict, setOpenRestrict] = useState(true);
  const [restrictData, setRestrictData] = useState({
    plan_id: '',
    category_id: '',
  });
  const [planData, setPlanData] = useState<any>({
    type_expiration: 'month',
  });
  const [selectedSolicitation, setSelectionSolicitation] = useState<
    SelectSolicitation
  >({});
  const [allUsersEnterpriseAccepted, setAllUsersEnterpriseAccepted] = useState<
    Invite[]
  >([]);
  const [enterprisePlans, setEnterprisePlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restricts, setRestricts] = useState<Restrict[]>([]);

  const getRestricts = useCallback(async () => {
    api.get('/plans/restrict').then((response) => {
      setRestricts(response.data);
    });
  }, []);

  const getCategories = useCallback(async () => {
    api.get(`/services/category/${myEnterprise.id}`).then((response) => {
      setCategories(response.data);
    });
  }, [myEnterprise.id]);

  const getEnterprisePlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setEnterprisePlans(response.data);
    } catch {}
  }, []);

  const getAllEnterpriseAcceptedInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');

      const planSelections = response.data.reduce(
        (acc: SelectSolicitation, invite: Invite) => {
          acc[invite.user.id] = invite.currentPlan ? invite.currentPlan.plan_id : '';
          return acc;
        },
        {},
      );

      setSelectionSolicitation(planSelections);
      setAllUsersEnterpriseAccepted(response.data);
    } catch {}
  }, []);

  useEffect(() => {
    Promise.all([
      getCategories(),
      getRestricts(),
      getEnterprisePlans(),
      getAllEnterpriseAcceptedInvites(),
    ]);
  }, [
    getAllEnterpriseAcceptedInvites,
    getCategories,
    getEnterprisePlans,
    getRestricts,
  ]);

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
      getEnterprisePlans();
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao criar o plano, tente novamente',
      });
    }
  }, [toast, getEnterprisePlans, planData]);

  const deleteRestrict = useCallback(
    async (restrict_id) => {
      try {
        await api.delete(`/plans/restrict/${restrict_id}`);
        toast.addToast({
          type: 'success',
          title: 'Restrição deletada com sucesso.',
        });
        getRestricts();
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao deletar restrição, tente novamente',
        });
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
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao deletar o plano, tente novamente',
        });
      }
    },
    [toast, getEnterprisePlans],
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

  const createRestriction = useCallback(async () => {
    try {
      await api.post('/plans/restrict', restrictData);
      getRestricts();
      setRestrictData({
        plan_id: '',
        category_id: '',
      });
      toast.addToast({
        type: 'success',
        title: 'Plano restringido com sucesso.',
      });
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao restringir o plano, tente novamente',
      });
    }
  }, [toast, restrictData, getRestricts]);

  const changeExpirationDate = useCallback(async () => {
    try {
      await api.put('/plans/expiration', {
        user_plan_id: editPlan.id,
        expiration_at: editPlan.expiration_at,
      });
      getAllEnterpriseAcceptedInvites();
      setEditPlan({} as UserPlan);
      setEditMode(false);
      toast.addToast({
        type: 'success',
        title: 'Expiração do plano atualizada com sucesso.',
      });
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao editar o tempo de expiração do plano',
      });
    }
  }, [toast, getAllEnterpriseAcceptedInvites, editPlan]);

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

  const handleSelectSolicitation = useCallback(
    (user_id, plan_id, current_plan_id) => {
      if (selectedSolicitation[user_id] === 'cancelActivatedPlanNow') {
        cancelUserPlan(current_plan_id);
      } else if (plan_id) {
        activeUserPlan(user_id, plan_id);
      }
    },
    [cancelUserPlan, activeUserPlan, selectedSolicitation],
  );

  const filteredCustomers = useMemo(() => {
    return allUsersEnterpriseAccepted
      .filter((invite) => {
        const days = differenceInDays(
          new Date(invite?.currentPlan?.expiration_at || 2000),
          new Date(),
        );

        if (selectValue === '1') return !invite.currentPlan;
        if (selectValue === '2') return days < 0;
        if (selectValue === '3') return days < 7 && days >= 0;
        if (selectValue === '4') return days >= 7;
        return true;
      })
      .filter((invite) =>
        invite.user.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
  }, [allUsersEnterpriseAccepted, searchValue, selectValue]);

  const activeCustomersCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) =>
      isAfter(new Date(invite?.currentPlan?.expiration_at || 2000), new Date()),
    ).length;
  }, [allUsersEnterpriseAccepted]);

  const expiringSoonCount = useMemo(() => {
    return allUsersEnterpriseAccepted.filter((invite) => {
      if (!invite.currentPlan) return false;
      const days = differenceInDays(
        new Date(invite.currentPlan.expiration_at),
        new Date(),
      );
      return days >= 0 && days < 7;
    }).length;
  }, [allUsersEnterpriseAccepted]);

  const getStatusTone = (
    invite: Invite,
  ): 'expired' | 'warning' | 'active' | 'none' => {
    if (!invite.currentPlan) return 'none';

    const days = differenceInDays(
      new Date(invite.currentPlan.expiration_at),
      new Date(),
    );

    if (days < 0) return 'expired';
    if (days < 7) return 'warning';
    return 'active';
  };

  const getStatusLabel = (invite: Invite): string => {
    if (!invite.currentPlan) return 'Sem plano ativo';

    const days = differenceInDays(
      new Date(invite.currentPlan.expiration_at),
      new Date(),
    );

    if (days < 0) return 'Plano expirado';
    if (days < 7) return 'Expira em breve';
    return 'Plano ativo';
  };

  return (
    <AdminShell
      eyebrow="Oferta privada"
      title="Gestão de planos"
      description="Concentre catálogo e restrições da oferta em uma área própria. A ativação dos planos agora acontece na gestão de clientes."
      actions={
        <HeroAction type="button" onClick={() => setOpenRestrict(true)}>
          <FiPlus />
          Nova restrição
        </HeroAction>
      }
    >
      <Metrics>
        <MetricCard>
          <strong>{enterprisePlans.length}</strong>
          <span>Planos cadastrados</span>
        </MetricCard>
        <MetricCard>
          <strong>{restricts.length}</strong>
          <span>Restrições ativas</span>
        </MetricCard>
        <MetricCard>
          <strong>{activeCustomersCount}</strong>
          <span>Clientes com cobertura ativa</span>
        </MetricCard>
        <MetricCard>
          <strong>{expiringSoonCount}</strong>
          <span>Planos vencendo em 7 dias</span>
        </MetricCard>
      </Metrics>

      <FullWidth>
        <SectionCard>
          <SectionHeader>
            <SectionTitleWrap>
              <h2>Catálogo de planos</h2>
              <p>
                Cadastre, compare e remova ofertas em um bloco único, com leitura
                direta e edição rápida.
              </p>
            </SectionTitleWrap>
          </SectionHeader>

          <TableWrap>
            <PlansTable>
              <thead>
                <tr>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Expiração</th>
                  <th>Agendamentos</th>
                  <th>Semanal</th>
                  <th>Cancelamentos</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <NativeInput
                      name="name"
                      value={planData?.name || ''}
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
                    <NativeInput
                      name="price"
                      value={planData.price || ''}
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
                    <InlineGrid>
                      <NativeInput
                        value={planData.days_to_expire || ''}
                        onChange={(e) =>
                          setPlanData({
                            ...planData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        name="days_to_expire"
                        placeholder="Expiração"
                        type="number"
                      />
                      <NativeSelect
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
                        <option value="year">Ano</option>
                      </NativeSelect>
                    </InlineGrid>
                  </td>
                  <td>
                    <NativeInput
                      name="schedule_limit"
                      value={planData.schedule_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Agendamentos"
                      type="number"
                    />
                  </td>
                  <td>
                    <NativeInput
                      name="week_limit"
                      value={planData.week_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Semanal"
                      type="number"
                    />
                  </td>
                  <td>
                    <NativeInput
                      name="delete_limit"
                      value={planData.delete_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Cancelamentos"
                      type="number"
                    />
                  </td>
                  <td>
                    <ActionIconButton type="button" variant="success" onClick={createPlan}>
                      <FiCheck />
                    </ActionIconButton>
                  </td>
                </tr>

                {enterprisePlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.name}</td>
                    <td>{plan.price}</td>
                    <td>
                      {plan.days_to_expire} {plan.type_expiration}
                    </td>
                    <td>{plan.schedule_limit}</td>
                    <td>{plan.week_limit}</td>
                    <td>{plan.delete_limit}</td>
                    <td>
                      <ActionIconButton
                        type="button"
                        variant="danger"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <FiTrash2 />
                      </ActionIconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </PlansTable>
          </TableWrap>
        </SectionCard>
      </FullWidth>

      <Grid>
        <Column>
          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Operação dos clientes</h2>
                <p>
                  A ativação, cancelamento e leitura de vigência agora ficam na
                  gestão de clientes, junto do contexto de cada pessoa.
                </p>
              </SectionTitleWrap>
              <HeaderAction
                type="button"
                onClick={() => history.push(routes.customers)}
              >
                <FiUsers />
                Gestão de clientes
              </HeaderAction>
            </SectionHeader>

            <FormPanel>
              <Button onClick={() => history.push(routes.customers)}>
                Abrir gestão de clientes
              </Button>
            </FormPanel>
          </SectionCard>
        </Column>

        <Column>
          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Restrições por categoria</h2>
                <p>Controle quais serviços ficam bloqueados conforme o plano.</p>
              </SectionTitleWrap>
              <HeaderAction
                type="button"
                onClick={() => setOpenRestrict(!openRestrict)}
              >
                <FiPlus />
                {openRestrict ? 'Recolher' : 'Nova restrição'}
              </HeaderAction>
            </SectionHeader>

            {openRestrict && (
              <FormPanel>
                <InlineGrid>
                  <Label>
                    Plano
                    <NativeSelect
                      value={restrictData.plan_id}
                      onChange={(e) =>
                        setRestrictData({
                          ...restrictData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="plan_id"
                    >
                      <option value="">Selecione</option>
                      {enterprisePlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Label>

                  <Label>
                    Serviço
                    <NativeSelect
                      value={restrictData.category_id}
                      onChange={(e) =>
                        setRestrictData({
                          ...restrictData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="category_id"
                    >
                      <option value="">Selecione</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Label>
                </InlineGrid>

                <Button onClick={createRestriction}>Salvar restrição</Button>
              </FormPanel>
            )}

            {restricts.length > 0 ? (
              <RestrictList>
                {restricts.map((restrict) => (
                  <RestrictCard key={restrict.id}>
                    <RestrictInfo>
                      <Tooltip title="Relação entre plano e serviço restrito">
                        <span>
                          {restrict.plan.name}
                          <FiArrowRight />
                          {restrict.category.name}
                        </span>
                      </Tooltip>
                    </RestrictInfo>

                    <ActionIconButton
                      type="button"
                      variant="danger"
                      onClick={() => deleteRestrict(restrict.id)}
                    >
                      <FiX />
                    </ActionIconButton>
                  </RestrictCard>
                ))}
              </RestrictList>
            ) : (
              <EmptyState>Nenhum plano com restrição.</EmptyState>
            )}
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitleWrap>
                <h2>Estratégia da oferta</h2>
                <p>
                  Use esta área para manter a arquitetura comercial limpa e a base
                  bem coberta.
                </p>
              </SectionTitleWrap>
            </SectionHeader>

            <FormPanel>
              <Button onClick={() => history.push(routes.customers)}>
                Voltar para gestão de clientes
              </Button>
            </FormPanel>
          </SectionCard>
        </Column>
      </Grid>
    </AdminShell>
  );
};

export default PlanManagement;
