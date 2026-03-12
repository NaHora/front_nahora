import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiTrash2, FiUsers } from 'react-icons/fi';
import { format, isFuture } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { useHistory } from 'react-router-dom';
import EnterpriseImg from '../../assets/empresa.png';
import AdminShell from '../../components/AdminShell';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useLoad } from '../../hooks/load';
import { routes } from '../../routes';
import {
  EmptyState,
  ScheduleGrid,
  ScheduleSection,
  SectionHeader,
  SectionTitle,
  SectionText,
  ScheduleCard,
  ScheduleMeta,
  ParticipantList,
  SummaryGrid,
  SummaryCard,
  InlineAction,
} from './styles';

interface Enterprise {
  id: string;
  name: string;
  address: string;
  logo_url: string;
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
  capacity: number;
  appointments: Appointment[];
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

const Schedule: React.FC = () => {
  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const toast = useToast();
  const history = useHistory();
  const { start, stop } = useLoad();

  const [loading, setLoading] = useState(false);
  const [myAppointments, setMyAppointments] = useState<ListAppointment>();

  useEffect(() => {
    if (
      !thisEnterprise.id &&
      window.location.pathname === routes.enterpriseUserSchedule
    ) {
      history.push(routes.schedule);
    }
  }, [history, thisEnterprise.id]);

  const getMyAppointments = useCallback(async () => {
    setLoading(true);
    start();
    try {
      const response = await api.get(
        window.location.pathname === routes.schedule
          ? '/appointments/me/7'
          : `/appointments/me/7/${thisEnterprise.id}`,
      );

      setMyAppointments(response.data);
    } finally {
      stop();
      setLoading(false);
    }
  }, [start, stop, thisEnterprise.id]);

  const deleteAppointments = useCallback(
    async (appointment_id: string | undefined) => {
      if (!appointment_id) {
        return;
      }

      setLoading(true);

      try {
        await api.delete(`/appointments/${appointment_id}`);
        await getMyAppointments();

        toast.addToast({
          title: 'Agendamento cancelado',
          type: 'success',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Ocorreu um erro ao cancelar o agendamento',
        });
      } finally {
        setLoading(false);
      }
    },
    [getMyAppointments, toast],
  );

  useEffect(() => {
    getMyAppointments();
  }, [getMyAppointments]);

  const allAppointments = useMemo(() => {
    return [
      ...(myAppointments?.futureAppointments || []),
      ...(myAppointments?.pastAppointments || []),
    ];
  }, [myAppointments]);

  return (
    <AdminShell
      eyebrow="Minha agenda"
      title="Agendamentos organizados por contexto"
      description="Veja os proximos compromissos, revise o historico recente e cancele com clareza quando precisar."
    >
      <SummaryGrid>
        <SummaryCard>
          <strong>{myAppointments?.futureAppointments.length || 0}</strong>
          <span>Proximos agendamentos</span>
        </SummaryCard>
        <SummaryCard>
          <strong>{myAppointments?.pastAppointments.length || 0}</strong>
          <span>Ultimos atendimentos</span>
        </SummaryCard>
        <SummaryCard>
          <strong>{allAppointments.filter((item) => isFuture(new Date(item.date))).length}</strong>
          <span>Compromissos ainda ativos</span>
        </SummaryCard>
      </SummaryGrid>

      <ScheduleGrid>
        <ScheduleSection>
          <SectionHeader>
            <div>
              <SectionTitle>Proximos agendamentos</SectionTitle>
              <SectionText>
                Tudo o que ainda vai acontecer nos proximos dias.
              </SectionText>
            </div>
          </SectionHeader>

          {(myAppointments?.futureAppointments || [])
            .filter((appointment) => appointment.service !== null)
            .map((appointment) => (
              <ScheduleCard key={appointment.id}>
                <div>
                  <img
                    src={appointment.enterprise.logo_url || EnterpriseImg}
                    alt={appointment.enterprise.name}
                  />
                  <div>
                    <h3>{appointment.enterprise.name}</h3>
                    <ScheduleMeta>
                      <span>
                        <FiCalendar />
                        {format(new Date(appointment.date), "dd 'de' MMMM", {
                          locale: ptBr,
                        })}
                      </span>
                      <span>
                        <FiClock />
                        {format(new Date(appointment.date), "HH:mm'h'", {
                          locale: ptBr,
                        })}
                      </span>
                      <span>
                        <FiMapPin />
                        {appointment.enterprise.address}
                      </span>
                      <span>
                        <FiUsers />
                        {appointment.service.appointments.length}/
                        {appointment.service.capacity} participantes
                      </span>
                    </ScheduleMeta>
                  </div>
                </div>

                <InlineAction>
                  <Button
                    transparent
                    secondaryColor="#d34f4f"
                    primaryColor="#ffffff"
                    onClick={() => deleteAppointments(appointment.id)}
                    loading={loading}
                  >
                    <FiTrash2 />
                    Cancelar
                  </Button>
                </InlineAction>

                <ParticipantList>
                  {appointment.service.appointments.map((currentAppointment) => (
                    <li key={currentAppointment.id}>
                      <Avatar
                        width={38}
                        height={38}
                        name={currentAppointment.user.name}
                        isPrivate={currentAppointment.user.isPrivate}
                        avatarUrl={currentAppointment.user.avatar_url}
                      />
                      <span>
                        {currentAppointment.user.isPrivate
                          ? 'Anonimo'
                          : currentAppointment.user.name}
                      </span>
                    </li>
                  ))}
                </ParticipantList>
              </ScheduleCard>
            ))}

          {(myAppointments?.futureAppointments || []).length === 0 && (
            <EmptyState>Nenhum agendamento futuro.</EmptyState>
          )}
        </ScheduleSection>

        <ScheduleSection>
          <SectionHeader>
            <div>
              <SectionTitle>Historico recente</SectionTitle>
              <SectionText>
                Ultimos atendimentos para revisar volume e recorrencia.
              </SectionText>
            </div>
          </SectionHeader>

          {(myAppointments?.pastAppointments || [])
            .filter((appointment) => appointment.service !== null)
            .map((appointment) => (
              <ScheduleCard key={appointment.id} past>
                <div>
                  <img
                    src={appointment.enterprise.logo_url || EnterpriseImg}
                    alt={appointment.enterprise.name}
                  />
                  <div>
                    <h3>{appointment.enterprise.name}</h3>
                    <ScheduleMeta>
                      <span>
                        <FiCalendar />
                        {format(new Date(appointment.date), "dd 'de' MMMM", {
                          locale: ptBr,
                        })}
                      </span>
                      <span>
                        <FiClock />
                        {format(new Date(appointment.date), "HH:mm'h'", {
                          locale: ptBr,
                        })}
                      </span>
                      <span>
                        <FiMapPin />
                        {appointment.enterprise.address}
                      </span>
                    </ScheduleMeta>
                  </div>
                </div>

                <ParticipantList>
                  {appointment.service.appointments.map((currentAppointment) => (
                    <li key={currentAppointment.id}>
                      <Avatar
                        width={34}
                        height={34}
                        name={currentAppointment.user.name}
                        isPrivate={currentAppointment.user.isPrivate}
                        avatarUrl={currentAppointment.user.avatar_url}
                      />
                      <span>
                        {currentAppointment.user.isPrivate
                          ? 'Anonimo'
                          : currentAppointment.user.name}
                      </span>
                    </li>
                  ))}
                </ParticipantList>
              </ScheduleCard>
            ))}

          {(myAppointments?.pastAppointments || []).length === 0 && (
            <EmptyState>Nenhum agendamento passado.</EmptyState>
          )}
        </ScheduleSection>
      </ScheduleGrid>
    </AdminShell>
  );
};

export default Schedule;
