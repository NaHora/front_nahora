import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiLayers,
  FiPlus,
  FiRotateCw,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi';
import { differenceInDays, isAfter } from 'date-fns';
import { useHistory } from 'react-router-dom';
import AdminShell from '../../../components/AdminShell';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import {
  Column,
  EmptyState,
  FormPanel,
  HeaderAction,
  HeroAction,
  IconButton,
  InlineGrid,
  InlineGridThree,
  Label,
  Layout,
  MetricCard,
  MetricEyebrow,
  Metrics,
  NativeInput,
  NativeSelect,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PlanCard,
  PlanIdentity,
  PlanList,
  PlanPill,
  PlanPills,
  PrimaryButton,
  RestrictCard,
  RestrictInfo,
  RestrictList,
} from './styles';

interface Category {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  name: string;
  price: number | string;
  schedule_limit: number | string;
  week_limit: number | string;
  delete_limit: number | string;
  days_to_expire: number | string;
  type_expiration: string;
}

interface UserPlan {
  id: string;
  expiration_at: Date | string;
  plan_id: string;
}

interface Invite {
  id: string;
  currentPlan?: UserPlan;
}

interface Restrict {
  id: string;
  plan: Plan;
  category: Category;
}

const emptyPlan = () => ({
  name: '',
  price: '',
  schedule_limit: '',
  week_limit: '',
  delete_limit: '',
  days_to_expire: '',
  type_expiration: 'month',
});

