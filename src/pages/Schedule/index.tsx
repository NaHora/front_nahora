import React, { useCallback, useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiUsers } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';

import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { GoLocation } from 'react-icons/go';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EnterpriseImg from '../../assets/empresa.png';
import { Container, Content, Card, OpenDelete } from './styles';

import 'react-day-picker/lib/style.css';

import HeaderMenu from '../../components/Header';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';

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
  isPrivate: boolean;
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

  const [openShedule, setOpenShedule] = useState<OpenModal>({});

  const [loading, setLoading] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment>();
  const [openDelete, setOpenDelete] = useState(false);

  const [myAppointments, setMyAppointments] = useState<ListAppointment>();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getMyAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/appointments/me`);

      setMyAppointments(response.data);
      setOpenDelete(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAppointments = useCallback(
    async (appointment_id: string | undefined) => {
      setLoading(true);

      try {
        await api.delete(`/appointments/${appointment_id}`);
        getMyAppointments();
        handleClose();

        toast.addToast({
          title: 'Agendamento Deletado',
          type: 'success',
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    getMyAppointments();
  }, []);

  return (
    <Container>
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
            <h2 id="transition-modal-title">Deseja cancelar o agendamento?</h2>
            <p id="transition-modal-description">
              Ao cancelar, você perderá a vaga.
            </p>
            <div className={classes.divButton}>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#28262e"
                onClick={handleClose}
                loading={loading}
                transparent
              >
                Cancelar
              </Button>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#28262e"
                onClick={() => deleteAppointments(currentAppointment?.id)}
                loading={loading}
              >
                Excluir
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
      {openDelete && (
        <OpenDelete>
          <span>Tem certeza que deseja excluir o agendamento ?</span>
          <div>
            <Button transparent onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button onClick={() => deleteAppointments(currentAppointment?.id)}>
              Excluir
            </Button>
          </div>
        </OpenDelete>
      )}
      <HeaderMenu />
      <Content>
        <div>
          <span>Próximos Agendamentos:</span>
          {myAppointments && myAppointments.futureAppointments.length > 0 ? (
            myAppointments.futureAppointments.map((appointment) => {
              return (
                <Card>
                  <div>
                    <div
                      onClick={() =>
                        setOpenShedule({
                          ...openShedule,
                          [appointment.id]: !openShedule[appointment.id],
                        })
                      }
                    >
                      {!openShedule[appointment.id] ? (
                        <FiChevronDown
                          style={{ marginRight: '8px' }}
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
                          style={{ marginRight: '8px' }}
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
                      <img
                        src={appointment.enterprise.logo_url || EnterpriseImg}
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
                    <MdDeleteForever
                      onClick={() => {
                        setCurrentAppointment(appointment);
                        handleOpen();
                      }}
                      color="#c53030"
                    />
                  </div>
                  {openShedule[appointment.id] && (
                    <main>
                      <hr />
                      <span>
                        <GoLocation size={20} color="#ff9000" />
                        {appointment.enterprise.address}
                      </span>
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
                                    currentAppointment.user.isPrivate
                                      ? 'https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png'
                                      : currentAppointment.user.avatar_url ||
                                        `https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png`
                                  }
                                  alt="User Logo"
                                />
                                <span>
                                  {currentAppointment.user.isPrivate
                                    ? 'Anônimo'
                                    : currentAppointment.user.name}
                                </span>
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
                        src={appointment.enterprise.logo_url || EnterpriseImg}
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
                        <GoLocation size={20} color="#ff9000" />
                        {appointment.enterprise.address}
                      </span>
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
                                    currentAppointment.user.isPrivate
                                      ? 'https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png'
                                      : currentAppointment.user.avatar_url ||
                                        `https://api.adorable.io/avatars/285/${currentAppointment.user.id}.png`
                                  }
                                  alt="User Logo"
                                />
                                <span>
                                  {currentAppointment.user.isPrivate
                                    ? 'Anônimo'
                                    : currentAppointment.user.name}
                                </span>
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
              Nenhum agendamento passado.
            </>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default Enterprises;
