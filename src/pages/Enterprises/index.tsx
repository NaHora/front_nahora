import React, { useCallback, useState, useEffect } from 'react';
import { FiSearch, FiLock, FiUnlock } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';
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
import EnterpriseImg from '../../assets/empresa.png';

import 'react-day-picker/lib/style.css';

import HeaderMenu from '../../components/Header';
import InputDefault from '../../components/InputDefault';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';
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
  name: string;
  address: string;
  area: string;
  open_hour: string;
  close_hour: string;
  enterprise: SearchEnterprise;
}

const Enterprises: React.FC = () => {
  const toast = useToast();
  const history = useHistory();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { start, stop } = useLoad();

  const [searchEnterprises, setSearchEnterprises] = useState<
    SearchEnterprise[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [enterprises, setEnterprises] = useState<MyEnterprise[]>([]);
  const [allEnterprises, setAllEnterprises] = useState<SearchEnterprise[]>([]);
  const [myEnterprise, setMyEnterprises] = useState<SearchEnterprise | null>(
    null,
  );

  const getAllEnterprises = useCallback(async () => {
    try {
      const response = await api.get(`/enterprises/all-unregistered`);

      setAllEnterprises(response.data);
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title: 'Algo deu errado,',
          description:
            err.response.data.message ||
            'Não foi possível carregar suas empresas',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao procurar empresas, tente novamente',
        });
      }
    }
  }, [toast]);

  const getInviteEnterprise = useCallback(async () => {
    try {
      const response = await api.get(`/invites/accepted`);

      setEnterprises(response.data);
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title: 'Algo deu errado,',
          description:
            err.response.data.message ||
            'Não foi possível carregar suas empresas',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao procurar empresas, tente novamente',
        });
      }
    }
  }, [toast]);

  const getMyEnterprises = useCallback(async () => {
    try {
      const response = await api.get(`/enterprises/mine`);

      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );

      setMyEnterprises(response.data);
    } catch (err) {}
  }, []);

  const checkPermission = useCallback(
    async (enterprise: SearchEnterprise) => {
      try {
        const response = await api.get(`/invites/active-plan/${enterprise.id}`);

        if (response.data) {
          localStorage.setItem('enterprise', JSON.stringify(enterprise));

          return history.push(routes.dashboard);
        }
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title: 'Algo deu errado,',
            description:
              err.response.data.message ||
              'Não foi possível carregar suas empresas',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao procurar empresas, tente novamente',
          });
        }
      }
    },
    [toast, history],
  );

  const checkEnterprisePayment = useCallback(
    async (enterprise: SearchEnterprise) => {
      try {
        const response = await api.get(`/enterprises/checkPayment`);

        if (response.data) {
          localStorage.setItem('enterprise', JSON.stringify(enterprise));

          return history.push(routes.dashboard);
        }
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title: 'Algo deu errado,',
            description:
              err.response.data.message ||
              'Não foi possível conferir sua assinatura.',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Não foi possível conferir sua assinatura.',
          });
        }
      }
    },
    [toast, history],
  );

  const searchAllEnterprisesByName = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/enterprises/${search}/search`);

      setSearchEnterprises(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteEnterprise = useCallback(
    async (enterprise_id: string) => {
      try {
        const body = {
          user_id: user.id,
          enterprise_id,
        };

        await api.post(`/invites`, body);

        setSearchValue('');

        getInviteEnterprise();
        getMyEnterprises();
        getAllEnterprises();

        toast.addToast({
          type: 'success',
          title: 'Agora é só esperar!',
          description:
            'Você enviou um convite para acessar os horários desta empresa',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title: 'Algo deu errado,',
            description: err.response.data.message || 'Erro interno',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Ocorreu um erro ao procurar empresas, tente novamente',
          });
        }
      }
    },
    [toast, user.id, getInviteEnterprise, getAllEnterprises, getMyEnterprises],
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
  }, []);

  useEffect(() => {
    getAllRequests();
  }, []);

  useEffect(() => {
    if (searchValue.length >= 3) {
      searchAllEnterprisesByName(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    socket.on('userAcceptSolicitation', (enterprise: MyEnterprise) => {
      getAllEnterprises();
      getInviteEnterprise();
    });

    socket.on('declineSolicitation', (enterprise: MyEnterprise) => {
      getAllEnterprises();
    });
  }, [socket, getAllEnterprises, getInviteEnterprise]);

  return (
    <Container>
      <HeaderMenu />
      <Content>
        <SearchContent>
          <span>Procurar Empresas</span>

          <InputDefault
            icon={FiSearch}
            name="search"
            type="text"
            value={searchValue}
            placeholder="Filtrar empresas"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          {searchEnterprises && searchEnterprises.length > 0 && searchValue && (
            <>
              {searchEnterprises.map((enterprise) => {
                return (
                  <Card key={enterprise.id}>
                    <div>
                      <img src={enterprise.logo_url || EnterpriseImg} alt="" />
                      <div>
                        <Title>{enterprise.name}</Title>
                        <SubTitle>
                          {enterprise.isPrivate ? (
                            <>
                              <FiLock color="#ff9000" /> Perfil Fechado
                            </>
                          ) : (
                            <>
                              <FiUnlock color="#ff9000" /> Perfil Aberto
                            </>
                          )}
                        </SubTitle>
                        <Text>{enterprise.address}</Text>
                        <Text>{enterprise.area}</Text>
                      </div>
                    </div>
                    <CadastraButton
                      disabled={enterprise.aceito == 0}
                      onClick={() => inviteEnterprise(enterprise.id)}
                    >
                      {enterprise.aceito == 0 ? 'Aguardando' : 'Seguir'}
                    </CadastraButton>
                  </Card>
                );
              })}
              <hr />
            </>
          )}

          <br />
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Loader type="Watch" color="#ff9000" height={40} width={40} />
            </div>
          )}

          {allEnterprises && allEnterprises.length > 0 ? (
            allEnterprises.map((enterprise) => {
              return (
                <Card key={enterprise.id}>
                  <div>
                    <img src={enterprise.logo_url || EnterpriseImg} alt="" />
                    <div>
                      <Title>{enterprise.name}</Title>
                      <SubTitle>
                        {enterprise.isPrivate ? (
                          <>
                            <FiLock color="#ff9000" /> Perfil Fechado
                          </>
                        ) : (
                          <>
                            <FiUnlock color="#ff9000" /> Perfil Aberto
                          </>
                        )}
                      </SubTitle>
                      <Text>{enterprise.address}</Text>
                      <Text>{enterprise.area}</Text>
                    </div>
                  </div>
                  <CadastraButton
                    disabled={enterprise.aceito == 0}
                    onClick={() => inviteEnterprise(enterprise.id)}
                  >
                    {enterprise.aceito == 0 ? 'Aguardando' : 'Seguir'}
                  </CadastraButton>
                </Card>
              );
            })
          ) : (
            <>
              <br />
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Loader type="Watch" color="#ff9000" height={40} width={40} />
                </div>
              ) : (
                'Nenhuma empresa que você ainda não tenha seguido encontrada.'
              )}
            </>
          )}
        </SearchContent>
        <hr />
        <MyEnterprises>
          {myEnterprise && (
            <>
              <span>Minha Empresa</span>
              <CardMine
                onClick={() => checkEnterprisePayment(myEnterprise)}
                key={myEnterprise.id}
              >
                <div>
                  <img src={myEnterprise.logo_url || EnterpriseImg} alt="" />
                  <div>
                    <Title>{myEnterprise.name}</Title>
                    <SubTitle>
                      {myEnterprise.isPrivate ? (
                        <>
                          <FiLock color="#ff9000" /> Perfil Fechado
                        </>
                      ) : (
                        <>
                          <FiUnlock color="#ff9000" /> Perfil Aberto
                        </>
                      )}
                    </SubTitle>
                    <Text>{myEnterprise.area}</Text>
                    <Text>{myEnterprise.address}</Text>
                  </div>
                </div>
              </CardMine>
            </>
          )}
          <span>Seguindo</span>
          {enterprises && enterprises.length > 0 ? (
            enterprises.map((enterprise) => {
              return (
                <CardMine
                  onClick={() => checkPermission(enterprise.enterprise)}
                  key={enterprise.id}
                >
                  <div>
                    <img
                      src={enterprise.enterprise.logo_url || EnterpriseImg}
                      alt=""
                    />
                    <div>
                      <Title>{enterprise.enterprise.name}</Title>
                      <SubTitle>
                        {enterprise.enterprise.isPrivate ? (
                          <>
                            <FiLock color="#ff9000" /> Perfil Fechado
                          </>
                        ) : (
                          <>
                            <FiUnlock color="#ff9000" /> Perfil Aberto
                          </>
                        )}
                      </SubTitle>
                      <Text>{enterprise.enterprise.area}</Text>
                      <Text>{enterprise.enterprise.address}</Text>
                    </div>
                  </div>
                </CardMine>
              );
            })
          ) : (
            <>
              <br />
              Você ainda não convidou nenhuma empresa, ou elas ainda não te
              aceitaram.
              <br />
            </>
          )}
        </MyEnterprises>
      </Content>
    </Container>
  );
};

export default Enterprises;