const PlanManagement: React.FC = () => {
  const history = useHistory();
  const toast = useToast();
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restricts, setRestricts] = useState<Restrict[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [openNewPlan, setOpenNewPlan] = useState(false);
  const [planData, setPlanData] = useState<any>(emptyPlan());
  const [restrictData, setRestrictData] = useState({
    plan_id: '',
    category_id: '',
  });

  const loadPlans = useCallback(async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data || []);
    } catch {}
  }, []);

  const loadCategories = useCallback(async () => {
    if (!myEnterprise?.id) return;
    try {
      const response = await api.get(`/services/category/${myEnterprise.id}`);
      setCategories(response.data || []);
    } catch {}
  }, [myEnterprise?.id]);

  const loadRestricts = useCallback(async () => {
    try {
      const response = await api.get('/plans/restrict');
      setRestricts(response.data || []);
    } catch {}
  }, []);

  const loadInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');
      setInvites(response.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    loadPlans();
    loadCategories();
    loadRestricts();
    loadInvites();
  }, [loadPlans, loadCategories, loadRestricts, loadInvites]);

  const createPlan = useCallback(async () => {
    if (!planData.name?.trim()) {
      toast.addToast({ type: 'error', title: 'Informe um nome para o plano.' });
      return;
    }
    setCreatingPlan(true);
    try {
      await api.post('/plans', planData);
      toast.addToast({ type: 'success', title: 'Plano criado.' });
      setPlanData(emptyPlan());
      setOpenNewPlan(false);
      loadPlans();
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao criar o plano.',
      });
    } finally {
      setCreatingPlan(false);
    }
  }, [planData, loadPlans, toast]);

  const deletePlan = useCallback(
    async (planId: string) => {
      try {
        await api.delete(`/plans/${planId}`);
        toast.addToast({ type: 'success', title: 'Plano removido.' });
        loadPlans();
      } catch (err: any) {
        toast.addToast({
          type: 'error',
          title: err?.response?.data?.message || 'Erro ao remover plano.',
        });
      }
    },
    [loadPlans, toast],
  );

  const createRestriction = useCallback(async () => {
    if (!restrictData.plan_id || !restrictData.category_id) {
      toast.addToast({
        type: 'error',
        title: 'Escolha o plano e a categoria antes de restringir.',
      });
      return;
    }
    try {
      await api.post('/plans/restrict', restrictData);
      toast.addToast({ type: 'success', title: 'Restrição criada.' });
      setRestrictData({ plan_id: '', category_id: '' });
      loadRestricts();
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao criar restrição.',
      });
    }
  }, [restrictData, loadRestricts, toast]);

  const deleteRestrict = useCallback(
    async (restrictId: string) => {
      try {
        await api.delete(`/plans/restrict/${restrictId}`);
        toast.addToast({ type: 'success', title: 'Restrição removida.' });
        loadRestricts();
      } catch (err: any) {
        toast.addToast({
          type: 'error',
          title:
            err?.response?.data?.message || 'Erro ao remover restrição.',
        });
      }
    },
    [loadRestricts, toast],
  );

  const activeCoverage = useMemo(
    () =>
      invites.filter((invite) =>
        isAfter(
          new Date(invite?.currentPlan?.expiration_at || 2000),
          new Date(),
        ),
      ).length,
    [invites],
  );

  const expiringSoon = useMemo(
    () =>
      invites.filter((invite) => {
        if (!invite.currentPlan) return false;
        const days = differenceInDays(
          new Date(invite.currentPlan.expiration_at),
          new Date(),
        );
        return days >= 0 && days < 7;
      }).length,
    [invites],
  );

  const expirationLabel = (plan: Plan) => {
    const value = Number(plan.days_to_expire) || 0;
    const type = plan.type_expiration;
    const label =
      type === 'day'
        ? value === 1
          ? 'dia'
          : 'dias'
        : type === 'month'
        ? value === 1
          ? 'mês'
          : 'meses'
        : value === 1
        ? 'ano'
        : 'anos';
    return `${value} ${label}`;
  };

  return (
    <AdminShell
      eyebrow="Catálogo"
      title="Gestão de planos"
      description="Crie e mantenha a oferta comercial do seu box. A ativação por cliente acontece em Clientes."
      actions={
        <HeroAction type="button" onClick={() => setOpenNewPlan(true)}>
          <FiPlus /> Novo plano
        </HeroAction>
      }
    >
      <Metrics>
        <MetricCard>
          <MetricEyebrow>
            <FiLayers /> Planos cadastrados
          </MetricEyebrow>
          <strong>{plans.length}</strong>
          <span>Ofertas disponíveis no seu catálogo.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiXCircle /> Restrições ativas
          </MetricEyebrow>
          <strong>{restricts.length}</strong>
          <span>Categorias bloqueadas por plano.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiUsers /> Clientes com cobertura
          </MetricEyebrow>
          <strong>{activeCoverage}</strong>
          <span>Clientes com plano vigente hoje.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiAlertTriangle /> Vencendo em 7 dias
          </MetricEyebrow>
          <strong>{expiringSoon}</strong>
          <span>Renovações que precisam de atenção.</span>
        </MetricCard>
      </Metrics>

      <Layout>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Catálogo de planos</h2>
                <p>
                  Cada plano define preço, tempo de vigência e limites de
                  agendamento.
                </p>
              </PanelTitleWrap>
              <HeaderAction
                type="button"
                variant={openNewPlan ? 'muted' : 'primary'}
                onClick={() => setOpenNewPlan(!openNewPlan)}
              >
                <FiPlus />
                {openNewPlan ? 'Recolher' : 'Novo plano'}
              </HeaderAction>
            </PanelHeader>

            {openNewPlan && (
              <FormPanel>
                <InlineGrid>
                  <Label>
                    <span>Nome</span>
                    <NativeInput
                      name="name"
                      value={planData.name || ''}
                      onChange={(e) =>
                        setPlanData({ ...planData, name: e.target.value })
                      }
                      placeholder="Ex.: Mensal ilimitado"
                    />
                  </Label>
                  <Label>
                    <span>Valor (R$)</span>
                    <NativeInput
                      name="price"
                      type="number"
                      value={planData.price || ''}
                      onChange={(e) =>
                        setPlanData({ ...planData, price: e.target.value })
                      }
                      placeholder="0,00"
                    />
                  </Label>
                </InlineGrid>

                <InlineGrid>
                  <Label>
                    <span>Duração</span>
                    <NativeInput
                      name="days_to_expire"
                      type="number"
                      value={planData.days_to_expire || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          days_to_expire: e.target.value,
                        })
                      }
                      placeholder="Ex.: 30"
                    />
                  </Label>
                  <Label>
                    <span>Unidade</span>
                    <NativeSelect
                      name="type_expiration"
                      value={planData.type_expiration}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          type_expiration: e.target.value,
                        })
                      }
                    >
                      <option value="day">Dias</option>
                      <option value="month">Meses</option>
                      <option value="year">Anos</option>
                    </NativeSelect>
                  </Label>
                </InlineGrid>

                <InlineGridThree>
                  <Label>
                    <span>Agendamentos totais</span>
                    <NativeInput
                      name="schedule_limit"
                      type="number"
                      value={planData.schedule_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          schedule_limit: e.target.value,
                        })
                      }
                      placeholder="Ex.: 20"
                    />
                  </Label>
                  <Label>
                    <span>Limite semanal</span>
                    <NativeInput
                      name="week_limit"
                      type="number"
                      value={planData.week_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          week_limit: e.target.value,
                        })
                      }
                      placeholder="Ex.: 5"
                    />
                  </Label>
                  <Label>
                    <span>Cancelamentos</span>
                    <NativeInput
                      name="delete_limit"
                      type="number"
                      value={planData.delete_limit || ''}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          delete_limit: e.target.value,
                        })
                      }
                      placeholder="Ex.: 3"
                    />
                  </Label>
                </InlineGridThree>

                <PrimaryButton
                  type="button"
                  onClick={createPlan}
                  disabled={creatingPlan}
                >
                  {creatingPlan ? 'Salvando...' : 'Salvar plano'}
                </PrimaryButton>
              </FormPanel>
            )}

            {plans.length === 0 ? (
              <EmptyState>Nenhum plano cadastrado ainda.</EmptyState>
            ) : (
              <PlanList>
                {plans.map((plan) => (
                  <PlanCard key={plan.id}>
                    <PlanIdentity>
                      <h3>{plan.name}</h3>
                      <PlanPills>
                        <PlanPill tone="accent">
                          R$ {Number(plan.price || 0).toFixed(2)}
                        </PlanPill>
                        <PlanPill>
                          <FiCalendar /> {expirationLabel(plan)}
                        </PlanPill>
                        {plan.schedule_limit ? (
                          <PlanPill>
                            <FiClock /> {plan.schedule_limit} agend.
                          </PlanPill>
                        ) : null}
                        {plan.week_limit ? (
                          <PlanPill>
                            <FiClock /> {plan.week_limit} / semana
                          </PlanPill>
                        ) : null}
                        {plan.delete_limit ? (
                          <PlanPill>
                            <FiRotateCw /> {plan.delete_limit} cancel.
                          </PlanPill>
                        ) : null}
                      </PlanPills>
                    </PlanIdentity>
                    <IconButton
                      type="button"
                      variant="danger"
                      title="Remover plano"
                      onClick={() => deletePlan(plan.id)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </PlanCard>
                ))}
              </PlanList>
            )}
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Restrições por categoria</h2>
                <p>Escolha quais serviços cada plano NÃO libera.</p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <Label>
                <span>Plano</span>
                <NativeSelect
                  name="plan_id"
                  value={restrictData.plan_id}
                  onChange={(e) =>
                    setRestrictData({
                      ...restrictData,
                      plan_id: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione um plano</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </NativeSelect>
              </Label>

              <Label>
                <span>Categoria bloqueada</span>
                <NativeSelect
                  name="category_id"
                  value={restrictData.category_id}
                  onChange={(e) =>
                    setRestrictData({
                      ...restrictData,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </NativeSelect>
              </Label>

              <PrimaryButton type="button" onClick={createRestriction}>
                Salvar restrição
              </PrimaryButton>
            </FormPanel>

            {restricts.length === 0 ? (
              <EmptyState>Nenhuma restrição ativa no momento.</EmptyState>
            ) : (
              <RestrictList>
                {restricts.map((restrict) => (
                  <RestrictCard key={restrict.id}>
                    <RestrictInfo>
                      <span>{restrict.plan.name}</span>
                      <FiArrowRight />
                      <span>{restrict.category.name}</span>
                    </RestrictInfo>
                    <IconButton
                      type="button"
                      variant="danger"
                      title="Remover restrição"
                      onClick={() => deleteRestrict(restrict.id)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </RestrictCard>
                ))}
              </RestrictList>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Ativação por cliente</h2>
                <p>
                  Ativação, cancelamento e prorrogação de planos por cliente
                  acontecem em Clientes.
                </p>
              </PanelTitleWrap>
              <HeaderAction
                type="button"
                variant="primary"
                onClick={() => history.push(routes.adminClients)}
              >
                <FiUsers /> Ir para Clientes
              </HeaderAction>
            </PanelHeader>
          </Panel>
        </Column>
      </Layout>
    </AdminShell>
  );
};

export default PlanManagement;
