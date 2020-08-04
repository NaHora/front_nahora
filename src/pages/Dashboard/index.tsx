import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FiClock,
  FiArrowLeft,
  FiUsers,
  FiHome,
  FiX,
  FiCheckCircle,
} from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, getDay, getYear, getMonth, getDate } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Content,
  Schedule,
  Section,
  Appointment,
  Calendar,
  Category,
  ButtonContainer,
  DivCategory,
  ModalUsers,
} from './styles';
import 'react-day-picker/lib/style.css';
import api from '../../services/api';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

interface User {
  id: string;
  avatar_url: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  user: User;
  date: Date;
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

const Dashboard: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekDay, setCurrentWeekDay] = useState(getDay(new Date()));
  const [openModal, setOpeModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectectedService, setSelectectedService] = useState<Service | null>(
    null,
  );
  const [
    selectectedCategory,
    setSelectectedCategory,
  ] = useState<Category | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string | null>('#28262e');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(
    '#ff9000',
  );

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    // if (modifiers.available && !modifiers.disabled) {
    setSelectedDate(day);
    setCurrentWeekDay(getDay(day));
    // }
  }, []);

  useEffect(() => {
    api.get(`/services/category/${thisEnterprise.id}`).then((response) => {
      setSelectectedCategory(response.data[0]);
      setCategories(response.data);
    });
  }, [thisEnterprise.id]);

  const handleServices = useCallback(async () => {
    try {
      const response = await api.get(
        `/services/enterprise/${
          thisEnterprise.id
        }/day/${currentWeekDay}/category/${selectectedCategory?.id}/${getYear(
          selectedDate,
        )}/${getMonth(selectedDate)}/${getDate(selectedDate)}`,
      );
      setServices(response.data);
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title: 'Vishi',
          description:
            err.response.data.message ||
            'Ocorreu um erro ao procurar empresas, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Vishi',
          description:
            'Ocorreu um erro ao procurar os serviços, tente novamente',
        });
      }
    }
  }, [
    thisEnterprise.id,
    currentWeekDay,
    toast,
    selectectedCategory,
    selectedDate,
  ]);

  // const selectedDateWithHourService = useMemo(() => {
  //   const [hour, minute] = selectectedService?.start_hour.split(':');

  //   return new Date(
  //     getYear(new Date(selectedDate)),
  //     getMonth(new Date(selectedDate)),
  //     getDate(new Date(selectedDate)),
  //     Number(hour) || 0,
  //     Number(minute) || 0,
  //   );
  // }, [selectedDate, selectectedService]);

  const handleAppointment = useCallback(
    async (service_id) => {
      setLoading(true);
      try {
        const body = {
          service_id,
          enterprise_id: thisEnterprise.id,
          service_date: selectedDate,
        };
        await api.post(`/appointments`, body);

        history.push(routes.schedule);

        toast.addToast({
          type: 'success',
          title: 'Boa!',
          description: 'Agendamento realizado com sucesso.',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title: 'Vishi',
            description:
              err.response.data.message ||
              'Ocorreu um erro ao agendar este horário, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Vishi',
            description:
              'Ocorreu um erro ao agendar este horário, tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [thisEnterprise.id, toast, selectedDate, history],
  );

  useEffect(() => {
    if ((thisEnterprise.id, currentWeekDay, selectectedCategory)) {
      handleServices();
    }
  }, [thisEnterprise.id, currentWeekDay, selectectedCategory]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBr,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBr,
    });
  }, [selectedDate]);

  const morningServices = useMemo(() => {
    return services.filter((service) => {
      return Number(service.start_hour.replace(':', '')) < 1200;
    });
  }, [services]);

  const afternoonServices = useMemo(() => {
    return services.filter((service) => {
      return (
        Number(service.start_hour.replace(':', '')) >= 1200 &&
        Number(service.start_hour.replace(':', '')) < 1800
      );
    });
  }, [services]);

  const nightServices = useMemo(() => {
    return services.filter((service) => {
      return Number(service.start_hour.replace(':', '')) >= 1800;
    });
  }, [services]);

  return (
    <Container
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      {openModal && (
        <ModalUsers
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
        >
          <FiX
            onClick={() => setOpeModal(false)}
            cursor="pointer"
            color={primaryColor || '#28262e'}
            style={{ alignSelf: 'flex-end' }}
          />
          <span>
            <FiHome />
            {thisEnterprise.name}
          </span>
          <span>
            <GoLocation />
            {thisEnterprise.address}
          </span>
          <span>
            <FiClock />
            {selectedDateAsText} {selectectedService?.start_hour}h
          </span>
          <br />
          <span>
            <FiUsers />
            Usuários que marcaram horário:
          </span>
          <div>
            {appointments.map((appointment) => (
              <span key={appointment.id}>
                <img
                  src={
                    appointment.user.avatar_url ||
                    `https://api.adorable.io/avatars/285/${appointment.user.id}.png`
                  }
                  alt=""
                />
                {appointment.user.name}
              </span>
            ))}
          </div>
          <Button
            style={{ marginTop: 'auto' }}
            primaryColor={secondaryColor || '#ff9000'}
            secondaryColor={primaryColor || '#28262e'}
            onClick={() => handleAppointment(selectectedService?.id)}
            loading={loading}
          >
            <FiCheckCircle />
            Confirmar
          </Button>
        </ModalUsers>
      )}
      <header>
        <div>
          <Link to={routes.enterprise}>
            <FiArrowLeft />
          </Link>
          <span
            onClick={() => {
              if (user.id === thisEnterprise.owner_id) {
                setPrimaryColor(secondaryColor);
                setSecondaryColor(primaryColor);
              }
            }}
          >
            {thisEnterprise && thisEnterprise.name}
          </span>
          <img
            src={
              thisEnterprise.logo_url ||
              `https://api.adorable.io/avatars/285/${thisEnterprise.id}.png`
            }
            alt="GoBarber"
          />
        </div>
      </header>
      <Category
        primaryColor={primaryColor || '#28262e'}
        secondaryColor={secondaryColor || '#ff9000'}
      >
        <span>Serviços: </span>
        <div>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <DivCategory
                primaryColor={primaryColor || '#28262e'}
                secondaryColor={secondaryColor || '#ff9000'}
                currentSelected={selectectedCategory?.id === category.id}
                key={category.id}
                onClick={() => setSelectectedCategory(category)}
              >
                <span>{category.name}</span>
              </DivCategory>
            ))
          ) : (
            <span>Empresa sem serviços</span>
          )}
        </div>
      </Category>
      <Content>
        <Schedule
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
        >
          <h1>Horários</h1>
          <p>
            {isToday(selectedDate) && <span> Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <Section
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <strong>Manhã</strong>

            {morningServices.length === 0 && (
              <p>Nenhum serviço neste período</p>
            )}
            <div>
              {morningServices.map((service) => (
                <Appointment
                  disabled={service.disabled}
                  onClick={() => {
                    setOpeModal(true);
                    setAppointments(service.appointments);
                    setSelectectedService(service);
                  }}
                  primaryColor={primaryColor || '#28262e'}
                  secondaryColor={secondaryColor || '#ff9000'}
                  key={service.id}
                  currentSelected={selectectedService?.id === service.id}
                >
                  <span style={{ marginRight: '16px' }}>
                    <FiClock /> {service.start_hour}
                  </span>
                  <span>
                    <FiUsers /> {service.appointments.length}/{service.capacity}
                  </span>
                </Appointment>
              ))}
            </div>
          </Section>
          <Section
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <strong>Tarde</strong>

            {afternoonServices.length === 0 && (
              <p>Nenhum serviço neste período</p>
            )}
            <div>
              {afternoonServices.map((service) => (
                <Appointment
                  onClick={() => {
                    setOpeModal(true);
                    setAppointments(service.appointments);
                    setSelectectedService(service);
                  }}
                  primaryColor={primaryColor || '#28262e'}
                  disabled={service.disabled}
                  secondaryColor={secondaryColor || '#ff9000'}
                  key={service.id}
                  currentSelected={selectectedService?.id === service.id}
                >
                  <span style={{ marginRight: '16px' }}>
                    <FiClock /> {service.start_hour}
                  </span>
                  <span>
                    <FiUsers /> {service.appointments.length}/{service.capacity}
                  </span>
                </Appointment>
              ))}
            </div>
          </Section>
          <Section
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <strong>Noite</strong>

            {nightServices.length === 0 && <p>Nenhum serviço neste período</p>}
            <div>
              {nightServices.map((service) => (
                <Appointment
                  onClick={() => {
                    setOpeModal(true);
                    setAppointments(service.appointments);
                    setSelectectedService(service);
                  }}
                  primaryColor={primaryColor || '#28262e'}
                  disabled={service.disabled}
                  secondaryColor={secondaryColor || '#ff9000'}
                  key={service.id}
                  currentSelected={selectectedService?.id === service.id}
                >
                  <span style={{ marginRight: '16px' }}>
                    <FiClock /> {service.start_hour}
                  </span>
                  <span>
                    <FiUsers /> {service.appointments.length}/{service.capacity}
                  </span>
                </Appointment>
              ))}
            </div>
          </Section>
        </Schedule>
        <Calendar
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
        >
          <DayPicker
            weekdaysShort={
              window.screen.width > 600
                ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
                : ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
            }
            fromMonth={new Date()}
            disabledDays={[{ before: new Date() }]}
            modifiers={{
              available: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
      <ButtonContainer>
        {!openModal && (
          <Button
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
            onClick={() => handleAppointment(selectectedService?.id)}
            loading={loading}
          >
            <FiCheckCircle />
            Confirmar
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default Dashboard;
