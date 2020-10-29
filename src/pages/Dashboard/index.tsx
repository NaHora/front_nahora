import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  FiClock,
  FiArrowLeft,
  FiUsers,
  FiHome,
  FiX,
  FiCheckCircle,
  FiChevronRight,
  FiChevronLeft,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, getDay, getYear, getMonth, getDate } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EnterpriseImg from '../../assets/empresa.png';
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
import { removeMask } from '../../utils';
import { useSocket } from '../../hooks/socket';
import { useLoad } from '../../hooks/load';
import Avatar from '../../components/Avatar';
import EnterpriseHeader from '../../components/EnterpriseHeader';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'black',
  },
  divButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));
interface User {
  id: string;
  avatar_url: string;
  name: string;
  celphone: string;
  isPrivate: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  service_id: string;
  enterprise_id: string;
  user: User;
  date: Date;
}

interface ModalData {
  morning: boolean;
  afternoom: boolean;
  night: boolean;
}

interface Service {
  id: string;
  disabled: boolean;
  start_hour: string;
  capacity: number;
  category_id: string;
  appointments: Appointment[];
  description: {
    title: string;
    description: string;
  };
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

interface AboutDays {
  availableDays: number[];

  disabledDays: number[];
}

interface LimitOptions {
  [key: string]: boolean;
}

const Dashboard: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
  // const { socket } = useSocket();
  const { start, stop } = useLoad();

