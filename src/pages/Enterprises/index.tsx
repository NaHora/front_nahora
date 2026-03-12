import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiSearch,
  FiUnlock,
} from 'react-icons/fi';
import AdminShell from '../../components/AdminShell';
import {
  Grid,
  Column,
  Surface,
  SurfaceHeader,
  SectionTitle,
  SectionText,
  SummaryGrid,
  SummaryCard,
  SearchRow,
  EnterpriseList,
  EnterpriseCard,
  EnterpriseCardBody,
  EnterpriseMeta,
  EmptyState,
  StatusPill,
  ActionButton,
} from './styles';
import EnterpriseImg from '../../assets/empresa.png';
import InputDefault from '../../components/InputDefault';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../hooks/socket';
import { useLoad } from '../../hooks/load';

interface SearchEnterprise {
  id: string;
  name: string;
  address: string;
  area: string;
  open_hour: string;
  close_hour: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  aceito?: number;
  isPrivate?: number;
}

interface MyEnterprise {
  id: string;
  enterprise: SearchEnterprise;
}

const Enterprises: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { start, stop } = useLoad();

  const [searchEnterprises, setSearchEnterprises] = useState<SearchEnterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [enterprises, setEnterprises] = useState<MyEnterprise[]>([]);
  const [allEnterprises, setAllEnterprises] = useState<SearchEnterprise[]>([]);
  const [myEnterprise, setMyEnterprises] = useState<SearchEnterprise | null>(null);

  const getAllEnterprises = useCallback(async () => {
    try {
      const response = await api.get('/enterprises/all-unregistered');
      setAllEnterprises(response.data);
    } catch (err) {
      toast.addToast({
        type: 'error',
        title: err.response?.data.message || 'Nao foi possivel carregar empresas',
      });
    }
  }, [toast]);

  const getInviteEnterprise = useCallback(async () => {
    try {
      const response = await api.get('/invites/accepted');
      setEnterprises(response.data);
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Nao foi possivel carregar as empresas seguidas',
      });
    }
  }, [toast]);

  const getMyEnterprises = useCallback(async () => {
    try {
      const response = await api.get('/enterprises/mine');
      localStorage.setItem('@NaHora:myEnterprise', JSON.stringify(response.data));
      setMyEnterprises(response.data);
    } catch {}
  }, []);

  const checkPermission = useCallback(
    async (enterprise: SearchEnterprise) => {
      try {
        const response = await api.get(`/invites/active-plan/${enterprise.id}`);

        if (response.data) {
          localStorage.setItem('enterprise', JSON.stringify(enterprise));
          history.push(routes.dashboard);
        }
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Nao foi possivel acessar esta empresa agora',
        });
      }
    },
    [history, toast],
  );

  const checkEnterprisePayment = useCallback(
    async (enterprise: SearchEnterprise) => {
      try {
        const response = await api.get('/enterprises/checkPayment');

        if (response.data) {
          localStorage.setItem('enterprise', JSON.stringify(enterprise));
          history.push(routes.dashboard);
        }
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            err.response?.data.message ||
            'Nao foi possivel conferir a assinatura da empresa',
        });
      }
    },
    [history, toast],
  );

  const searchAllEnterprisesByName = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/enterprises/${search}/search`);
      setSearchEnterprises(response.data);
    } catch {
      setSearchEnterprises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteEnterprise = useCallback(
    async (enterprise_id: string) => {
      try {
        await api.post('/invites', {
          user_id: user.id,
          enterprise_id,
        });

        setSearchValue('');
        getInviteEnterprise();
        getMyEnterprises();
        getAllEnterprises();

        toast.addToast({
          type: 'success',
          title: 'Convite enviado',
          description: 'Agora a empresa precisa aprovar seu acesso.',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title: err.response?.data.message || 'Nao foi possivel enviar convite',
        });
      }
    },
    [getAllEnterprises, getInviteEnterprise, getMyEnterprises, toast, user.id],
  );

  const getAllRequests = useCallback(async () => {
    start();
    try {
      await Promise.all([
        getInviteEnterprise(),
        getMyEnterprises(),
        getAllEnterprises(),
      ]);
    } finally {
      stop();
    }
  }, [getAllEnterprises, getInviteEnterprise, getMyEnterprises, start, stop]);

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      searchAllEnterprisesByName(searchValue);
      return;
    }
    setSearchEnterprises([]);
  }, [searchAllEnterprisesByName, searchValue]);

  useEffect(() => {
    socket.on('userAcceptSolicitation', () => {
      getAllEnterprises();
      getInviteEnterprise();
    });

    socket.on('declineSolicitation', () => {
      getAllEnterprises();
    });
  }, [socket, getAllEnterprises, getInviteEnterprise]);

  const visibleEnterprises = useMemo(() => {
    if (searchValue.length >= 3) {
      return searchEnterprises;
    }
    return allEnterprises;
  }, [allEnterprises, searchEnterprises, searchValue]);

  return (
    <AdminShell
      eyebrow="Ecossistema"
      title="Empresas e relacoes de acesso"
      description="Descubra novas operacoes, acompanhe convites e entre rapidamente no painel da empresa certa."
    >
      <SummaryGrid>
        <SummaryCard>
          <strong>{allEnterprises.length}</strong>
          <span>Empresas disponiveis</span>
        </SummaryCard>
        <SummaryCard>
          <strong>{enterprises.length}</strong>
          <span>Empresas seguidas</span>
        </SummaryCard>
        <SummaryCard>
          <strong>{myEnterprise ? '1' : '0'}</strong>
          <span>Empresa propria</span>
        </SummaryCard>
      </SummaryGrid>

      <Grid>
        <Column>
          <Surface>
            <SurfaceHeader>
              <div>
                <SectionTitle>Explorar empresas</SectionTitle>
                <SectionText>
                  Busque por nome e solicite acesso para acompanhar horarios e
                  operacao.
                </SectionText>
              </div>
            </SurfaceHeader>

            <SearchRow>
              <InputDefault
                icon={FiSearch}
                name="search"
                type="text"
                value={searchValue}
                placeholder="Pesquisar empresa"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </SearchRow>

            <EnterpriseList>
              {visibleEnterprises.map((enterprise) => (
                <EnterpriseCard key={enterprise.id}>
                  <img src={enterprise.logo_url || EnterpriseImg} alt={enterprise.name} />
                  <EnterpriseCardBody>
                    <div>
                      <h3>{enterprise.name}</h3>
                      <StatusPill privateProfile={!!enterprise.isPrivate}>
                        {enterprise.isPrivate ? <FiLock /> : <FiUnlock />}
                        {enterprise.isPrivate ? 'Perfil fechado' : 'Perfil aberto'}
                      </StatusPill>
                    </div>

                    <EnterpriseMeta>
                      <span>{enterprise.area}</span>
                      <span>{enterprise.address}</span>
                      <span>
                        <FiClock />
                        {enterprise.open_hour} ate {enterprise.close_hour}
                      </span>
                    </EnterpriseMeta>

                    <ActionButton
                      disabled={enterprise.aceito === 0}
                      onClick={() => inviteEnterprise(enterprise.id)}
                    >
                      {enterprise.aceito === 0 ? 'Aguardando aprovacao' : 'Solicitar acesso'}
                      {enterprise.aceito !== 0 && <FiArrowRight />}
                    </ActionButton>
                  </EnterpriseCardBody>
                </EnterpriseCard>
              ))}

              {!loading && visibleEnterprises.length === 0 && (
                <EmptyState>
                  Nenhuma empresa encontrada para esse filtro.
                </EmptyState>
              )}
            </EnterpriseList>
          </Surface>
        </Column>

        <Column>
          {myEnterprise && (
            <Surface>
              <SurfaceHeader>
                <div>
                  <SectionTitle>Minha empresa</SectionTitle>
                  <SectionText>
                    Entre direto no painel operacional da sua base principal.
                  </SectionText>
                </div>
              </SurfaceHeader>

              <EnterpriseCard featured onClick={() => checkEnterprisePayment(myEnterprise)}>
                <img src={myEnterprise.logo_url || EnterpriseImg} alt={myEnterprise.name} />
                <EnterpriseCardBody>
                  <div>
                    <h3>{myEnterprise.name}</h3>
                    <StatusPill privateProfile={!!myEnterprise.isPrivate}>
                      {myEnterprise.isPrivate ? <FiLock /> : <FiUnlock />}
                      {myEnterprise.isPrivate ? 'Perfil fechado' : 'Perfil aberto'}
                    </StatusPill>
                  </div>

                  <EnterpriseMeta>
                    <span>{myEnterprise.area}</span>
                    <span>{myEnterprise.address}</span>
                  </EnterpriseMeta>

                  <ActionButton as="div">
                    Acessar dashboard
                    <FiArrowRight />
                  </ActionButton>
                </EnterpriseCardBody>
              </EnterpriseCard>
            </Surface>
          )}

          <Surface>
            <SurfaceHeader>
              <div>
                <SectionTitle>Empresas que voce segue</SectionTitle>
                <SectionText>
                  Operacoes aprovadas para navegar agenda, clientes e contexto.
                </SectionText>
              </div>
            </SurfaceHeader>

            <EnterpriseList>
              {enterprises.map((enterprise) => (
                <EnterpriseCard
                  key={enterprise.id}
                  featured
                  onClick={() => checkPermission(enterprise.enterprise)}
                >
                  <img
                    src={enterprise.enterprise.logo_url || EnterpriseImg}
                    alt={enterprise.enterprise.name}
                  />
                  <EnterpriseCardBody>
                    <div>
                      <h3>{enterprise.enterprise.name}</h3>
                      <StatusPill privateProfile={!!enterprise.enterprise.isPrivate}>
                        {enterprise.enterprise.isPrivate ? <FiLock /> : <FiUnlock />}
                        {enterprise.enterprise.isPrivate
                          ? 'Perfil fechado'
                          : 'Perfil aberto'}
                      </StatusPill>
                    </div>

                    <EnterpriseMeta>
                      <span>{enterprise.enterprise.area}</span>
                      <span>{enterprise.enterprise.address}</span>
                      <span>
                        <FiCheckCircle />
                        Convite aprovado
                      </span>
                    </EnterpriseMeta>

                    <ActionButton as="div">
                      Abrir empresa
                      <FiArrowRight />
                    </ActionButton>
                  </EnterpriseCardBody>
                </EnterpriseCard>
              ))}

              {enterprises.length === 0 && (
                <EmptyState>
                  Voce ainda nao tem empresas aprovadas. Comece enviando convites.
                </EmptyState>
              )}
            </EnterpriseList>
          </Surface>
        </Column>
      </Grid>
    </AdminShell>
  );
};

export default Enterprises;
