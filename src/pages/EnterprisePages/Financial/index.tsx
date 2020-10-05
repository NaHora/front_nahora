import React, { useState, useCallback, useEffect } from 'react';

import { FiArrowUpCircle, FiArrowDownCircle, FiSearch } from 'react-icons/fi';
import numeral from 'numeral';

import {
  MdAttachMoney,
  MdDeleteForever,
  MdExpandLess,
  MdExpandMore,
  MdUnfoldMore,
} from 'react-icons/md';
import { endOfMonth, startOfMonth, format, setHours } from 'date-fns';
import NumberFormat from 'react-number-format';
import { addDays } from 'date-fns/esm';
import DialogModal from '../../../components/DialogModal';
import HeaderMenu from '../../../components/Header';
import { sortArray } from '../../../utils';
import {
  Container,
  Section,
  TotalBox,
  Table,
  InputsDiv,
  SelectDefault,
  ModalInput,
} from './styles';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import InputDefault from '../../../components/InputDefault';
import { useLoad } from '../../../hooks/load';

interface CreateTransaction {
  user_name?: string;
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

interface Financial {
  user_name?: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  type: string;
  quantity: number;
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

  const [transactions, setTransactions] = useState<Financial[]>([]);
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
      if (sortStatus === 'up') {
        setSortStatus('down');
      } else {
        setSortStatus('up');
      }
    },
    [sortStatus],
  );

  const getTransaction = useCallback(async () => {
    start();
    const { start_date, finish_date } = value;
    const body = {
      start_date,
      finish_date,
    };
    try {
      const response = await api.post(`/financial/byDate`, body);

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    } catch (err) {
    } finally {
      stop();
    }
  }, [value, start, stop]);

  const getTransactionFiltered = useCallback(async () => {
    const { start_date, finish_date, filter } = value;
    const body = {
      search: searchValue,
      filter,
      start_date,
      finish_date,
    };
    start();
    try {
      const response = await api.post(`/financial/filter`, body);

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    } catch (err) {
    } finally {
      stop();
    }
  }, [value, searchValue, transactions, start, stop]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      getTransactionFiltered();
    } else if (searchValue.length === 0) {
      getTransaction();
    }
  }, [searchValue, value.filter]);

  const handleTransaction = useCallback(async () => {
    const { title, category, price, type, date, quantity } = value;
    const body = {
      title,
      category,
      price,
      type,
      date: addDays(new Date(date), 1),
      quantity,
    };
    try {
      await api.post(`/financial`, body);

      setValue({
        title: '',
        start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        finish_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'income',
        quantity: 1,
        price: 0,
      });

      getTransaction();

      addToast({
        type: 'success',
        title: 'Novo tipo de serviço adicionado!',
      });
    } catch (err) {
      if (err.response) {
        addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao adicionar o tipo de serviço, tente novamente',
        });
      } else {
        addToast({
          type: 'error',
          title:
            'Ocorreu um erro ao adicionar o tipo de serviço, tente novamente',
        });
      }
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
        if (err.response) {
          addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao excluir a transação, tente novamente',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Ocorreu um erro ao excluir a transação, tente novamente',
          });
        }
      }
    },
    [addToast, getTransaction],
  );

  useEffect(() => {
    getTransaction();
  }, [value.start_date, value.finish_date]);

  return (
    <Container>
      <HeaderMenu />
      <DialogModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmit={() => deleteTransaction(currentTransaction.id)}
      />

      <InputsDiv>
        {/* <InputDefault
          icon={FiSearch}
          name="quantity"
          maxWidth="50px"
          style={{ margin: 0 }}
          type="number"
          value={value.quantity}
          placeholder="Título"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        /> */}
        <InputDefault
          name="title"
          maxWidth="180px"
          margin={false}
          type="text"
          value={value.title}
          placeholder="Título"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        />
        <SelectDefault
          name="type"
          value={value.type}
          placeholder="Tipo"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        >
          <option value="income">entrada</option>
          <option value="outcome">saída</option>
        </SelectDefault>

        <NumberFormat
          isNumericString
          customInput={InputDefault}
          decimalScale={2}
          decimalSeparator=","
          name="price"
          margin={false}
          maxWidth="180px"
          prefix="R$ "
          placeholder="Preço"
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
          maxWidth="180px"
          margin={false}
          type="text"
          value={value.category}
          placeholder="Categoria"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        />

        {/* <InputDefault

          name="user_name"
          maxWidth="150px"
          style={{ margin: 0 }}
          type="date"
          value={value.user_name}
          placeholder="Título"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        /> */}
        <InputDefault
          name="date"
          maxWidth="180px"
          margin={false}
          type="date"
          value={value.date}
          placeholder="Data"
          onChange={(e) => {
            setValue({ ...value, [e.target.name]: e.target.value });
          }}
        />

        <Button
          onClick={handleTransaction}
          style={{ margin: 0, maxWidth: '180px', color: '#fff' }}
        >
          adicionar
        </Button>
      </InputsDiv>

      <Section>
        <header>
          <TotalBox>
            <div>
              <p>Entradas</p>
              <FiArrowUpCircle size={32} color="#12a454" />
            </div>
            <h1>R$ {numeral(Number(balance.income)).format('0,0.00')}</h1>
          </TotalBox>
          <TotalBox>
            <div>
              <p>Saídas</p>
              <FiArrowDownCircle size={32} color="#e83f5b" />
            </div>
            <h1>R$ {numeral(Number(balance.outcome)).format('0,0.00')}</h1>
          </TotalBox>
          <TotalBox total>
            <div>
              <p>Total</p>
              <MdAttachMoney size={32} color="#f4ede8" />
            </div>
            <h1>R$ {numeral(Number(balance.total)).format('0,0.00')}</h1>
          </TotalBox>
        </header>
        <ModalInput>
          <div style={{ display: 'flex' }}>
            {value.filter === 'type' ? (
              <SelectDefault
                name="search"
                style={{ width: '300px', margin: '0 8px' }}
                value={searchValue}
                placeholder="Filtrar"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              >
                <option value="income">entrada</option>
                <option value="outcome">saída</option>
              </SelectDefault>
            ) : (
              <InputDefault
                icon={FiSearch}
                name="search"
                maxWidth="300px"
                type="text"
                margin={false}
                style={{ marginRight: '8px' }}
                value={searchValue}
                placeholder="Filtrar"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            )}
            <SelectDefault
              name="filter"
              value={value.filter}
              placeholder="Filtro"
              onChange={(e) => {
                setSearchValue('');

                e.target.value === 'type' && setSearchValue('income');

                setValue({ ...value, [e.target.name]: e.target.value });
              }}
            >
              <option value="title">Título</option>
              <option value="price">Preço</option>
              <option value="type">Tipo</option>
              <option value="category">Categoria</option>
            </SelectDefault>
          </div>
          <div style={{ display: 'flex' }}>
            <InputDefault
              name="start_date"
              maxWidth="180px"
              type="date"
              value={value.start_date}
              margin={false}
              placeholder="Título"
              onChange={(e) => {
                setValue({ ...value, [e.target.name]: e.target.value });
              }}
            />
            <InputDefault
              name="finish_date"
              maxWidth="180px"
              margin={false}
              type="date"
              value={value.finish_date}
              placeholder="Filtrar"
              onChange={(e) => {
                setValue({ ...value, [e.target.name]: e.target.value });
              }}
            />
          </div>
        </ModalInput>
        <Table>
          <table>
            <thead>
              <tr>
                <th onClick={() => changeOrdination('title')}>
                  Título{' '}
                  {sortTypeNow === 'title' ? (
                    sortStatus === 'down' ? (
                      <MdExpandLess cursor="pointer" />
                    ) : (
                      <MdExpandMore cursor="pointer" />
                    )
                  ) : (
                    <MdUnfoldMore cursor="pointer" />
                  )}
                </th>
                <th onClick={() => changeOrdination('price')}>
                  Preço
                  {sortTypeNow === 'price' ? (
                    sortStatus === 'down' ? (
                      <MdExpandLess cursor="pointer" />
                    ) : (
                      <MdExpandMore cursor="pointer" />
                    )
                  ) : (
                    <MdUnfoldMore cursor="pointer" />
                  )}
                </th>
                <th onClick={() => changeOrdination('category')}>
                  Categoria
                  {sortTypeNow === 'category' ? (
                    sortStatus === 'down' ? (
                      <MdExpandLess cursor="pointer" />
                    ) : (
                      <MdExpandMore cursor="pointer" />
                    )
                  ) : (
                    <MdUnfoldMore cursor="pointer" />
                  )}
                </th>

                <th onClick={() => changeOrdination('date')}>
                  Data
                  {sortTypeNow === 'date' ? (
                    sortStatus === 'down' ? (
                      <MdExpandLess cursor="pointer" />
                    ) : (
                      <MdExpandMore cursor="pointer" />
                    )
                  ) : (
                    <MdUnfoldMore cursor="pointer" />
                  )}
                </th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                sortArray(transactions, sortStatus, sortTypeNow).map(
                  (transaction) => {
                    return (
                      <tr key={transaction.id}>
                        <td>{transaction.title}</td>
                        <td
                          style={{
                            color:
                              transaction.type === 'outcome'
                                ? '#e83f5b'
                                : '#12a454',
                          }}
                        >
                          R$ {transaction.type === 'outcome' ? '-' : ''}
                          {numeral(Number(transaction.price)).format('0,0.00')}
                        </td>
                        <td>{transaction.category}</td>

                        <td>
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </td>
                        <td>
                          <MdDeleteForever
                            onClick={() => {
                              setOpenModal(true);
                              setCurrentTransaction(transaction);
                            }}
                            color="#e83f5b"
                            cursor="pointer"
                          />
                        </td>
                      </tr>
                    );
                  },
                )
              ) : (
                <tr>
                  <td colSpan={5}>Sem transações</td>
                </tr>
              )}
            </tbody>
          </table>
        </Table>
      </Section>
    </Container>
  );
};

export default Financial;
