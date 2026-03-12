import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiCalendar,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';
import { MdAttachMoney } from 'react-icons/md';
import numeral from 'numeral';
import { addDays, endOfMonth, startOfMonth, format } from 'date-fns';
import NumberFormat from 'react-number-format';
import DialogModal from '../../../components/DialogModal';
import AdminShell from '../../../components/AdminShell';
import { sortArray } from '../../../utils';
import {
  Metrics,
  MetricCard,
  Grid,
  Column,
  FullWidth,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  FormPanel,
  InlineGrid,
  EmptyState,
  TableWrap,
  DataTable,
  SoftAction,
  StatusPill,
  ActionRow,
  IconButton,
} from '../shared';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import InputDefault from '../../../components/InputDefault';
import { NativeSelect } from '../shared';
import { useLoad } from '../../../hooks/load';

interface CreateTransaction {
  title: string;
  description?: string;
  category?: string;
  price?: number;
  type: string;
  quantity: number;
  date: string;
  start_date?: string;
  finish_date?: string;
  filter?: string;
}

interface FinancialRow {
  title: string;
  category?: string;
  price?: number;
  type: string;
  date: string;
  id: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Financial: React.FC = () => {
  const { addToast } = useToast();
  const { start, stop } = useLoad();

  const [transactions, setTransactions] = useState<FinancialRow[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<any>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState({
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'income',
    quantity: 1,
    filter: 'title',
  } as CreateTransaction);
  const [sortTypeNow, setSortType] = useState('');
  const [sortStatus, setSortStatus] = useState('down');

  const changeOrdination = useCallback(
    (type) => {
      setSortType(type);
      setSortStatus((current) => (current === 'up' ? 'down' : 'up'));
    },
    [],
  );

  const getTransaction = useCallback(async () => {
    start();
    try {
      const response = await api.post('/financial/byDate', {
        start_date: value.start_date,
        finish_date: value.finish_date,
      });

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    } catch (err) {
      setTransactions([]);
      setBalance({ income: 0, outcome: 0, total: 0 });
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Não foi possível carregar o financeiro deste período.',
      });
    } finally {
      stop();
    }
  }, [addToast, start, stop, value.finish_date, value.start_date]);

