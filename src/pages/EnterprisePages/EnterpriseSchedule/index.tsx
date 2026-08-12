import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NumberFormat from 'react-number-format';
import { Switch } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/Button';
import InputDefault from '../../../components/InputDefault';
import DialogModal from '../../../components/DialogModal';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import {
  Metrics,
  MetricCard,
  Grid,
  Column,
  FullWidth,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  SoftAction,
  FormPanel,
  InlineGrid,
  Field,
  EmptyState,
  ChipRow,
  Chip,
  List,
  ListCard,
  ListTop,
  ListTitle,
  ListText,
  ActionRow,
  ToggleRow,
  StatusPill,
  IconButton,
} from '../shared';

interface Category {
  id: string;
  name: string;
}

interface Service {
  id?: string;
  start_hour: string;
  category_id: string;
  capacity: number;
  day_week: number;
  pending_scheduling?: boolean | number;
  hour_to_schedule: number;
}

const weekDays = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Segunda' },
  { id: 2, label: 'Terça' },
  { id: 3, label: 'Quarta' },
  { id: 4, label: 'Quinta' },
  { id: 5, label: 'Sexta' },
  { id: 6, label: 'Sábado' },
];

const EnterpriseSchedule: React.FC = () => {
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );
  const { addToast } = useToast();
  const history = useHistory();

  const [formCategoryName, setFormCategoryName] = useState('');
  const [openDeleteCategory, setOpenDeleteCategory] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [formService, setFormService] = useState<any>({
    pending_scheduling: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectectedCategory, setSelectectedCategory] = useState<string[]>([]);
  const [selectectedDays, setSelectectedDays] = useState<number[]>([]);

  // Visualização da grade atual (pesquisa isolada)
  const [gridCategory, setGridCategory] = useState<string>('');
  const [gridDay, setGridDay] = useState<number>(1);
  const [gridServices, setGridServices] = useState<Service[]>([]);
  const [gridLoading, setGridLoading] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [openDeleteService, setOpenDeleteService] = useState(false);

  const getCategories = useCallback(async () => {
    api
      .get(`/services/category/${myEnterprise.id}`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        setCategories([]);
      });
  }, [myEnterprise.id]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const createCategory = useCallback(async () => {
    try {
      await api.post('/services/category', {
        name: formCategoryName,
      });
      setFormCategoryName('');
      getCategories();
      addToast({
        type: 'success',
        title: 'Novo tipo de serviço adicionado!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao adicionar o tipo de serviço, tente novamente',
      });
    }
  }, [addToast, formCategoryName, getCategories]);

  const deleteCategory = useCallback(async () => {
    try {
      await api.delete(`/services/category/${categoryId}`);
      getCategories();
      setOpenDeleteCategory(false);
      addToast({
        type: 'success',
        title: 'Tipo de serviço deletado!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao deletar o tipo de serviço, tente novamente',
      });
    }
  }, [addToast, categoryId, getCategories]);

  const createServices = useCallback(
    async (scheduleTimes) => {
      try {
        await api.post('/services', {
          dataArray: scheduleTimes,
        });
        setFormService({
          ...formService,
          start_hour: '',
        });
        addToast({
          type: 'success',
          title: 'Horários adicionados!',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao adicionar horários, tente novamente',
        });
      }
    },
    [addToast, formService],
  );

  const handlePressWeek = useCallback(
    (day) => {
      if (selectectedDays.includes(day)) {
        setSelectectedDays(
          selectectedDays.filter((weekDay) => weekDay !== day),
        );
      } else {
        setSelectectedDays((days) => [...days, day]);
      }
    },
    [selectectedDays],
  );

  const handlePressCategory = useCallback(
    (category) => {
      if (selectectedCategory.includes(category)) {
        setSelectectedCategory(
          selectectedCategory.filter((allCategory) => allCategory !== category),
        );
      } else {
        setSelectectedCategory((allCategories) => [...allCategories, category]);
      }
    },
    [selectectedCategory],
  );

  const handleScheduleTime = useCallback(() => {
    if (selectectedCategory.length === 0 || selectectedDays.length === 0) {
      addToast({
        type: 'error',
        title:
          'Selecione pelo menos um tipo de serviço e um dia da semana antes de incluir horários.',
      });
      return;
    }

    if (formService.start_hour?.replace(':', '') > 2359) {
      addToast({
        type: 'error',
        title: 'Horários só vão até 23:59, tente novamente',
      });
      return;
    }

    if (!formService.start_hour || !formService.capacity || !formService.hour_to_schedule) {
      addToast({
        type: 'error',
        title: 'Preencha horário, vagas e antecedência antes de publicar.',
      });
      return;
    }

    const totalSchedule: Service[] = [];

    selectectedCategory.forEach((category) =>
      selectectedDays.forEach((day) =>
        totalSchedule.push({
          start_hour: formService.start_hour,
          category_id: category,
          capacity: formService.capacity,
          day_week: day,
          hour_to_schedule: formService.hour_to_schedule,
          pending_scheduling: formService.pending_scheduling,
        }),
      ),
    );

    createServices(totalSchedule);
  }, [
    selectectedCategory,
    selectectedDays,
    formService.start_hour,
    formService.capacity,
    formService.hour_to_schedule,
    formService.pending_scheduling,
    createServices,
    addToast,
  ]);

  const loadGridServices = useCallback(async () => {
    if (!gridCategory) {
      setGridServices([]);
      return;
    }
    setGridLoading(true);
    try {
      const response = await api.get(
        `/services/category/${gridCategory}/day/${gridDay}`,
      );
      const list: Service[] = response.data || [];
      // ordena por horário
      list.sort((a, b) =>
        (a.start_hour || '').localeCompare(b.start_hour || ''),
      );
      setGridServices(list);
    } catch {
      setGridServices([]);
    } finally {
      setGridLoading(false);
    }
  }, [gridCategory, gridDay]);

  useEffect(() => {
    // seleciona primeira categoria automaticamente quando carregar
    if (!gridCategory && categories.length > 0) {
      setGridCategory(categories[0].id);
    }
  }, [categories, gridCategory]);

  useEffect(() => {
    loadGridServices();
  }, [loadGridServices]);

  const confirmDeleteService = useCallback(async () => {
    if (!serviceToDelete?.id) {
      setOpenDeleteService(false);
      return;
    }
    try {
      await api.delete(`/services/${serviceToDelete.id}`);
      addToast({ type: 'success', title: 'Horário removido.' });
      setOpenDeleteService(false);
      setServiceToDelete(null);
      loadGridServices();
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Erro ao remover horário. Se houver agendamentos vinculados, cancele-os primeiro.',
      });
    }
  }, [addToast, loadGridServices, serviceToDelete]);

  const scheduleBatchSize = useMemo(
    () => selectectedCategory.length * selectectedDays.length,
    [selectectedCategory.length, selectectedDays.length],
  );

  return (
    <AdminShell
      eyebrow="Operação da agenda"
      title="Gestão de horários"
      description="Monte a grade de atendimento com mais clareza: primeiro defina categorias, depois selecione dias e publique o lote de horários."
      actions={
        <SoftAction type="button" onClick={() => history.push(routes.dashboard)}>
          <FiCalendar />
          Ver no dashboard
        </SoftAction>
      }
    >
      <DialogModal
        title="Deseja deletar este serviço?"
        text="Ao deletar, todos agendamentos atrelados a ele serão perdidos."
        onSubmit={deleteCategory}
        setOpenModal={setOpenDeleteCategory}
        openModal={openDeleteCategory}
      />

      <DialogModal
        title="Remover este horário?"
        text={
          serviceToDelete
            ? `Horário ${serviceToDelete.start_hour} será removido da grade. Todos os agendamentos vinculados a ele também serão cancelados.`
            : 'Confirmar remoção do horário.'
        }
        onSubmit={confirmDeleteService}
        setOpenModal={setOpenDeleteService}
        openModal={openDeleteService}
      />

      <Metrics>
        <MetricCard>
          <strong>{categories.length}</strong>
          <span>Categorias cadastradas</span>
        </MetricCard>
        <MetricCard>
          <strong>{selectectedCategory.length}</strong>
          <span>Categorias selecionadas no lote</span>
        </MetricCard>
        <MetricCard>
          <strong>{selectectedDays.length}</strong>
          <span>Dias escolhidos</span>
        </MetricCard>
        <MetricCard>
          <strong>{scheduleBatchSize}</strong>
          <span>Combinações prontas para publicar</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Etapa 1: categorias de serviço</h2>
                <p>
                  Organize os tipos de atendimento que podem receber horários.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <InputDefault
                  type="text"
                  name="name"
                  placeholder="Nome da categoria"
                  value={formCategoryName}
                  onChange={(e) => setFormCategoryName(e.target.value)}
                />
                <Button onClick={createCategory}>
                  <FiPlus />
                  Adicionar categoria
                </Button>
              </InlineGrid>
            </FormPanel>

            {categories.length > 0 ? (
              <ChipRow>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    active={selectectedCategory.includes(category.id)}
                    onClick={() => handlePressCategory(category.id)}
                  >
                    {category.name}
                    <FiTrash2
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryId(category.id);
                        setOpenDeleteCategory(true);
                      }}
                    />
                  </Chip>
                ))}
              </ChipRow>
            ) : (
              <EmptyState>
                Você ainda não cadastrou categorias. Crie pelo menos uma para
                publicar horários.
              </EmptyState>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Etapa 2: dias da semana</h2>
                <p>
                  Escolha em quais dias esse lote deve ser replicado.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <ChipRow>
              {weekDays.map((day) => (
                <Chip
                  key={day.id}
                  active={selectectedDays.includes(day.id)}
                  onClick={() => handlePressWeek(day.id)}
                >
                  {day.label}
                </Chip>
              ))}
            </ChipRow>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Etapa 3: publicar lote</h2>
                <p>
                  Defina o horário base, capacidade e regras de antecedência.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <Field>
                  Horário
                  <NumberFormat
                    customInput={InputDefault}
                    type="text"
                    format="##:##"
                    name="start_hour"
                    allowLeadingZeros
                    allowEmptyFormatting
                    mask="_"
                    placeholder="Horário"
                    value={formService.start_hour}
                    onChange={(e) =>
                      setFormService({
                        ...formService,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Field>

                <Field>
                  Limite de vagas
                  <InputDefault
                    type="text"
                    name="capacity"
                    placeholder="Ex.: 10"
                    value={formService.capacity}
                    onChange={(e) =>
                      setFormService({
                        ...formService,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Field>
              </InlineGrid>

              <Field>
                Minutos de antecedência
                <InputDefault
                  type="text"
                  name="hour_to_schedule"
                  placeholder="Ex.: 30"
                  value={formService.hour_to_schedule}
                  onChange={(e) =>
                    setFormService({
                      ...formService,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </Field>

              <ToggleRow>
                Permitir agendamento mesmo com outro horário pendente
                <Switch
                  onChange={(e) =>
                    setFormService({
                      ...formService,
                      [e.target.name]: e.target.checked,
                    })
                  }
                  name="pending_scheduling"
                  checked={!!formService.pending_scheduling}
                />
              </ToggleRow>

              <Button onClick={handleScheduleTime}>
                <FiPlus />
                Publicar horários
              </Button>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Resumo do lote</h2>
                <p>
                  Antes de publicar, revise o alcance do horário que será criado.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            {scheduleBatchSize > 0 ? (
              <List>
                <ListCard>
                  <ListTop>
                    <div>
                      <ListTitle>{scheduleBatchSize} combinações prontas</ListTitle>
                      <ListText>
                        {selectectedCategory.length} categoria(s) x{' '}
                        {selectectedDays.length} dia(s).
                      </ListText>
                    </div>
                    <StatusPill tone="success">Pronto</StatusPill>
                  </ListTop>
                </ListCard>

                <ListCard>
                  <ListTop>
                    <div>
                      <ListTitle>Categorias</ListTitle>
                      <ListText>
                        {categories
                          .filter((category) =>
                            selectectedCategory.includes(category.id),
                          )
                          .map((category) => category.name)
                          .join(', ')}
                      </ListText>
                    </div>
                  </ListTop>
                </ListCard>

                <ListCard>
                  <ListTop>
                    <div>
                      <ListTitle>Dias selecionados</ListTitle>
                      <ListText>
                        {weekDays
                          .filter((day) => selectectedDays.includes(day.id))
                          .map((day) => day.label)
                          .join(', ')}
                      </ListText>
                    </div>
                  </ListTop>
                </ListCard>
              </List>
            ) : (
              <EmptyState>
                Selecione categorias e dias para montar um lote publicável.
              </EmptyState>
            )}

            <ActionRow style={{ marginTop: 20 }}>
              <Button
                transparent
                primaryColor="#ffffff"
                secondaryColor="#0c1729"
                onClick={() => {
                  localStorage.setItem('enterprise', JSON.stringify(myEnterprise));
                  history.push(routes.dashboard);
                }}
              >
                <FiClock />
                Revisar agenda atual
              </Button>
            </ActionRow>
          </Panel>
        </Column>
      </Grid>

      <FullWidth>
        <Panel>
          <PanelHeader>
            <PanelTitleWrap>
              <h2>Grade atual</h2>
              <p>
                Horários já publicados. Escolha categoria + dia para inspecionar
                e remover o que não é mais válido. Pra editar um horário,
                remova e cadastre de novo no lote acima.
              </p>
            </PanelTitleWrap>
            <SoftAction type="button" onClick={loadGridServices}>
              <FiRefreshCw />
              Atualizar
            </SoftAction>
          </PanelHeader>

          <FormPanel>
            <Field>
              Categoria
              <ChipRow>
                {categories.length === 0 ? (
                  <EmptyState style={{ marginTop: 0 }}>
                    Cadastre uma categoria acima para visualizar sua grade.
                  </EmptyState>
                ) : (
                  categories.map((category) => (
                    <Chip
                      key={category.id}
                      active={gridCategory === category.id}
                      onClick={() => setGridCategory(category.id)}
                    >
                      {category.name}
                    </Chip>
                  ))
                )}
              </ChipRow>
            </Field>

            <Field>
              Dia da semana
              <ChipRow>
                {weekDays.map((day) => (
                  <Chip
                    key={day.id}
                    active={gridDay === day.id}
                    onClick={() => setGridDay(day.id)}
                  >
                    {day.label}
                  </Chip>
                ))}
              </ChipRow>
            </Field>
          </FormPanel>

          {gridLoading ? (
            <EmptyState>Carregando grade...</EmptyState>
          ) : gridServices.length === 0 ? (
            <EmptyState>
              Nenhum horário publicado para essa combinação. Use o painel acima
              pra criar.
            </EmptyState>
          ) : (
            <List>
              {gridServices.map((service) => (
                <ListCard key={service.id}>
                  <ListTop>
                    <div>
                      <ListTitle>
                        <FiClock
                          style={{
                            display: 'inline',
                            marginRight: 6,
                            verticalAlign: '-3px',
                            color: '#ff9000',
                          }}
                        />
                        {service.start_hour}
                      </ListTitle>
                      <ListText>
                        <FiUsers
                          style={{
                            display: 'inline',
                            marginRight: 6,
                            verticalAlign: '-3px',
                          }}
                        />
                        {service.capacity} vaga(s) &nbsp;·&nbsp;{' '}
                        {service.hour_to_schedule} min de antecedência
                        {service.pending_scheduling ? (
                          <>
                            {' '}
                            &nbsp;·&nbsp;{' '}
                            <StatusPill tone="warning">
                              permite pendente
                            </StatusPill>
                          </>
                        ) : null}
                      </ListText>
                    </div>
                    <IconButton
                      type="button"
                      variant="danger"
                      title="Remover horário"
                      onClick={() => {
                        setServiceToDelete(service);
                        setOpenDeleteService(true);
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </ListTop>
                </ListCard>
              ))}
            </List>
          )}
        </Panel>
      </FullWidth>
    </AdminShell>
  );
};

export default EnterpriseSchedule;
