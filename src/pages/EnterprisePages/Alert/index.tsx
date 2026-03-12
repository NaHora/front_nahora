import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiBell, FiEye, FiSave, FiTrash2 } from 'react-icons/fi';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/Button';
import InputDefault from '../../../components/InputDefault';
import AlertToast from '../../../components/AlertToast';
import EnterpriseImg from '../../../assets/empresa.png';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import {
  Metrics,
  MetricCard,
  Grid,
  Column,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  FormPanel,
  EmptyState,
  PreviewPhone,
  PreviewScreen,
  PreviewHeader,
  PreviewBody,
  PreviewBadge,
  StatusPill,
  ActionRow,
} from '../shared';

interface AlertData {
  id: string;
  title?: string;
  description?: string;
  enterprise_id: string;
}

const Alert: React.FC = () => {
  const [enterpriseData, setEnterpriseData] = useState<any>({});
  const [currentAlert, setCurrentAlert] = useState<AlertData | any>({});
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

      setEnterpriseData((current) => ({
        ...response.data,
        title: current.title || '',
        description: current.description || '',
      }));
    } catch {}
  }, []);

  const getMyAlerts = useCallback(async () => {
    try {
      const response = await api.get(`/alert/${myEnterprise.id}`);
      setCurrentAlert(response.data);
    } catch {
      setCurrentAlert({});
    }
  }, [myEnterprise.id]);

  const updateEnterpriseAlert = useCallback(async () => {
    try {
      await api.post('/alert', {
        title: enterpriseData.title,
        description: enterpriseData.description,
      });
      getMyAlerts();
      setEnterpriseData({
        ...enterpriseData,
        title: '',
        description: '',
      });
      addToast({
        type: 'success',
        title: 'Alerta criado para seus clientes!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao criar o alerta, tente novamente',
      });
    }
  }, [addToast, enterpriseData, getMyAlerts]);

  const deleteAlert = useCallback(async () => {
    try {
      await api.delete(`/alert/${currentAlert.id}`);
      setCurrentAlert({});
      setEnterpriseData({
        ...enterpriseData,
        title: '',
        description: '',
      });

      addToast({
        type: 'success',
        title: 'Alerta desativado para seus clientes!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title:
          err.response?.data.message ||
          'Ocorreu um erro ao desativar o alerta, tente novamente',
      });
    }
  }, [addToast, currentAlert.id, enterpriseData]);

  useEffect(() => {
    getMyEnterprises();
  }, [getMyEnterprises]);

  useEffect(() => {
    getMyAlerts();
  }, [getMyAlerts]);

  const previewTitle = enterpriseData?.title || currentAlert?.title;
  const previewDescription =
    enterpriseData?.description || currentAlert?.description;

  const alertStatus = useMemo(() => {
    if (currentAlert?.id) return 'Ativo';
    if (enterpriseData?.title || enterpriseData?.description) return 'Rascunho';
    return 'Sem alerta';
  }, [currentAlert?.id, enterpriseData?.description, enterpriseData?.title]);

  return (
    <AdminShell
      eyebrow="Comunicação com clientes"
      title="Alertas da operação"
      description="Crie comunicados rápidos para aparecer no app dos clientes sem poluir outras telas de gestão."
      actions={
        <Button onClick={updateEnterpriseAlert}>
          <FiSave />
          Publicar alerta
        </Button>
      }
    >
      <Metrics>
        <MetricCard>
          <strong>{currentAlert?.id ? 1 : 0}</strong>
          <span>Alerta ativo no app</span>
        </MetricCard>
        <MetricCard>
          <strong>{enterpriseData?.title ? enterpriseData.title.length : 0}</strong>
          <span>Caracteres no título</span>
        </MetricCard>
        <MetricCard>
          <strong>
            {enterpriseData?.description ? enterpriseData.description.length : 0}
          </strong>
          <span>Caracteres na descrição</span>
        </MetricCard>
        <MetricCard>
          <strong>{alertStatus}</strong>
          <span>Status atual do comunicado</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Editor do alerta</h2>
                <p>
                  Escreva o comunicado que será exibido para os clientes no app.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
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
                placeholder="Título do alerta"
              />

              <textarea
                value={enterpriseData?.description || ''}
                onChange={(e) =>
                  setEnterpriseData({
                    ...enterpriseData,
                    [e.target.name]: e.target.value,
                  })
                }
                name="description"
                rows={8}
                style={{
                  color: '#0c1729',
                  border: '1px solid rgba(12, 23, 41, 0.08)',
                  background: '#ffffff',
                  borderRadius: 18,
                  padding: 16,
                  resize: 'vertical',
                  boxShadow: '0 18px 40px rgba(7, 17, 31, 0.08)',
                }}
                placeholder="Escreva a descrição do alerta"
              />

              <ActionRow>
                <Button onClick={updateEnterpriseAlert}>
                  <FiBell />
                  Salvar alerta
                </Button>
                {currentAlert?.id && (
                  <Button
                    primaryColor="#ffffff"
                    secondaryColor="#d5384b"
                    transparent
                    onClick={deleteAlert}
                  >
                    <FiTrash2 />
                    Desativar atual
                  </Button>
                )}
              </ActionRow>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Estado atual</h2>
                <p>Resumo rápido da comunicação ativa e do que está em rascunho.</p>
              </PanelTitleWrap>
            </PanelHeader>

            {currentAlert?.id ? (
              <FormPanel>
                <StatusPill tone="success">Alerta ativo</StatusPill>
                <strong style={{ color: '#0c1729' }}>
                  {currentAlert.title || 'Sem título'}
                </strong>
                <p style={{ color: '#62748d', lineHeight: 1.7 }}>
                  {currentAlert.description || 'Sem descrição.'}
                </p>
              </FormPanel>
            ) : (
              <EmptyState>Nenhum alerta ativo no momento.</EmptyState>
            )}
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Prévia no app</h2>
                <p>Visualize como o cliente enxerga o comunicado dentro da interface.</p>
              </PanelTitleWrap>
            </PanelHeader>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <PreviewPhone>
                <PreviewScreen
                  primary={enterpriseData?.primary_color || '#28262e'}
                  secondary={enterpriseData?.secondary_color || '#ff9000'}
                >
                  <PreviewHeader secondary={enterpriseData?.secondary_color || '#ff9000'}>
                    <FiEye />
                    <img
                      src={enterpriseData?.logo_url || EnterpriseImg}
                      alt="NaHora"
                    />
                  </PreviewHeader>
                  <PreviewBody primary={enterpriseData?.primary_color || '#28262e'}>
                    <PreviewBadge>Prévia em tempo real</PreviewBadge>
                    {(previewTitle || previewDescription || currentAlert?.id) && (
                      <AlertToast
                        mobile
                        title={previewTitle}
                        description={previewDescription}
                      />
                    )}
                    <Button
                      primaryColor={enterpriseData?.primary_color || '#28262e'}
                      secondaryColor={
                        enterpriseData?.secondary_color || '#ff9000'
                      }
                    >
                      Modelo de botão
                    </Button>
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

export default Alert;