  const getTransactionFiltered = useCallback(async () => {
    start();
    try {
      const response = await api.post('/financial/filter', {
        search: searchValue,
        filter: value.filter,
        start_date: value.start_date,
        finish_date: value.finish_date,
      });

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    } catch (err) {
      setTransactions([]);
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Não foi possível aplicar este filtro no financeiro.',
      });
    } finally {
      stop();
    }
  }, [
    addToast,
    value.filter,
    value.finish_date,
    value.start_date,
    searchValue,
    start,
    stop,
  ]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      getTransactionFiltered();
    } else if (searchValue.length === 0) {
      getTransaction();
    }
  }, [getTransaction, getTransactionFiltered, searchValue, value.filter]);

  const handleTransaction = useCallback(async () => {
    try {
      await api.post('/financial', {
        title: value.title,
        category: value.category,
        price: value.price,
        type: value.type,
        date: addDays(new Date(value.date), 1),
        quantity: value.quantity,
      });

      setValue({
        title: '',
        category: '',
        start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'income',
        quantity: 1,
        price: 0,
        filter: value.filter,
      });

      getTransaction();

      addToast({
        type: 'success',
        title: 'Transação adicionada com sucesso.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao adicionar a transação, tente novamente',
      });
    }
  }, [value, addToast, getTransaction]);

  const deleteTransaction = useCallback(
    async (transaction_id) => {
      try {
        await api.delete(`/financial/${transaction_id}`);
        getTransaction();
        setOpenModal(false);
        addToast({
          type: 'success',
          title: 'Transação deletada!',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao excluir a transação, tente novamente',
        });
      }
    },
    [addToast, getTransaction],
  );

  useEffect(() => {
    getTransaction();
  }, [getTransaction]);

  const orderedTransactions = useMemo(() => {
    return sortArray(transactions, sortStatus, sortTypeNow);
  }, [transactions, sortStatus, sortTypeNow]);

  return (
    <AdminShell
      eyebrow="Resultado financeiro"
      title="Gestão financeira"
      description="Acompanhe o caixa do período, filtre o histórico e registre entradas ou saídas sem misturar tudo em uma única faixa de formulário."
      actions={
        <SoftAction type="button" onClick={getTransaction}>
          <FiCalendar />
          Atualizar período
        </SoftAction>
      }
    >
      <DialogModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmit={() => deleteTransaction(currentTransaction.id)}
      />

      <Metrics>
        <MetricCard>
          <strong>R$ {numeral(Number(balance.income)).format('0,0.00')}</strong>
          <span>Entradas do período</span>
        </MetricCard>
        <MetricCard>
          <strong>R$ {numeral(Number(balance.outcome)).format('0,0.00')}</strong>
          <span>Saídas do período</span>
        </MetricCard>
        <MetricCard>
          <strong>R$ {numeral(Number(balance.total)).format('0,0.00')}</strong>
          <span>Resultado acumulado</span>
        </MetricCard>
        <MetricCard>
          <strong>{transactions.length}</strong>
          <span>Transações listadas</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Novo lançamento</h2>
                <p>
                  Registre rapidamente uma entrada ou saída com os campos mínimos
                  necessários.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <InputDefault
                  name="title"
                  type="text"
                  value={value.title}
                  placeholder="Título"
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                />
                <NativeSelect
                  name="type"
                  value={value.type}
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                >
                  <option value="income">Entrada</option>
                  <option value="outcome">Saída</option>
                </NativeSelect>
              </InlineGrid>

              <InlineGrid>
                <NumberFormat
                  isNumericString
                  customInput={InputDefault}
                  decimalScale={2}
                  decimalSeparator=","
                  name="price"
                  prefix="R$ "
                  placeholder="Valor"
                  thousandSeparator="."
                  type="text"
                  value={value.price}
                  onValueChange={(e) => {
                    setValue({
                      ...value,
                      price: e.floatValue,
                    });
                  }}
                />
                <InputDefault
                  name="category"
                  type="text"
                  value={value.category}
                  placeholder="Categoria"
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                />
              </InlineGrid>

              <InputDefault
                name="date"
                type="date"
                value={value.date}
                placeholder="Data"
                onChange={(e) => {
                  setValue({ ...value, [e.target.name]: e.target.value });
                }}
              />

              <Button onClick={handleTransaction}>
                <FiPlus />
                Adicionar transação
              </Button>
            </FormPanel>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Filtro do período</h2>
                <p>
                  Afine a busca por intervalo, campo e termo pesquisado.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <InputDefault
                  name="start_date"
                  type="date"
                  value={value.start_date}
                  placeholder="Início"
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                />
                <InputDefault
                  name="finish_date"
                  type="date"
                  value={value.finish_date}
                  placeholder="Fim"
                  onChange={(e) => {
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                />
              </InlineGrid>

              <InlineGrid>
                {value.filter === 'type' ? (
                  <NativeSelect
                    name="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  >
                    <option value="income">Entrada</option>
                    <option value="outcome">Saída</option>
                  </NativeSelect>
                ) : (
                  <InputDefault
                    icon={FiSearch}
                    name="search"
                    type="text"
                    value={searchValue}
                    placeholder="Buscar"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                )}

                <NativeSelect
                  name="filter"
                  value={value.filter}
                  onChange={(e) => {
                    setSearchValue('');
                    if (e.target.value === 'type') {
                      setSearchValue('income');
                    }
                    setValue({ ...value, [e.target.name]: e.target.value });
                  }}
                >
                  <option value="title">Título</option>
                  <option value="price">Preço</option>
                  <option value="type">Tipo</option>
                  <option value="category">Categoria</option>
                </NativeSelect>
              </InlineGrid>
            </FormPanel>

            <ActionRow style={{ marginTop: 20 }}>
              <StatusPill tone={balance.total >= 0 ? 'success' : 'danger'}>
                {balance.total >= 0 ? 'Caixa positivo' : 'Caixa pressionado'}
              </StatusPill>
              <StatusPill tone="default">
                <FiFilter />
                {value.filter}
              </StatusPill>
            </ActionRow>
          </Panel>
        </Column>
      </Grid>

      <FullWidth>
        <Panel>
          <PanelHeader>
            <PanelTitleWrap>
              <h2>Histórico financeiro</h2>
              <p>
                Lista do período atual com ordenação simples e remoção direta.
              </p>
            </PanelTitleWrap>
          </PanelHeader>

          {orderedTransactions.length > 0 ? (
            <TableWrap>
              <DataTable>
                <thead>
                  <tr>
                    <th onClick={() => changeOrdination('title')}>Título</th>
                    <th onClick={() => changeOrdination('price')}>Valor</th>
                    <th onClick={() => changeOrdination('category')}>Categoria</th>
                    <th onClick={() => changeOrdination('date')}>Data</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orderedTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.title}</td>
                      <td
                        style={{
                          color:
                            transaction.type === 'outcome' ? '#e83f5b' : '#12a454',
                        }}
                      >
                        {transaction.type === 'outcome' ? (
                          <FiArrowDownCircle style={{ marginRight: 8 }} />
                        ) : (
                          <FiArrowUpCircle style={{ marginRight: 8 }} />
                        )}
                        R$ {transaction.type === 'outcome' ? '-' : ''}
                        {numeral(Number(transaction.price)).format('0,0.00')}
                      </td>
                      <td>{transaction.category || 'Sem categoria'}</td>
                      <td>{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                      <td>
                        <StatusPill
                          tone={
                            transaction.type === 'outcome' ? 'danger' : 'success'
                          }
                        >
                          {transaction.type === 'outcome' ? 'Saída' : 'Entrada'}
                        </StatusPill>
                      </td>
                      <td>
                        <IconButton
                          type="button"
                          variant="danger"
                          onClick={() => {
                            setOpenModal(true);
                            setCurrentTransaction(transaction);
                          }}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </TableWrap>
          ) : (
            <EmptyState>
              Nenhuma transação encontrada para o período e filtros atuais.
            </EmptyState>
          )}
        </Panel>
      </FullWidth>
    </AdminShell>
  );
};

export default Financial;