  const morningRef = useRef<any>(null);
  const afternoomRef = useRef<any>(null);
  const nightRef = useRef<any>(null);

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const owner_enterprise = thisEnterprise.owner_id === user.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekDay, setCurrentWeekDay] = useState(getDay(new Date()));
  const [currentCustomer, setCurrentCustomer] = useState<any>('');
  const [openModal, setOpeModal] = useState<ModalData | any>({});
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
  const [currentService, setCurrentService] = useState('');
  const [aboutDays, setAboutDays] = useState<AboutDays>({
    availableDays: [],
    disabledDays: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(
    '#ff9000',
  );
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [limits, setLimits] = useState({
    leftmorning: true,
    leftafternoom: true,
    leftnight: true,
  } as LimitOptions);
  const [allUsersEnterpriseAccepted, setAllUsersEnterpriseAccepted] = useState<
    Invite[]
  >([]);

  const handleOpen = (service_id: string) => {
    setCurrentService(service_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  const getAllEnterpriseAcceptedInvites = useCallback(async () => {
    try {
      const response = await api.get('/invites/enterprise/accepted');

      setAllUsersEnterpriseAccepted(response.data);
    } catch {}
  }, []);

  useEffect(() => {
    getAllEnterpriseAcceptedInvites();
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if ((modifiers.available && !modifiers.disabled) || owner_enterprise) {
      setOpeModal({});

      setSelectedDate(day);
      setCurrentWeekDay(getDay(day));
    } else {
      toast.addToast({
        type: 'error',
        title:
          'Sem Horário disponível este dia, datas com horários disponíveis ficam com um contorno.',
      });
    }
  }, []);

  useEffect(() => {
    api.get(`/services/category/${thisEnterprise.id}`).then((response) => {
      setSelectectedCategory(response.data[0]);
      setCategories(response.data);
    });
  }, [thisEnterprise.id]);

  const getAvaiableDays = useCallback(async () => {
    start();

    try {
      const response = await api.get(
        `/services/enterprise/${thisEnterprise.id}/category/${selectectedCategory?.id}`,
      );
      setAboutDays(response.data);
    } catch (err) {
    } finally {
      stop();
    }
  }, [thisEnterprise.id, selectectedCategory]);

  useEffect(() => {
    if (selectectedCategory && thisEnterprise.id) {
      getAvaiableDays();
    }
  }, [selectectedCategory, thisEnterprise.id]);

  const handleServices = useCallback(async () => {
    start();

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
          title:
            err.response.data.message ||
            'Ocorreu um erro ao procurar serviços, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao procurar os serviços, tente novamente',
        });
      }
    } finally {
      stop();
    }
  }, [
    thisEnterprise.id,
    currentWeekDay,
    toast,
    selectectedCategory,
    selectedDate,
    start,
    stop,
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
      setOpeModal({});
      try {
        if (currentCustomer === 'full-schedule-service') {
          const body = {
            service_id,

            service_date: selectedDate,
          };
          await api.post(`/appointments/full-time`, body);

          handleServices();
          return toast.addToast({
            type: 'success',
            title: 'Vagas encerradas com sucesso.',
          });
        }
        const body = {
          service_id,
          enterprise_id: thisEnterprise.id,
          service_date: selectedDate,
          customer_id: currentCustomer,
        };
        await api.post(`/appointments`, body);

        if (!currentCustomer && !owner_enterprise) {
          history.push(routes.schedule);
        }
        handleServices();

        toast.addToast({
          type: 'success',
          title: 'Agendamento realizado com sucesso.',
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
    },
    [thisEnterprise.id, toast, selectedDate, history, currentCustomer],
  );

  const deleteAppointment = useCallback(
    async (service_id) => {
      try {
        await api.delete(`/services/${service_id}`);

        handleClose();
        handleServices();

        toast.addToast({
          type: 'success',
          title: 'Horário excluído !',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao excluir este horário, tente novamente',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao excluir este horário, tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [toast, handleServices],
  );

  useEffect(() => {
    if (thisEnterprise.id && currentWeekDay && selectectedCategory) {
      handleServices();
    }
  }, [thisEnterprise.id, currentWeekDay, selectectedCategory, selectedDate]);

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
    return services
      .filter((service) => {
        return Number(service.start_hour.replace(':', '')) < 1200;
      })
      .sort(function (a, b) {
        if (a.start_hour > b.start_hour) {
          return 1;
        }
        if (a.start_hour < b.start_hour) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
  }, [services]);

  const afternoonServices = useMemo(() => {
    return services
      .filter((service) => {
        return (
          Number(service.start_hour.replace(':', '')) >= 1200 &&
          Number(service.start_hour.replace(':', '')) < 1800
        );
      })
      .sort(function (a, b) {
        if (a.start_hour > b.start_hour) {
          return 1;
        }
        if (a.start_hour < b.start_hour) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
  }, [services]);

  const nightServices = useMemo(() => {
    return services
      .filter((service) => {
        return Number(service.start_hour.replace(':', '')) >= 1800;
      })
      .sort(function (a, b) {
        if (a.start_hour > b.start_hour) {
          return 1;
        }
        if (a.start_hour < b.start_hour) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
  }, [services]);

  const scrollWhell = useCallback(
    (e, ref, period) => {
      const { scrollLeft } = ref.current;
      const totalScrollRight =
        ref.current.scrollWidth - ref.current.offsetWidth;
      const scrollRight = totalScrollRight - ref.current.scrollLeft;
      const nameLeft = `left${period}`;
      const nameRight = `right${period}`;

      if (scrollLeft === 0 && scrollRight === 0) {
        setLimits({ ...limits, [nameLeft]: true, [nameRight]: true });
      }
      if (scrollLeft === 0 && scrollRight !== 0) {
        setLimits({ ...limits, [nameLeft]: true, [nameRight]: false });
      }
      if (scrollLeft !== 0 && scrollRight === 0) {
        setLimits({ ...limits, [nameLeft]: false, [nameRight]: true });
      }
      if (scrollLeft !== 0 && scrollRight !== 0) {
        setLimits({ ...limits, [nameLeft]: false, [nameRight]: false });
      }

      if (e.deltaY > 0) {
        ref?.current?.scrollBy(200, 0);
      } else {
        ref?.current?.scrollBy(-200, 0);
      }
    },
    [limits],
  );

  const scrollClick = useCallback(
    (ref, value, period) => {
      const { scrollLeft } = ref.current;
      const totalScrollRight =
        ref.current.scrollWidth - ref.current.offsetWidth;
      const scrollRight = totalScrollRight - ref.current.scrollLeft;
      const nameLeft = `left${period}`;
      const nameRight = `right${period}`;

      if (scrollLeft === 0 && scrollRight === 0) {
        setLimits({ ...limits, [nameLeft]: true, [nameRight]: true });
      }
      if (scrollLeft === 0 && scrollRight !== 0) {
        setLimits({ ...limits, [nameLeft]: true, [nameRight]: false });
      }
      if (scrollLeft !== 0 && scrollRight === 0) {
        setLimits({ ...limits, [nameLeft]: false, [nameRight]: true });
      }
      if (scrollLeft !== 0 && scrollRight !== 0) {
        setLimits({ ...limits, [nameLeft]: false, [nameRight]: false });
      }

      if (value < 0 && scrollLeft !== 0) {
        ref?.current?.scrollBy(value, 0);
      } else if (value > 0 && scrollRight !== 0) {
        ref?.current?.scrollBy(value, 0);
      }
    },
    [limits],
  );

  // useEffect(() => {
  //   console.log(morningRef);

  //   const { scrollLeft } = morningRef.current;

  //   const totalScrollRight =
  //     morningRef.current.scrollWidth - morningRef.current.offsetWidth;

  //   const scrollRight = totalScrollRight - morningRef.current.scrollLeft;

  //   console.log(scrollRight);

  //   if (scrollLeft === 0 && scrollRight === 0) {
  //     setLimits({ ...limits, leftmorning: true, rightmorning: true });
  //   }
  // }, [morningRef, limits]);

  const showServices = useCallback(
    (ref, array, period) => {
      return array.length > 0 ? (
        <main>
          <FiChevronLeft
            size={30}
            style={limits[`left${period}`] ? { opacity: 0.3 } : { opacity: 1 }}
            cursor="pointer"
            onClick={() => scrollClick(ref, -100, period)}
          />

          <div ref={ref}>
            {array.map((service: Service) => (
              <Appointment
                onWheel={(e) => scrollWhell(e, ref, period)}
                primaryColor={primaryColor || '#28262e'}
                disabled={service.disabled}
                secondaryColor={secondaryColor || '#ff9000'}
                key={service.id}
                currentSelected={selectectedService?.id === service.id}
              >
                <div
                  onClick={() => {
                    if (!service.disabled || owner_enterprise) {
                      setOpeModal({ [period]: true });
                      setAppointments(service.appointments);
                      setSelectectedService(service);
                    } else {
                      toast.addToast({
                        type: 'error',
                        title: 'Horário indisponível',
                      });
                    }
                  }}
                >
                  <span style={{ marginRight: '16px' }}>
                    <FiClock /> {service.start_hour}
                  </span>
                  <span>
                    <FiUsers /> {service.appointments.length}/{service.capacity}
                  </span>
                </div>
                {user.id === thisEnterprise.owner_id && (
                  <span style={{ marginLeft: '8px' }}>
                    <FiX
                      cursor="pointer"
                      onClick={() => handleOpen(service.id)}
                    />
                  </span>
                )}
              </Appointment>
            ))}
          </div>
          <FiChevronRight
            cursor="pointer"
            size={30}
            style={limits[`right${period}`] ? { opacity: 0.3 } : { opacity: 1 }}
            onClick={() => scrollClick(ref, 100, period)}
          />
        </main>
      ) : owner_enterprise ? (
        <span>
          Cadastre seus horários para este período,{' '}
          <strong onClick={() => history.push(routes.enterpriseSchedule)}>
            clique aqui
          </strong>
        </span>
      ) : (
        <p>Nenhum serviço neste período</p>
      );
    },
    [
      history,
      primaryColor,
      secondaryColor,
      scrollWhell,
      scrollClick,
      owner_enterprise,
      toast,
      selectectedService,
      thisEnterprise.owner_id,
      user.id,
      limits,
    ],
  );

  const showServiceModal = useCallback(
    (period) => {
      return (
        openModal[period] && (
          <ModalUsers
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <FiX
              onClick={() => setOpeModal({ [period]: false })}
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
              {selectectedCategory?.name}
            </span>
            <span>
              <FiClock />
              {selectedDateAsText} {selectectedService?.start_hour}h
            </span>
            <br />
            {owner_enterprise && (
              <select
                value={currentCustomer}
                name="customer"
                onChange={(e) => setCurrentCustomer(e.target.value)}
              >
                <option value="full-schedule-service">
                  Ocupar todo horário
                </option>
                <option value="">Agendar em seu nome</option>
                {allUsersEnterpriseAccepted &&
                  allUsersEnterpriseAccepted.map((customer) => (
                    <option value={customer.user.id}>
                      {customer.user.name}
                    </option>
                  ))}
              </select>
            )}
            <span>
              {appointments.length > 0 ? (
                <>
                  <FiUsers />
                  Usuários que marcaram horário:
                </>
              ) : (
                <>Ninguém se agendou até o momento.</>
              )}
            </span>
            <div>
              {appointments.map((appointment, index) => (
                <span key={appointment.id}>
                  {index + 1}-{'  '}
                  <Avatar
                    width={30}
                    height={30}
                    name={appointment.user.name}
                    avatarUrl={appointment.user.avatar_url}
                    isPrivate={appointment.user.isPrivate}
                  />
                  {appointment.user.isPrivate && !owner_enterprise ? (
                    <>Anônimo</>
                  ) : (
                    appointment.user.name
                  )}
                  {user.id === thisEnterprise.owner_id && (
                    <>
                      <a
                        target="_blank"
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                        href={`https://api.whatsapp.com/send?phone=55${removeMask(
                          appointment.user.celphone,
                        )}&text=Ol%C3%A1!%20Voc%C3%AA%20marcou%20hor%C3%A1rio%20%C3%A0s%20${
                          selectectedService?.start_hour
                        }h%20${selectedDateAsText}%20na%20empresa%20${
                          thisEnterprise.name
                        }%2C%20posso%20confirmar%20seu%20agendamento%20%3F`}
                      >
                        <FaWhatsapp size={20} />
                      </a>
                      {appointment.user.celphone}
                    </>
                  )}
                </span>
              ))}
            </div>
            <ButtonContainer>
              <Button
                primaryColor={secondaryColor || '#ff9000'}
                secondaryColor={primaryColor || '#28262e'}
                onClick={() => handleAppointment(selectectedService?.id)}
                loading={loading}
              >
                <FiCheckCircle />
                Agendar
              </Button>
            </ButtonContainer>
          </ModalUsers>
        )
      );
    },
    [
      allUsersEnterpriseAccepted,
      appointments,
      currentCustomer,
      loading,
      handleAppointment,
      openModal,
      selectectedCategory,
      selectedDateAsText,
      primaryColor,
      secondaryColor,
      owner_enterprise,
      selectectedService,
      thisEnterprise.owner_id,
      thisEnterprise.name,
      user.id,
    ],
  );

  const findCategory = useCallback(() => {
    const categoryexist = categories.find((category) => {
      return category.name.toLocaleLowerCase() === 'crossfit';
    });
    if (categoryexist) {
      return true;
    }
    return false;
  }, [categories]);

  // useEffect(() => {
  //   if (thisEnterprise.id && selectectedCategory?.id && selectedDate) {
  //     socket.on(
  //       `new${thisEnterprise.id}${format(
  //         new Date(selectedDate),
  //         'dd/MM/yyyy',
  //       )}${selectectedCategory?.id}`,
  //       (appointment: { appointment: Appointment; service: Service }) => {
  //         if (
  //           appointment.appointment.enterprise_id === thisEnterprise.id &&
  //           selectectedCategory?.id === appointment.service.category_id &&
  //           isEqual(
  //             new Date(
  //               getYear(new Date(appointment.appointment.date)),
  //               getMonth(new Date(appointment.appointment.date)),
  //               getDate(new Date(appointment.appointment.date)),
  //             ),
  //             new Date(
  //               getYear(selectedDate),
  //               getMonth(selectedDate),
  //               getDate(selectedDate),
  //             ),
  //           )
  //         ) {
  //           return handleServices();
  //         }
  //       },
  //     );

  //     socket.on(
  //       `delete${thisEnterprise.id}${format(
  //         new Date(selectedDate),
  //         'dd/MM/yyyy',
  //       )}${selectectedCategory?.id}`,
  //       (appointment: { appointment: Appointment; service: Service }) => {
  //         if (
  //           appointment.appointment.enterprise_id === thisEnterprise.id &&
  //           selectectedCategory?.id === appointment.service.category_id &&
  //           isEqual(
  //             new Date(
  //               getYear(new Date(appointment.appointment.date)),
  //               getMonth(new Date(appointment.appointment.date)),
  //               getDate(new Date(appointment.appointment.date)),
  //             ),
  //             new Date(
  //               getYear(selectedDate),
  //               getMonth(selectedDate),
  //               getDate(selectedDate),
  //             ),
  //           )
  //         ) {
  //           return handleServices();
  //         }
  //       },
  //     );
  //   }
  // }, [
  //   socket,
  //   thisEnterprise.id,
  //   selectedDate,
  //   selectectedCategory,
  //   handleServices,
  // ]);

  return (
    <Container
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Deseja excluir o horário?</h2>
            <p id="transition-modal-description">
              se você confirmar terá que criar novamente o horário
            </p>
            <div className={classes.divButton}>
              <Button
                primaryColor={secondaryColor || '#ff9000'}
                secondaryColor={primaryColor || '#28262e'}
                onClick={handleClose}
                loading={loading}
                transparent
              >
                <FiCheckCircle />
                Cancelar
              </Button>
              <Button
                primaryColor={secondaryColor || '#ff9000'}
                secondaryColor={primaryColor || '#28262e'}
                onClick={() => deleteAppointment(currentService)}
                loading={loading}
              >
                <FiCheckCircle />
                Excluir
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
      <EnterpriseHeader
        service={findCategory()}
        primaryColor={primaryColor || '#28262e'}
        secondaryColor={secondaryColor || '#ff9000'}
        name={thisEnterprise.name}
        logo_url={thisEnterprise.logo_url}
      />

      <Category
        primaryColor={primaryColor || '#28262e'}
        secondaryColor={secondaryColor || '#ff9000'}
      >
        <span>Serviço: </span>
        <div>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <DivCategory
                primaryColor={primaryColor || '#28262e'}
                secondaryColor={secondaryColor || '#ff9000'}
                currentSelected={selectectedCategory?.id === category.id}
                key={category.id}
                onClick={() => {
                  setOpeModal({});

                  setSelectectedCategory(category);
                }}
              >
                <span>{category.name}</span>
              </DivCategory>
            ))
          ) : owner_enterprise ? (
            <span>
              Cadastre seus serviços,{' '}
              <strong onClick={() => history.push(routes.enterpriseSchedule)}>
                clique aqui
              </strong>
            </span>
          ) : (
            <span>Empresa sem serviços</span>
          )}
        </div>
      </Category>
      <Content>
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
            disabledDays={[
              { before: new Date() },
              { daysOfWeek: aboutDays.disabledDays },
            ]}
            modifiers={{
              available: { daysOfWeek: aboutDays.availableDays },
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
            {showServices(morningRef, morningServices, 'morning')}
            {showServiceModal('morning')}
          </Section>
          <Section
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <strong>Tarde</strong>
            {showServices(afternoomRef, afternoonServices, 'afternoom')}
            {showServiceModal('afternoom')}
          </Section>

          <Section
            primaryColor={primaryColor || '#28262e'}
            secondaryColor={secondaryColor || '#ff9000'}
          >
            <strong>Noite</strong>
            {showServices(nightRef, nightServices, 'night')}
            {showServiceModal('night')}
          </Section>
        </Schedule>
      </Content>
      {/* <ButtonContainer>
        <Button
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
          onClick={() => handleAppointment(selectectedService?.id)}
          loading={loading}
        >
          <FiCheckCircle />
          Confirmar
        </Button>
      </ButtonContainer> */}
    </Container>
  );
};

export default Dashboard;
