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
  const [myAppointments, setMyAppointments] = useState<MyEnterprise[]>([]);

  const listMyAppointments = useCallback(async () => {
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
    listMyAppointments();
  }, []);

  return (
    <Container>
      <HeaderMenu />
      <Content>
        {/* <SearchContent>
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
                  <CadastraButton disabled={enterprise.friends}>
                    {enterprise.friends ? 'Enviado' : 'Me cadastrar'}
                  </CadastraButton>
                </Card>
              );
            })
          ) : (
            <>
              <br />
              {loading ? (
                <Loader type="Watch" color="#ff9000" height={80} width={80} />
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
        </MyEnterprises> */}
      </Content>
    </Container>
  );
};

export default Enterprises;
