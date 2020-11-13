import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';

import { FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Switch, Tooltip } from '@material-ui/core';
import { MdInfoOutline } from 'react-icons/md';
import { Container, AvatarInput, Cel, Header, Body, Form } from './styles';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import HeaderMenu from '../../../components/Header';
import Button from '../../../components/Button';
import InputDefault from '../../../components/InputDefault';
import EnterpriseImg from '../../../assets/empresa.png';
import AlertToast from '../../../components/AlertToast';

interface Alert {
  id: string;
  title?: string;
  description?: string;
  enterprise_id: string;
}

const Alert: React.FC = () => {
  const [enterpriseData, setEnterpriseData] = useState<Alert | any>({});
  const [currentAlert, setCurrentAlert] = useState<Alert | any>({});

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

  const getMyAlerts = useCallback(async () => {
    try {
      const response = await api.get(`/alert/${myEnterprise.id}`);

      setCurrentAlert(response.data);
    } catch (err) {}
  }, [myEnterprise]);

  const updateEnterpriseAlert = useCallback(async () => {
    try {
      const body = {
        title: enterpriseData.title,
        description: enterpriseData.description,
      };
      const response = await api.post(`/alert`, body);
      getMyAlerts();
      setEnterpriseData({
        title: '',
        description: '',
      });
      addToast({
        type: 'success',
        title: 'Alerta criado para seus clientes!',
      });
    } catch (err) {
      if (err.response) {
        addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao criar o alerta, tente novamente',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao criar o alerta, tente novamente',
        });
      }
    }
  }, [addToast, enterpriseData, getMyAlerts]);

  const deleteAlert = useCallback(async () => {
    try {
      const response = await api.delete(`/alert/${currentAlert.id}`);

      setCurrentAlert({});
      setEnterpriseData({
        title: '',
        description: '',
      });

      addToast({
        type: 'success',
        title: 'Alerta desativado para seus clientes!',
      });
    } catch (err) {
      if (err.response) {
        addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao desativar o alerta, tente novamente',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao desativar o alerta, tente novamente',
        });
      }
    }
  }, [addToast, currentAlert]);

  useEffect(() => {
    getMyEnterprises();
  }, []);

  useEffect(() => {
    getMyAlerts();
  }, []);

  return (
    <Container>
      <HeaderMenu />
      <div>
        <Form>
          <div>
            <div>
              <label htmlFor="">
                Título do alerta:
                <InputDefault
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={enterpriseData?.title}
                  type="text"
                  name="title"
                />
              </label>

              <label htmlFor="">
                Descrição:{' '}
                <textarea
                  value={enterpriseData?.description}
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  name="description"
                  cols={25}
                  rows={10}
                />
              </label>

              <Button onClick={updateEnterpriseAlert}>Salvar</Button>
              <Button
                style={{
                  margin: '0 0 20px',
                  background: '#e51a20',
                  color: '#fff',
                }}
                onClick={deleteAlert}
              >
                Desativar alerta atual
              </Button>
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
                    src={enterpriseData?.logo_url || EnterpriseImg}
                    alt="NaHora"
                  />
                </Header>
                <Body
                  primaryColor={enterpriseData?.primary_color || '#28262e'}
                  secondaryColor={enterpriseData?.secondary_color || '#ff9000'}
                >
                  {(enterpriseData.title ||
                    enterpriseData.description ||
                    currentAlert.id) && (
                    <AlertToast
                      mobile
                      title={enterpriseData?.title || currentAlert.title}
                      description={
                        enterpriseData?.description || currentAlert.description
                      }
                    />
                  )}
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

export default Alert;
