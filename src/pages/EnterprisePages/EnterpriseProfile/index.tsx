import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';
import { FiArrowLeft, FiCamera, FiEye, FiSave } from 'react-icons/fi';
import { Switch } from '@material-ui/core';
import Loader from 'react-loader-spinner';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/Button';
import InputDefault from '../../../components/InputDefault';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import EnterpriseImg from '../../../assets/empresa.png';
import resize from '../../../components/Resize';
import {
  Metrics,
  MetricCard,
  Grid,
  Column,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  FormPanel,
  InlineGrid,
  ToggleRow,
  PreviewPhone,
  PreviewScreen,
  PreviewHeader,
  PreviewBody,
  PreviewBadge,
  StatusPill,
} from '../shared';

interface Enterprise {
  id?: string;
  name?: string;
  address?: string;
  area?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  isPrivate?: boolean;
}

const EnterpriseProfile: React.FC = () => {
  const [enterpriseData, setEnterpriseData] = useState<Enterprise | any>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const getMyEnterprises = useCallback(async () => {
    try {
      const response = await api.get('/enterprises/mine');

      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );

      setEnterpriseData(response.data);
    } catch {}
  }, []);

  const updateEnterprise = useCallback(async () => {
    try {
      const response = await api.put('/enterprises', {
        name: enterpriseData.name,
        address: enterpriseData.address,
        area: enterpriseData.area,
        primary_color: enterpriseData.primary_color,
        secondary_color: enterpriseData.secondary_color,
        isPrivate: !!enterpriseData.isPrivate,
      });

      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );

      setEnterpriseData(response.data);

      addToast({
        type: 'success',
        title: 'Dados da empresa atualizados!',
      });
    } catch {}
  }, [addToast, enterpriseData]);

  useEffect(() => {
    getMyEnterprises();
  }, [getMyEnterprises]);

  const callback = (image: any) => {
    setLoading(true);
    const data = new FormData();
    data.append('logo', image);

    api
      .patch('/enterprises/logo', data)
      .then((response) => {
        setEnterpriseData(response.data);

        addToast({
          type: 'success',
          title: 'Logo atualizada!',
        });
      })
      .catch(() => {
        addToast({
          type: 'error',
          title: 'Algo de errado ocorreu ao trocar a imagem, tente novamente.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { files } = e.target;

      if (files.length === 0) {
        return;
      }

      resize(files[0], callback);
    }
  }, []);

  return (
    <AdminShell
      eyebrow="Identidade da marca"
      title="Perfil da empresa"
      description="Edite posicionamento visual, dados públicos e comportamento do perfil em um fluxo mais claro, com prévia da experiência final."
      actions={
        <Button onClick={updateEnterprise}>
          <FiSave />
          Salvar alterações
        </Button>
      }
    >
      <Metrics>
        <MetricCard>
          <strong>{enterpriseData?.name ? 1 : 0}</strong>
          <span>Empresa configurada</span>
        </MetricCard>
        <MetricCard>
          <strong>{enterpriseData?.logo_url ? '100%' : '0%'}</strong>
          <span>Marca aplicada</span>
        </MetricCard>
        <MetricCard>
          <strong>{enterpriseData?.isPrivate ? 'Privado' : 'Aberto'}</strong>
          <span>Modo de agendamento</span>
        </MetricCard>
        <MetricCard>
          <strong>{enterpriseData?.area || '-'}</strong>
          <span>Área principal</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Dados públicos e marca</h2>
                <p>
                  Ajuste o que o cliente enxerga primeiro: nome, área, endereço e
                  identidade visual.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label
                  htmlFor="avatar"
                  style={{
                    position: 'relative',
                    width: 156,
                    height: 156,
                    display: 'block',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={enterpriseData?.logo_url || EnterpriseImg}
                    alt={myEnterprise.name}
                    style={{
                      width: 156,
                      height: 156,
                      borderRadius: 36,
                      objectFit: 'cover',
                      boxShadow: '0 20px 40px rgba(7, 17, 31, 0.15)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      bottom: 12,
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      background: '#ff8e28',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {loading ? <Loader /> : <FiCamera />}
                  </span>
                  <input type="file" onChange={handleAvatarChange} id="avatar" hidden />
                </label>
              </div>

              <InlineGrid>
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
                  placeholder="Nome da empresa"
                />

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
                  placeholder="Área de atuação"
                />
              </InlineGrid>

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
                placeholder="Endereço"
              />

              <InlineGrid>
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
              </InlineGrid>

              <ToggleRow>
                Perfil fechado: você controla quem pode se agendar
                <Switch
                  onChange={(e) =>
                    setEnterpriseData({
                      ...enterpriseData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                  name="isPrivate"
                  checked={!!enterpriseData.isPrivate}
                />
              </ToggleRow>
            </FormPanel>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Prévia da experiência</h2>
                <p>
                  Veja como a identidade da empresa aparece no app do cliente.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <PreviewPhone>
                <PreviewScreen
                  primary={enterpriseData?.primary_color || '#28262e'}
                  secondary={enterpriseData?.secondary_color || '#ff9000'}
                >
                  <PreviewHeader secondary={enterpriseData?.secondary_color || '#ff9000'}>
                    <FiArrowLeft />
                    <img
                      src={enterpriseData?.logo_url || EnterpriseImg}
                      alt="NaHora"
                    />
                  </PreviewHeader>
                  <PreviewBody primary={enterpriseData?.primary_color || '#28262e'}>
                    <PreviewBadge>
                      <FiEye style={{ marginRight: 8 }} />
                      Prévia em tempo real
                    </PreviewBadge>
                    <h3 style={{ color: '#fff', fontSize: '1.6rem' }}>
                      {enterpriseData?.name || 'Sua empresa'}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.7 }}>
                      {enterpriseData?.area || 'Área de atuação'}
                    </p>
                    <Button
                      primaryColor={enterpriseData?.primary_color || '#28262e'}
                      secondaryColor={enterpriseData?.secondary_color || '#ff9000'}
                    >
                      Reservar horário
                    </Button>
                    <StatusPill
                      tone={enterpriseData?.isPrivate ? 'warning' : 'success'}
                    >
                      {enterpriseData?.isPrivate
                        ? 'Acesso controlado'
                        : 'Acesso aberto'}
                    </StatusPill>
                  </PreviewBody>
                </PreviewScreen>
              </PreviewPhone>
            </div>
          </Panel>
        </Column>
      </Grid>
    </AdminShell>
  );
};

export default EnterpriseProfile;
