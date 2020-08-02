import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  FiSearch,
  FiArrowDown,
  FiArrowDownCircle,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
} from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import {
  Container,
  Content,
  Card,
  Title,
  SubTitle,
  Text,
  CadastraButton,
  SearchContent,
  MyEnterprises,
  CardMine,
} from './styles';

import 'react-day-picker/lib/style.css';

import HeaderMenu from '../../components/Header';
import InputDefault from '../../components/InputDefault';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

interface OpenModal {
  [key: string]: boolean;
}

interface Enterprise {
  id: string;
  name: string;
  address: string;
  area: string;
  open_hour: string;
  close_hour: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  friends: boolean;
}

interface User {
  id: string;
  avatar_url: string;
  name: string;
}

interface Service {
  id: string;
  disabled: boolean;
  start_hour: string;
  capacity: number;
  appointments: Appointment[];
  description: {
    title: string;
    description: string;
  };
}

interface Appointment {
  id: string;
  user: User;
  date: Date;
  enterprise: Enterprise;
  service: Service;
}

interface ListAppointment {
  futureAppointments: Appointment[];
  pastAppointments: Appointment[];
}

const Enterprises: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const { user } = useAuth();

  const [openShedule, setOpenShedule] = useState<OpenModal>({});

  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [myAppointments, setMyAppointments] = useState<ListAppointment>();

  const getMyAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/appointments/me`);

      setMyAppointments(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    getMyAppointments();
  }, []);

  // const selectedDateAsText = useMemo((selectedDate) => {
  //   return format(selectedDate, "'Dia' dd 'de' MMMM", {
  //     locale: ptBr,
  //   });
  // }, []);

  return (
    <Container>
      <HeaderMenu />
      <Content>
        <div>
          <span>Próximos Agendamentos:</span>
          {myAppointments && myAppointments.futureAppointments.length > 0 ? (
            myAppointments.futureAppointments.map((appointment) => {
              return (
                <Card
                  onClick={() =>
                    setOpenShedule({
                      ...openShedule,
                      [appointment.id]: !openShedule[appointment.id],
                    })
                  }
                >
                  <div>
                    <div>
                      <img
                        src={
                          appointment.enterprise.logo_url ||
                          `https://api.adorable.io/avatars/285/${appointment.id}.png`
                        }
                        alt="logo empresa"
                      />
                      <span>{appointment.enterprise.name}</span>
                      <span style={{ fontSize: '14px' }}>
                        {format(
                          new Date(appointment.date),
                          "HH:mm'h' dd/MM/yyyy",
                          {
                            locale: ptBr,
                          },
                        )}
                      </span>
                    </div>
                    {!openShedule[appointment.id] ? (
                      <FiChevronDown
                        onClick={() =>
                          setOpenShedule({
                            ...openShedule,
                            [appointment.id]: true,
                          })
                        }
                        cursor="pointer"
                        size={20}
                        color="#ff9000"
                      />
                    ) : (
                      <FiChevronUp
                        onClick={() =>
                          setOpenShedule({
                            ...openShedule,
                            [appointment.id]: false,
                          })
                        }
                        cursor="pointer"
                        size={20}
                        color="#ff9000"
                      />
                    )}
                  </div>
                  {openShedule[appointment.id] && (
                    <main>
                      <hr />
                      <span>
                        <FiUsers size={20} color="#ff9000" />
                        Usuários agendados:
                        {appointment.service.appointments.length}/
                        {appointment.service.capacity}
                      </span>
                      {appointment.service.appointments &&
                        appointment.service.appointments.map(
                          (currentAppointment) => {
                            return (
                              <div>
                                <img
                                  src={
                                    currentAppointment.user.avatar_url ||
                                    `https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png`
                                  }
                                  alt="User Logo"
                                />
                                <span>{currentAppointment.user.name}</span>
                              </div>
                            );
                          },
                        )}
                    </main>
                  )}
                </Card>
              );
            })
          ) : (
            <>
              <br />
              <br />
              Nenhum agendamento futuro.
            </>
          )}
        </div>
        <div>
          <span>Agendamentos Passados:</span>
          {myAppointments && myAppointments.pastAppointments.length > 0 ? (
            myAppointments.pastAppointments.map((appointment) => {
              return (
                <Card
                  past
                  onClick={() =>
                    setOpenShedule({
                      ...openShedule,
                      [appointment.id]: !openShedule[appointment.id],
                    })
                  }
                >
                  <div>
                    <div>
                      <img
                        src={
                          appointment.enterprise.logo_url ||
                          `https://api.adorable.io/avatars/285/${appointment.id}.png`
                        }
                        alt="logo empresa"
                      />
                      <span>{appointment.enterprise.name}</span>
                      <span style={{ fontSize: '14px' }}>
                        {format(
                          new Date(appointment.date),
                          "HH:mm'h' dd/MM/yyyy",
                          {
                            locale: ptBr,
                          },
                        )}
                      </span>
                    </div>
                    {!openShedule[appointment.id] ? (
                      <FiChevronDown
                        onClick={() =>
                          setOpenShedule({
                            ...openShedule,
                            [appointment.id]: !openShedule[appointment.id],
                          })
                        }
                        cursor="pointer"
                        size={20}
                        color="#ff9000"
                      />
                    ) : (
                      <FiChevronUp
                        onClick={() =>
                          setOpenShedule({
                            ...openShedule,
                            [appointment.id]: false,
                          })
                        }
                        cursor="pointer"
                        size={20}
                        color="#ff9000"
                      />
                    )}
                  </div>
                  {openShedule[appointment.id] && (
                    <main>
                      <hr />
                      <span>
                        <FiUsers size={20} color="#ff9000" />
                        Usuários agendados:{' '}
                        {appointment.service.appointments.length}/
                        {appointment.service.capacity}
                      </span>
                      {appointment.service.appointments &&
                        appointment.service.appointments.map(
                          (currentAppointment) => {
                            return (
                              <div>
                                <img
                                  src={
                                    currentAppointment.user.avatar_url ||
                                    `https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png`
                                  }
                                  alt="User Logo"
                                />
                                <span>{currentAppointment.user.name}</span>
                              </div>
                            );
                          },
                        )}
                    </main>
                  )}
                </Card>
              );
            })
          ) : (
            <>
              <br />
              <br />
              Nenhum agendamento futuro.
            </>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default Enterprises;
