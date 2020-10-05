import { Tooltip } from '@material-ui/core';
import { addDays, format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { MdInfoOutline } from 'react-icons/md';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import HeaderMenu from '../../../components/Header';
import InputDefault from '../../../components/InputDefault';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import api from '../../../services/api';
import EnterpriseImg from '../../../assets/empresa.png';

import { Container, UserInfo, DivCategory, Category } from './styles';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
  celphone: string;
}

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  start_hour: string;
  description_id?: string;
  category_id: string;
  capacity: number;
  day_week: number;
  pending_scheduling?: number;
  hour_to_schedule: number;
  user_name?: string;
}

interface Appointment {
  id: string;
  user: User;
  date: Date;

  service: Service;
}

const ClientDetail: React.FC = () => {
  const { client_id } = useParams();
  const history = useHistory();
  const toast = useToast();

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const [loading, setLoading] = useState(false);
  const [selectectedDay, setSelectectedDay] = useState<number>(0);
  const [user, setUser] = useState<User>({} as User);
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectectedService, setSelectectedService] = useState<Service>(
    {} as Service,
  );
  const [services, setServices] = useState<Service[]>([]);
  const [futureAppointment, setFutureAppointment] = useState<Appointment[]>([]);
  const [allAppointment, setAllAppointment] = useState<Appointment[]>([]);
  const [
    selectectedCategory,
    setSelectectedCategory,
  ] = useState<Category | null>(null);

  useEffect(() => {
    api.get(`/services/category/${myEnterprise.id}`).then((response) => {
      setSelectectedCategory(response.data[0]);
      setCategories(response.data);
    });
  }, [myEnterprise.id]);

  const getUserAppointments = useCallback(async () => {
    api.get(`/appointments/client/${client_id}`).then((response) => {
      setAllAppointment(response.data.pastAppointments);
      setFutureAppointment(response.data.futureAppointments);
    });
  }, [client_id]);

  const getUserDetail = useCallback(async () => {
    api.get(`/invites/client-detail/${client_id}`).then((response) => {
      setUser(response.data);
    });
  }, [client_id, setUser]);

  const getServices = useCallback(async () => {
    api
      .get(
        `/services/category/${selectectedCategory?.id}/day/${selectectedDay}`,
      )
      .then((response) => {
        setServices(response.data);
      });
  }, [selectectedCategory, selectectedDay]);

  useEffect(() => {
    getServices();
  }, [selectectedCategory, selectectedDay]);

  useEffect(() => {
    getUserDetail();
    getUserAppointments();
  }, [client_id]);

  const handlePressWeek = useCallback(
    (day) => {
      setSelectectedDay(day);
    },
    [selectectedDay],
  );

  const handleAppointment = useCallback(async () => {
    try {
      const body = {
        service_id: selectectedService.id,
        customer_id: client_id,
        start_date: addDays(new Date(date), 1),
      };

      const response = await api.post(`/appointments/create-list`, body);

      getUserAppointments();
      toast.addToast({
        type: 'success',
        title: `${response.data.length} horários agendados!`,
      });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao agendar este horário, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao agendar este horário, tente novamente',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast, selectectedService.id, client_id, date, getUserAppointments]);

  return (
    <Container>
      <header>
        <div>
          <Link to={routes.plan}>
            <FiArrowLeft />
          </Link>
          <span>{myEnterprise && myEnterprise.name}</span>
          <img src={myEnterprise.logo_url || EnterpriseImg} alt="NaHora" />
        </div>
      </header>
      <div>
        <UserInfo>
          <img
            src={
              user.avatar_url ||
              `https://api.adorable.io/avatars/285/${user.id}.png`
            }
            alt=""
          />
          <h2>{user.name}</h2>
          <hr />
          <span>Email: </span>
          <span>{user.email}</span>
          <span style={{ marginTop: '12px' }}>Telefone:</span>
          <span>{user.celphone}</span>
          <hr />
          <span style={{ marginTop: '12px' }}>Agendamentos Pendentes:</span>
          <span>{futureAppointment.length}</span>
          <span style={{ marginTop: '12px' }}>Total de agendamentos:</span>
          <span>{allAppointment.length}</span>
        </UserInfo>
        <div>
          <h2 style={{ margin: 20 }}>
            Agendar horários fixos até a data de expiração do plano.
          </h2>
          <Category primaryColor="#28262e" secondaryColor="#ff9000">
            <span>Serviço: </span>
            <div>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <DivCategory
                    primaryColor="#28262e"
                    secondaryColor="#ff9000"
                    currentSelected={selectectedCategory?.id === category.id}
                    key={category.id}
                    onClick={() => {
                      setSelectectedCategory(category);
                    }}
                  >
                    <span>{category.name}</span>
                  </DivCategory>
                ))
              ) : (
                <span>
                  Cadastre seus serviços,{' '}
                  <strong
                    onClick={() => history.push(routes.enterpriseSchedule)}
                  >
                    clique aqui
                  </strong>
                </span>
              )}
            </div>
            <span>Selecione o dia: </span>
            <div>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 0}
                onClick={() => {
                  handlePressWeek(0);
                }}
              >
                <span>Domingo</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 1}
                onClick={() => {
                  handlePressWeek(1);
                }}
              >
                <span>Segunda</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 2}
                onClick={() => {
                  handlePressWeek(2);
                }}
              >
                <span>Terça</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 3}
                onClick={() => {
                  handlePressWeek(3);
                }}
              >
                <span>Quarta</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 4}
                onClick={() => {
                  handlePressWeek(4);
                }}
              >
                <span>Quinta</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 5}
                onClick={() => {
                  handlePressWeek(5);
                }}
              >
                <span>Sexta</span>
              </DivCategory>

              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDay === 6}
                onClick={() => {
                  handlePressWeek(6);
                }}
              >
                <span>Sábado</span>
              </DivCategory>
            </div>
            <span>Selecione o horário: </span>
            <div>
              {services && services.length > 0 ? (
                services.map((service) => (
                  <DivCategory
                    primaryColor="#28262e"
                    secondaryColor="#ff9000"
                    currentSelected={selectectedService?.id === service.id}
                    key={service.id}
                    onClick={() => {
                      setSelectectedService(service);
                    }}
                  >
                    <span>{service.start_hour}</span>
                  </DivCategory>
                ))
              ) : (
                <span>
                  Nenhum horário cadastrado com agendamento pendente ativo,{' '}
                  <strong
                    onClick={() => history.push(routes.enterpriseSchedule)}
                  >
                    clique aqui
                  </strong>{' '}
                  e crie.
                </span>
              )}
            </div>
            <Tooltip title="Agendará automaticamente em todos horários selecionados do dia marcado até o dia de expiração do plano.">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                À partir de :
                <MdInfoOutline />
              </span>
            </Tooltip>

            <div>
              <InputDefault
                name="date"
                maxWidth="180px"
                margin={false}
                type="date"
                value={date}
                placeholder="Data"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>

            <Button
              secondaryColor="#ff9000"
              style={{ maxWidth: '180px' }}
              primaryColor="#28262e"
              onClick={handleAppointment}
              loading={loading}
            >
              <FiCheckCircle />
              Confirmar
            </Button>
          </Category>
        </div>
      </div>
    </Container>
  );
};

export default ClientDetail;
