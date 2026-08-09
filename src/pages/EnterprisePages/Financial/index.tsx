import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiArrowDown,
  FiArrowUp,
  FiCalendar,
  FiDollarSign,
  FiHash,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTag,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from 'react-icons/fi';
import numeral from 'numeral';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import NumberFormat from 'react-number-format';
import AdminShell from '../../../components/AdminShell';
import DialogModal from '../../../components/DialogModal';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import { useLoad } from '../../../hooks/load';
import { sortArray } from '../../../utils';
import {
  Amount,
  CategoryChip,
  Column,
  DeleteButton,
  EmptyState,
  Field,
  FormPanel,
  FullWidth,
  Grid,
  InlineGrid,
  Input,
  KpiCard,
  KpiEyebrow,
  Metrics,
  MobileMeta,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PeriodBar,
  PeriodField,
  PeriodInput,
  PrimaryButton,
  RefreshButton,
  SearchRow,
  Select,
  SortHint,
  TransactionInfo,
  TransactionList,
  TransactionRow,
  TypeButton,
  TypeIcon,
  TypeToggle,
} from './styles';

interface FinancialRow {
  id: string;
  title: string;
  category?: string;
  price?: number;
  type: 'income' | 'outcome' | string;
  date: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

type FilterField = 'title' | 'category' | 'price' | 'type';

const currency = (value: number | undefined) =>
  `R$ ${numeral(Number(value || 0)).format('0,0.00')}`;

const Financial: React.FC = () => {
  const { addToast } = useToast();
  const { start, stop } = useLoad();

  const [range, setRange] = useState({
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [transactions, setTransactions] = useState<FinancialRow[]>([]);
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  });
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState<FilterField>('title');
  const [sortField, setSortField] = useState<'date' | 'price' | 'title'>('date');
  const [sortDir, setSortDir] = useState<'up' | 'down'>('down');
  const [openDialog, setOpenDialog] = useState(false);
  const [toDelete, setToDelete] = useState<FinancialRow | null>(null);

  const [draft, setDraft] = useState({
    title: '',
    category: '',
    price: 0 as number | undefined,
    type: 'income' as 'income' | 'outcome',
    date: format(new Date(), 'yyyy-MM-dd'),
    quantity: 1,
  });
  const [creating, setCreating] = useState(false);

  const loadByRange = useCallback(async () => {
    start();
    try {
      const response = await api.post('/financial/byDate', {
        start_date: range.start_date,
        finish_date: range.finish_date,
      });
      setTransactions(response.data.transactions || []);
      setBalance(
        response.data.balance || { income: 0, outcome: 0, total: 0 },
      );
    } catch (err: any) {
      setTransactions([]);
      setBalance({ income: 0, outcome: 0, total: 0 });
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Não foi possível carregar o financeiro deste período.',
      });
    } finally {
      stop();
    }
  }, [addToast, range.finish_date, range.start_date, start, stop]);

  const loadFiltered = useCallback(async () => {
    start();
    try {
      const response = await api.post('/financial/filter', {
        search,
        filter: filterField,
        start_date: range.start_date,
        finish_date: range.finish_date,
      });
      setTransactions(response.data.transactions || []);
      setBalance(
        response.data.balance || { income: 0, outcome: 0, total: 0 },
      );
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Não foi possível aplicar o filtro.',
      });
    } finally {
      stop();
    }
  }, [
    addToast,
    filterField,
    range.finish_date,
    range.start_date,
    search,
    start,
    stop,
  ]);

  useEffect(() => {
    loadByRange();
  }, [loadByRange]);

  useEffect(() => {
    if (search.length >= 3) {
      loadFiltered();
    } else if (search.length === 0) {
      loadByRange();
    }
  }, [loadByRange, loadFiltered, search, filterField]);

  const createTransaction = useCallback(async () => {
    if (!draft.title?.trim()) {
      addToast({ type: 'error', title: 'Informe um título.' });
      return;
    }
    if (!draft.price || draft.price <= 0) {
      addToast({ type: 'error', title: 'Informe um valor maior que zero.' });
      return;
    }
    setCreating(true);
    try {
      await api.post('/financial', {
        title: draft.title,
        category: draft.category,
        price: draft.price,
        type: draft.type,
        date: addDays(new Date(draft.date), 1),
        quantity: draft.quantity,
      });
      addToast({ type: 'success', title: 'Transação adicionada.' });
      setDraft({
        title: '',
        category: '',
        price: 0,
        type: draft.type,
        date: format(new Date(), 'yyyy-MM-dd'),
        quantity: 1,
      });
      loadByRange();
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao adicionar transação.',
      });
    } finally {
      setCreating(false);
    }
  }, [draft, addToast, loadByRange]);

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      try {
        await api.delete(`/financial/${transactionId}`);
        addToast({ type: 'success', title: 'Transação removida.' });
        setOpenDialog(false);
        loadByRange();
      } catch (err: any) {
        addToast({
          type: 'error',
          title:
            err?.response?.data?.message || 'Erro ao remover transação.',
        });
      }
    },
    [addToast, loadByRange],
  );

  const orderedTransactions = useMemo(() => {
    return sortArray(transactions, sortDir, sortField);
  }, [transactions, sortDir, sortField]);

  const changeSort = (field: 'date' | 'price' | 'title') => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'up' ? 'down' : 'up'));
    } else {
      setSortField(field);
      setSortDir('down');
    }
  };

  const balanceTone: 'income' | 'outcome' | 'net' =
    balance.total > 0 ? 'income' : balance.total < 0 ? 'outcome' : 'net';

  return (
    <AdminShell
      eyebrow="Financeiro"
      title="Fluxo de caixa"
      description="Registre entradas e saídas, acompanhe o resultado do período e filtre por título, categoria ou tipo."
    >
      <DialogModal
        openModal={openDialog}
        setOpenModal={setOpenDialog}
        onSubmit={() => toDelete && deleteTransaction(toDelete.id)}
      />

      <PeriodBar>
        <PeriodField>
          <span>Início do período</span>
          <PeriodInput
            type="date"
            value={range.start_date}
            onChange={(e) =>
              setRange({ ...range, start_date: e.target.value })
            }
          />
        </PeriodField>
        <PeriodField>
          <span>Fim do período</span>
          <PeriodInput
            type="date"
            value={range.finish_date}
            onChange={(e) =>
              setRange({ ...range, finish_date: e.target.value })
            }
          />
        </PeriodField>
        <RefreshButton type="button" onClick={loadByRange}>
          <FiRefreshCw /> Atualizar
        </RefreshButton>
      </PeriodBar>

      <Metrics>
        <KpiCard tone="income">
          <KpiEyebrow tone="income">
            <FiTrendingUp /> Entradas
          </KpiEyebrow>
          <strong>{currency(balance.income)}</strong>
          <span>Total recebido no período.</span>
        </KpiCard>
        <KpiCard tone="outcome">
          <KpiEyebrow tone="outcome">
            <FiTrendingDown /> Saídas
          </KpiEyebrow>
          <strong>{currency(balance.outcome)}</strong>
          <span>Total gasto no período.</span>
        </KpiCard>
        <KpiCard tone={balanceTone}>
          <KpiEyebrow tone={balanceTone}>
            <FiDollarSign /> Resultado
          </KpiEyebrow>
          <strong>{currency(balance.total)}</strong>
          <span>
            {balance.total > 0
              ? 'Caixa positivo.'
              : balance.total < 0
              ? 'Caixa pressionado.'
              : 'Sem movimento acumulado.'}
          </span>
        </KpiCard>
        <KpiCard tone="muted">
          <KpiEyebrow tone="muted">
            <FiHash /> Lançamentos
          </KpiEyebrow>
          <strong>{transactions.length}</strong>
          <span>Transações listadas neste filtro.</span>
        </KpiCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Novo lançamento</h2>
                <p>
                  Registre entrada ou saída em segundos. Categoria é opcional.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <TypeToggle>
                <TypeButton
                  type="button"
                  tone="income"
                  active={draft.type === 'income'}
                  onClick={() => setDraft({ ...draft, type: 'income' })}
                >
                  <FiArrowUp /> Entrada
                </TypeButton>
                <TypeButton
                  type="button"
                  tone="outcome"
                  active={draft.type === 'outcome'}
                  onClick={() => setDraft({ ...draft, type: 'outcome' })}
                >
                  <FiArrowDown /> Saída
                </TypeButton>
              </TypeToggle>

              <Field>
                <span>Título</span>
                <Input
                  type="text"
                  value={draft.title}
                  placeholder="Ex.: Mensalidade Cliente X"
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                />
              </Field>

              <InlineGrid>
                <Field>
                  <span>Valor</span>
                  <NumberFormat
                    customInput={Input}
                    isNumericString
                    decimalScale={2}
                    decimalSeparator=","
                    prefix="R$ "
                    placeholder="R$ 0,00"
                    thousandSeparator="."
                    value={draft.price || ''}
                    onValueChange={(v: { floatValue?: number }) =>
                      setDraft({ ...draft, price: v.floatValue })
                    }
                  />
                </Field>
                <Field>
                  <span>Data</span>
                  <Input
                    type="date"
                    value={draft.date}
                    onChange={(e) =>
                      setDraft({ ...draft, date: e.target.value })
                    }
                  />
                </Field>
              </InlineGrid>

              <Field>
                <span>Categoria (opcional)</span>
                <Input
                  type="text"
                  value={draft.category}
                  placeholder="Ex.: Mensalidade, Aluguel..."
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                />
              </Field>

              <PrimaryButton
                type="button"
                onClick={createTransaction}
                disabled={creating}
              >
                <FiPlus />
                {creating ? 'Adicionando...' : 'Adicionar transação'}
              </PrimaryButton>
            </FormPanel>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Buscar</h2>
                <p>Encontre uma transação por título, categoria ou tipo.</p>
              </PanelTitleWrap>
            </PanelHeader>

            <SearchRow>
              {filterField === 'type' ? (
                <Select
                  value={search || 'income'}
                  onChange={(e) => setSearch(e.target.value)}
                >
                  <option value="income">Entradas</option>
                  <option value="outcome">Saídas</option>
                </Select>
              ) : (
                <Input
                  type="text"
                  value={search}
                  placeholder={
                    filterField === 'title'
                      ? 'Buscar por título...'
                      : filterField === 'category'
                      ? 'Buscar por categoria...'
                      : 'Buscar por preço...'
                  }
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              <Select
                value={filterField}
                onChange={(e) => {
                  setSearch('');
                  const next = e.target.value as FilterField;
                  setFilterField(next);
                  if (next === 'type') setSearch('income');
                }}
              >
                <option value="title">Título</option>
                <option value="category">Categoria</option>
                <option value="price">Preço</option>
                <option value="type">Tipo</option>
              </Select>
            </SearchRow>

            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 16,
                flexWrap: 'wrap',
              }}
            >
              <SortHint
                type="button"
                active={sortField === 'date'}
                onClick={() => changeSort('date')}
              >
                <FiCalendar /> Data{' '}
                {sortField === 'date' ? (sortDir === 'down' ? '↓' : '↑') : ''}
              </SortHint>
              <SortHint
                type="button"
                active={sortField === 'price'}
                onClick={() => changeSort('price')}
              >
                <FiDollarSign /> Valor{' '}
                {sortField === 'price' ? (sortDir === 'down' ? '↓' : '↑') : ''}
              </SortHint>
              <SortHint
                type="button"
                active={sortField === 'title'}
                onClick={() => changeSort('title')}
              >
                <FiTag /> Título{' '}
                {sortField === 'title' ? (sortDir === 'down' ? '↓' : '↑') : ''}
              </SortHint>
            </div>
          </Panel>
        </Column>
      </Grid>

      <FullWidth>
        <Panel>
          <PanelHeader>
            <PanelTitleWrap>
              <h2>Histórico do período</h2>
              <p>Todos os lançamentos entre as datas selecionadas.</p>
            </PanelTitleWrap>
          </PanelHeader>

          {orderedTransactions.length === 0 ? (
            <EmptyState>
              Nenhuma transação encontrada para o período e filtros atuais.
            </EmptyState>
          ) : (
            <TransactionList>
              {orderedTransactions.map((transaction) => {
                const tone: 'income' | 'outcome' =
                  transaction.type === 'outcome' ? 'outcome' : 'income';
                return (
                  <TransactionRow key={transaction.id}>
                    <TypeIcon tone={tone}>
                      {tone === 'income' ? <FiArrowUp /> : <FiArrowDown />}
                    </TypeIcon>
                    <TransactionInfo>
                      <strong>{transaction.title}</strong>
                      <span>
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        {transaction.category && (
                          <CategoryChip>{transaction.category}</CategoryChip>
                        )}
                      </span>
                    </TransactionInfo>
                    <Amount tone={tone}>
                      {tone === 'outcome' ? '- ' : '+ '}
                      {currency(transaction.price)}
                    </Amount>
                    <DeleteButton
                      type="button"
                      onClick={() => {
                        setToDelete(transaction);
                        setOpenDialog(true);
                      }}
                      title="Remover transação"
                    >
                      <FiTrash2 />
                    </DeleteButton>
                    <MobileMeta>
                      <Amount tone={tone}>
                        {tone === 'outcome' ? '- ' : '+ '}
                        {currency(transaction.price)}
                      </Amount>
                      <DeleteButton
                        type="button"
                        onClick={() => {
                          setToDelete(transaction);
                          setOpenDialog(true);
                        }}
                        title="Remover transação"
                      >
                        <FiTrash2 />
                      </DeleteButton>
                    </MobileMeta>
                  </TransactionRow>
                );
              })}
            </TransactionList>
          )}
        </Panel>
      </FullWidth>
    </AdminShell>
  );
};

export default Financial;
