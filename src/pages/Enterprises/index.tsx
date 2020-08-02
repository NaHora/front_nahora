import React, { useCallback, useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

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

import 'react-day-picker/lib/style.css';

import HeaderMenu from '../../components/Header';
import InputDefault from '../../components/InputDefault';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

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
  friends: boolean;
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

  const [searchEnterprises, setSearchEnterprises] = useState<
    SearchEnterprise[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [enterprises, setEnterprises] = useState<MyEnterprise[]>([]);

  const searchAllEnterprisesByName = useCallback(
    async (search: string) => {
      setLoading(true);
      try {
        const response = await api.get(`/enterprises/${search}/search`);

        const searchEnterprisesByname: SearchEnterprise[] = [];

        response.data.map((searchEnterprise: SearchEnterprise) =>
          enterprises.map((myenteprises) => {
            if (myenteprises.enterprise.id === searchEnterprise.id) {
              return searchEnterprisesByname.push({
                ...searchEnterprise,
                friends: true,
              });
            }
            return searchEnterprisesByname.push({
              ...searchEnterprise,
              friends: false,
            });
          }),
        );

        setSearchEnterprises(searchEnterprisesByname);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const inviteEnterprise = useCallback(
    async (enterprise_id: string) => {
      try {
        const body = {
          user_id: user.id,
          enterprise_id,
        };

        await api.post(`/invites`, body);

        toast.addToast({
          type: 'success',
          title: 'Boa, agora é só esperar!',
          description:
            'Você enviou um convite para acessar os horários desta empresa',
        });
      } catch (err) {
        if (err.response) {
          toast.addToast({
            type: 'error',
            title: 'Ops! algo deu errado,',
            description: err.response.data.message || 'Erro interno',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Vishi',
            description:
              'Ocorreu um erro ao procurar empresas, tente novamente',
          });
        }
      }
    },
    [toast, user.id],
  );

  const getInviteEnterprise = useCallback(async () => {
    try {
      const response = await api.get(`/invites`);

      setEnterprises(response.data);
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title: 'Ops! algo deu errado,',
          description:
            err.response.data.message ||
            'Não foi possível carregar suas empresas',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Vishi',
          description: 'Ocorreu um erro ao procurar empresas, tente novamente',
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    getInviteEnterprise();
  }, []);

  useEffect(() => {
    if (searchValue.length >= 3) {
      searchAllEnterprisesByName(searchValue);
    }
  }, [searchValue]);

  return (
    <Container>
      <HeaderMenu />
      <Content>
        <SearchContent>
          <InputDefault
            icon={FiSearch}
            name="search"
            type="text"
            value={searchValue}
            placeholder="Procurar empresas"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          {searchEnterprises && searchEnterprises.length > 0 ? (
            searchEnterprises.map((enterprise) => {
              return (
                <Card key={enterprise.id}>
                  <div>
                    <img
                      src={
                        enterprise.logo_url ||
                        `https://api.adorable.io/avatars/285/${enterprise.id}.png`
                      }
                      alt=""
                    />
                    <div>
                      <Title>{enterprise.name}</Title>
                      <SubTitle>
                        Aberto de {enterprise.open_hour} até{' '}
                        {enterprise.close_hour}
                      </SubTitle>
                      <Text>{enterprise.address}</Text>
                      <Text>{enterprise.area}</Text>
                    </div>
                  </div>
                  <CadastraButton
                    disabled={enterprise.friends}
                    onClick={() => inviteEnterprise(enterprise.id)}
                  >
                    {enterprise.friends ? 'Enviado' : 'Me cadastrar'}
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
                'Nenhuma empresa encontrada com estes dígitos.'
              )}
            </>
          )}
        </SearchContent>
        <hr />
        <MyEnterprises>
          <span>Minhas Empresas</span>
          {enterprises && enterprises.length > 0 ? (
            enterprises.map((enterprise) => {
              return (
                <CardMine
                  onClick={() => {
                    localStorage.setItem(
                      'enterprise',
                      JSON.stringify(enterprise.enterprise),
                    );

                    return history.push(routes.dashboard);
                  }}
                  key={enterprise.id}
                >
                  <div>
                    <img
                      src={
                        enterprise.enterprise.logo_url ||
                        `https://api.adorable.io/avatars/285/${enterprise.id}.png`
                      }
                      alt=""
                    />
                    <div>
                      <Title>{enterprise.enterprise.name}</Title>
                      <SubTitle>
                        Aberto de {enterprise.enterprise.open_hour} até{' '}
                        {enterprise.enterprise.close_hour}
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
            </>
          )}
        </MyEnterprises>
      </Content>
    </Container>
  );
};

export default Enterprises;
