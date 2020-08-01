import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import {
  Container,
  Content,
  Card,
  Title,
  SubTitle,
  Text,
  CadastraButton,
} from './styles';

import 'react-day-picker/lib/style.css';

import HeaderMenu from '../../components/Header';
import Input from '../../components/Input';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface SearchEnterprise {
  id: string;
  name: string;
  address: string;
  area: string;
  open_hour: string;
  close_hour: string;
}

interface MyEnterprise {
  id: string;
  name: string;
  address: string;
  area: string;
  open_hour: string;
  close_hour: string;
}

const Enterprises: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();
  const { user } = useAuth();

  const [searchEnterprises, setSearchEnterprises] = useState<
    SearchEnterprise[]
  >([]);

  const [enterprises, setEnterprises] = useState<MyEnterprise[]>([]);

  const searchAllEnterprisesByName = useCallback(
    async ({ search }: string) => {
      try {
        const response = await api.get(`/enterprises/${search}/search`);

        setSearchEnterprises(response.data);
      } catch (err) {
        toast.addToast({
          type: 'error',
          title: 'Vishi',
          description:
            err.response.data ||
            'Ocorreu um erro ao procurar empresas, tente novamente',
        });
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
        toast.addToast({
          type: 'error',
          title: 'Ops! algo deu errado,',
          description: err.response.data || 'Erro interno',
        });
      }
    },
    [toast, user.id],
  );

  const getInviteEnterprise = useCallback(async () => {
    try {
      const response = await api.get(`/invites`);

      setEnterprises(response.data);
    } catch (err) {
      toast.addToast({
        type: 'error',
        title: 'Ops! algo deu errado,',
        description:
          err.response.data || 'Não foi possível carregar suas empresas',
      });
    }
  }, [toast]);

  useEffect(() => {
    getInviteEnterprise();
  }, [getInviteEnterprise]);

  return (
    <Container>
      <HeaderMenu />
      <Content>
        <Form ref={formRef} onSubmit={searchAllEnterprisesByName}>
          <Input
            icon={FiSearch}
            name="search"
            type="text"
            placeholder="Procurar empresa"
          />
        </Form>
        {searchEnterprises && searchEnterprises.length > 0
          ? searchEnterprises.map((enterprise) => {
              return (
                <Card key={enterprise.id}>
                  <div>
                    <img
                      src="https://api.adorable.io/avatars/285/oi.png"
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
                    onClick={() => inviteEnterprise(enterprise.id)}
                  >
                    Me cadastrar
                  </CadastraButton>
                </Card>
              );
            })
          : 'Nenhuma empresa encontrada com estes dígitos.'}

        {enterprises &&
          enterprises.map((enterprise) => {
            return <>{enterprise.id}</>;
          }, [])}
      </Content>
    </Container>
  );
};

export default Enterprises;
