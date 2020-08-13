import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';

import { FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Switch } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { Container, AvatarInput, Cel, Header, Body, Form } from './styles';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import HeaderMenu from '../../../components/Header';
import Button from '../../../components/Button';
import InputDefault from '../../../components/InputDefault';

interface Enterprise {
  id?: string;
  name?: string;
  address?: string;
  area?: string;
  open_hour?: string;
  close_hour?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  isPrivate?: boolean;
}

const EnterpriseProfile: React.FC = () => {
  const [enterpriseData, setEnterpriseData] = useState<Enterprise | any>({});

  const { addToast } = useToast();

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const getMyEnterprises = useCallback(async () => {
    try {
      const response = await api.get(`/enterprises/mine`);

      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );

      setEnterpriseData(response.data);
    } catch (err) {}
  }, []);

  const updateEnterprise = useCallback(async () => {
    try {
      const body = {
        name: enterpriseData.name,
        address: enterpriseData.address,
        area: enterpriseData.area,

        primary_color: enterpriseData.primary_color,
        secondary_color: enterpriseData.secondary_color,
        isPrivate: !!enterpriseData.isPrivate,
      };
      const response = await api.put(`/enterprises`, body);

      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );

      setEnterpriseData(response.data);

      addToast({
        type: 'success',
        title: 'Dados da empresa atualizados!',
      });
    } catch (err) {}
  }, [addToast, enterpriseData]);

  useEffect(() => {
    getMyEnterprises();
  }, []);

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('logo', e.target.files[0]);

        api.patch('/enterprises/logo', data).then((response) => {
          setEnterpriseData(response.data);

          addToast({
            type: 'success',
            title: 'Logo Atualizada!',
          });
        });
      }
    },
    [addToast, setEnterpriseData],
  );
  return (
    <Container>
      <HeaderMenu />
      <div>
        <AvatarInput>
          <img
            src={
              enterpriseData?.logo_url ||
              `https://api.adorable.io/avatars/285/${myEnterprise.id}.png`
            }
            alt={myEnterprise.name}
          />
          <label htmlFor="avatar">
            <FiCamera />
            <input type="file" onChange={handleAvatarChange} id="avatar" />
          </label>
        </AvatarInput>
        <Form>
          <div>
            <div>
              <label htmlFor="">
                Nome da empresa:{' '}
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData?.name}
                  type="text"
                  name="name"
                />
              </label>

              <label htmlFor="">
                Área de atuação:{' '}
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData.area}
                  type="text"
                  name="area"
                />
              </label>

              <label htmlFor="">
                Endereço:{' '}
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData.address}
                  type="text"
                  name="address"
                />
              </label>
              <label style={{ width: '150px' }} htmlFor="">
                Cor primária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData.primary_color}
                  type="color"
                  name="primary_color"
                />
              </label>
              <label style={{ width: '150px' }} htmlFor="">
                Cor secundária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData.secondary_color}
                  type="color"
                  name="secondary_color"
                />
              </label>
              <label htmlFor="">
                Usuário necessitam de plano:{' '}
                <Switch
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                  name="isPrivate"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  checked={!!enterpriseData.isPrivate}
                />
              </label>
              <Button onClick={updateEnterprise}>Salvar</Button>
            </div>
            <div>
              <span>Prévia da tela do usuário com dados preenchidos</span>
              <br />
              <Cel>
                <Header
                  primaryColor={enterpriseData?.primary_color || '#28262e'}
                  secondaryColor={enterpriseData?.secondary_color || '#ff9000'}
                >
                  <FiArrowLeft />

                  <img
                    src={
                      enterpriseData?.logo_url ||
                      `https://api.adorable.io/avatars/285/${myEnterprise.id}.png`
                    }
                    alt="GoBarber"
                  />
                </Header>
                <Body
                  primaryColor={enterpriseData?.primary_color || '#28262e'}
                  secondaryColor={enterpriseData?.secondary_color || '#ff9000'}
                >
                  <Button
                    primaryColor={enterpriseData?.primary_color || '#28262e'}
                    secondaryColor={
                      enterpriseData?.secondary_color || '#ff9000'
                    }
                  >
                    Modelo de Botão
                  </Button>
                </Body>
              </Cel>
            </div>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EnterpriseProfile;
