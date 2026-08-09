import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiCamera,
  FiClock,
  FiCompass,
  FiDroplet,
  FiEye,
  FiImage,
  FiLock,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUnlock,
} from 'react-icons/fi';
import { Switch } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import Loader from 'react-loader-spinner';
import AdminShell from '../../../components/AdminShell';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import EnterpriseImg from '../../../assets/empresa.png';
import resize from '../../../components/Resize';
import {
  Column,
  ColorRow,
  ColorSwatch,
  Divider,
  Field,
  FormPanel,
  Grid,
  InlineGrid,
  InlineGridThree,
  Input,
  LogoBadge,
  LogoBox,
  LogoRow,
  LogoText,
  MetricCard,
  MetricEyebrow,
  Metrics,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PreviewBody,
  PreviewButton,
  PreviewHeader,
  PreviewPhone,
  PreviewScreen,
  SaveButton,
  SectionLabel,
  StatusPill,
  ToggleContent,
  ToggleRow,
} from './styles';

interface Enterprise {
  id?: string;
  name?: string;
  area?: string;
  address?: string;
  phone?: string;
  open_hour?: string;
  close_hour?: string;
  lat?: string;
  long?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  isPrivate?: boolean | number;
}

const EnterpriseProfile: React.FC = () => {
  const { addToast } = useToast();
  const [enterprise, setEnterprise] = useState<Enterprise>({});
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  const persist = useCallback((data: Enterprise) => {
    localStorage.setItem('@NaHora:myEnterprise', JSON.stringify(data));
    localStorage.setItem('enterprise', JSON.stringify(data));
  }, []);

  const loadEnterprise = useCallback(async () => {
    try {
      const response = await api.get('/enterprises/mine');
      setEnterprise(response.data || {});
      persist(response.data);
    } catch {}
  }, [persist]);

  useEffect(() => {
    loadEnterprise();
  }, [loadEnterprise]);

  const updateEnterprise = useCallback(async () => {
    setSaving(true);
    try {
      const response = await api.put('/enterprises', {
        name: enterprise.name,
        address: enterprise.address,
        area: enterprise.area,
        phone: enterprise.phone,
        open_hour: enterprise.open_hour,
        close_hour: enterprise.close_hour,
        lat: enterprise.lat,
        long: enterprise.long,
        primary_color: enterprise.primary_color,
        secondary_color: enterprise.secondary_color,
        isPrivate: !!enterprise.isPrivate,
      });
      setEnterprise(response.data);
      persist(response.data);
      addToast({ type: 'success', title: 'Dados da empresa atualizados.' });
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao atualizar dados da empresa.',
      });
    } finally {
      setSaving(false);
    }
  }, [addToast, enterprise, persist]);

  const uploadLogoCallback = useCallback(
    (image: any) => {
      setLoadingLogo(true);
      const data = new FormData();
      data.append('logo', image);
      api
        .patch('/enterprises/logo', data)
        .then((response) => {
          setEnterprise(response.data);
          persist(response.data);
          addToast({ type: 'success', title: 'Logo atualizada.' });
        })
        .catch(() => {
          addToast({
            type: 'error',
            title: 'Não foi possível trocar a imagem, tente novamente.',
          });
        })
        .finally(() => setLoadingLogo(false));
    },
    [addToast, persist],
  );

  const handleLogoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      resize(file, uploadLogoCallback);
    },
    [uploadLogoCallback],
  );

  const setField = (name: keyof Enterprise, value: string | boolean) =>
    setEnterprise((prev) => ({ ...prev, [name]: value }));

  return (
    <AdminShell
      eyebrow="Identidade da empresa"
      title="Perfil da empresa"
      description="Dados públicos, contato, funcionamento, localização e identidade visual."
      actions={
        <SaveButton type="button" onClick={updateEnterprise} disabled={saving}>
          <FiSave /> {saving ? 'Salvando...' : 'Salvar alterações'}
        </SaveButton>
      }
    >
      <Metrics>
        <MetricCard>
          <MetricEyebrow>
            <FiImage /> Identidade
          </MetricEyebrow>
          <strong>{enterprise.logo_url ? '100%' : '0%'}</strong>
          <span>Logo aplicada ao perfil.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiPhone /> Contato
          </MetricEyebrow>
          <strong>{enterprise.phone ? 'OK' : '—'}</strong>
          <span>Telefone público disponível.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiClock /> Funcionamento
          </MetricEyebrow>
          <strong>
            {enterprise.open_hour && enterprise.close_hour
              ? `${enterprise.open_hour} → ${enterprise.close_hour}`
              : '—'}
          </strong>
          <span>Horários exibidos ao cliente.</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            {enterprise.isPrivate ? <FiLock /> : <FiUnlock />} Acesso
          </MetricEyebrow>
          <strong>{enterprise.isPrivate ? 'Fechado' : 'Aberto'}</strong>
          <span>Modo atual de agendamento.</span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Dados básicos</h2>
                <p>
                  Como sua empresa aparece pro cliente: nome, área, contato e
                  endereço.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <LogoRow>
                <LogoBox htmlFor="avatar">
                  <img
                    src={enterprise.logo_url || EnterpriseImg}
                    alt={enterprise.name || 'Logo da empresa'}
                  />
                  <LogoBadge>
                    {loadingLogo ? (
                      <Loader type="Watch" color="#0b0b0b" height={16} width={16} />
                    ) : (
                      <FiCamera />
                    )}
                  </LogoBadge>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </LogoBox>
                <LogoText>
                  <strong>Logo da empresa</strong>
                  Use um arquivo quadrado (mínimo 512×512) para melhor
                  apresentação no app e no site público.
                </LogoText>
              </LogoRow>

              <Divider />

              <InlineGrid>
                <Field>
                  <span>Nome da empresa</span>
                  <Input
                    name="name"
                    value={enterprise.name || ''}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Ex.: Box NaHora"
                  />
                </Field>
                <Field>
                  <span>Área de atuação</span>
                  <Input
                    name="area"
                    value={enterprise.area || ''}
                    onChange={(e) => setField('area', e.target.value)}
                    placeholder="Ex.: Crossfit"
                  />
                </Field>
              </InlineGrid>

              <Field>
                <span>Endereço</span>
                <Input
                  name="address"
                  value={enterprise.address || ''}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                />
              </Field>

              <Field>
                <span>Telefone / WhatsApp</span>
                <NumberFormat
                  customInput={Input}
                  format="(##) #####-####"
                  mask="_"
                  name="phone"
                  value={enterprise.phone || ''}
                  placeholder="(00) 00000-0000"
                  onValueChange={(v: { value: string }) =>
                    setField('phone', v.value)
                  }
                />
              </Field>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Funcionamento</h2>
                <p>
                  Horários que a base pode agendar. Fora desse intervalo o app
                  bloqueia novos horários.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <Field>
                  <span>Abre às</span>
                  <Input
                    type="time"
                    name="open_hour"
                    value={enterprise.open_hour || ''}
                    onChange={(e) => setField('open_hour', e.target.value)}
                  />
                </Field>
                <Field>
                  <span>Fecha às</span>
                  <Input
                    type="time"
                    name="close_hour"
                    value={enterprise.close_hour || ''}
                    onChange={(e) => setField('close_hour', e.target.value)}
                  />
                </Field>
              </InlineGrid>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Localização</h2>
                <p>
                  Coordenadas usadas para mapa e cálculo de distância no app.
                  Você pode copiar do Google Maps.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <Field>
                  <span>
                    <FiMapPin
                      style={{
                        display: 'inline',
                        marginRight: 4,
                        verticalAlign: '-2px',
                      }}
                    />
                    Latitude
                  </span>
                  <Input
                    name="lat"
                    value={enterprise.lat || ''}
                    onChange={(e) => setField('lat', e.target.value)}
                    placeholder="-23.5505"
                  />
                </Field>
                <Field>
                  <span>
                    <FiCompass
                      style={{
                        display: 'inline',
                        marginRight: 4,
                        verticalAlign: '-2px',
                      }}
                    />
                    Longitude
                  </span>
                  <Input
                    name="long"
                    value={enterprise.long || ''}
                    onChange={(e) => setField('long', e.target.value)}
                    placeholder="-46.6333"
                  />
                </Field>
              </InlineGrid>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Identidade visual</h2>
                <p>
                  Cores usadas no app e no site público. A primária é o fundo
                  principal, a secundária destaca botões e badges.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <InlineGrid>
                <Field>
                  <span>
                    <FiDroplet
                      style={{
                        display: 'inline',
                        marginRight: 4,
                        verticalAlign: '-2px',
                      }}
                    />
                    Cor primária
                  </span>
                  <ColorRow>
                    <ColorSwatch
                      type="color"
                      value={enterprise.primary_color || '#28262e'}
                      onChange={(e) =>
                        setField('primary_color', e.target.value)
                      }
                    />
                    <Input
                      name="primary_color"
                      value={enterprise.primary_color || ''}
                      onChange={(e) =>
                        setField('primary_color', e.target.value)
                      }
                      placeholder="#28262e"
                    />
                  </ColorRow>
                </Field>
                <Field>
                  <span>
                    <FiDroplet
                      style={{
                        display: 'inline',
                        marginRight: 4,
                        verticalAlign: '-2px',
                      }}
                    />
                    Cor secundária
                  </span>
                  <ColorRow>
                    <ColorSwatch
                      type="color"
                      value={enterprise.secondary_color || '#ff9000'}
                      onChange={(e) =>
                        setField('secondary_color', e.target.value)
                      }
                    />
                    <Input
                      name="secondary_color"
                      value={enterprise.secondary_color || ''}
                      onChange={(e) =>
                        setField('secondary_color', e.target.value)
                      }
                      placeholder="#ff9000"
                    />
                  </ColorRow>
                </Field>
              </InlineGrid>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Acesso</h2>
                <p>Controle se qualquer usuário pode seguir/agendar direto.</p>
              </PanelTitleWrap>
            </PanelHeader>

            <FormPanel>
              <ToggleRow>
                <ToggleContent>
                  <strong>Perfil fechado</strong>
                  <span>
                    Novos clientes precisam da sua aprovação antes de agendar.
                  </span>
                </ToggleContent>
                <Switch
                  name="isPrivate"
                  checked={!!enterprise.isPrivate}
                  onChange={(e) => setField('isPrivate', e.target.checked)}
                />
              </ToggleRow>
            </FormPanel>
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Prévia no app</h2>
                <p>
                  Como o cliente enxerga a identidade da sua empresa hoje.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <div style={{ marginTop: 22 }}>
              <PreviewPhone>
                <PreviewScreen
                  primary={enterprise.primary_color || '#28262e'}
                  secondary={enterprise.secondary_color || '#ff9000'}
                >
                  <PreviewHeader
                    secondary={enterprise.secondary_color || '#ff9000'}
                  >
                    <FiArrowLeft color="#fff" />
                    <img
                      src={enterprise.logo_url || EnterpriseImg}
                      alt="Logo"
                    />
                  </PreviewHeader>
                  <PreviewBody>
                    <SectionLabel style={{ color: '#fff' }}>
                      <FiEye
                        style={{
                          display: 'inline',
                          marginRight: 6,
                          verticalAlign: '-2px',
                        }}
                      />
                      Prévia em tempo real
                    </SectionLabel>
                    <h3 style={{ color: '#fff', fontSize: '1.4rem' }}>
                      {enterprise.name || 'Sua empresa'}
                    </h3>
                    <div style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {enterprise.area || 'Área de atuação'}
                    </div>
                    {enterprise.address && (
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.86rem',
                        }}
                      >
                        <FiMapPin
                          style={{
                            display: 'inline',
                            marginRight: 6,
                            verticalAlign: '-2px',
                          }}
                        />
                        {enterprise.address}
                      </div>
                    )}
                    {(enterprise.open_hour || enterprise.close_hour) && (
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.86rem',
                        }}
                      >
                        <FiClock
                          style={{
                            display: 'inline',
                            marginRight: 6,
                            verticalAlign: '-2px',
                          }}
                        />
                        {enterprise.open_hour || '--:--'} —{' '}
                        {enterprise.close_hour || '--:--'}
                      </div>
                    )}
                    <PreviewButton
                      secondary={enterprise.secondary_color || '#ff9000'}
                    >
                      Reservar horário
                    </PreviewButton>
                    <StatusPill
                      tone={enterprise.isPrivate ? 'warning' : 'success'}
                    >
                      {enterprise.isPrivate ? 'Acesso controlado' : 'Acesso aberto'}
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
