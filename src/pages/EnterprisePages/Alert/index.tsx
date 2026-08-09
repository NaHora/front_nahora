import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiBell,
  FiCheckCircle,
  FiEye,
  FiMessageSquare,
  FiSave,
  FiTrash2,
  FiType,
} from 'react-icons/fi';
import AdminShell from '../../../components/AdminShell';
import EnterpriseImg from '../../../assets/empresa.png';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import {
  ActionRow,
  ActiveCard,
  CharCount,
  Column,
  DangerButton,
  EmptyState,
  Field,
  FormPanel,
  Grid,
  Input,
  MetricCard,
  MetricEyebrow,
  Metrics,
  Panel,
  PanelHeader,
  PanelTitleWrap,
  PreviewBody,
  PreviewHeader,
  PreviewPhone,
  PreviewScreen,
  PreviewToast,
  PrimaryButton,
  StatusPill,
  Textarea,
} from './styles';

interface Enterprise {
  id?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}

interface Communication {
  id?: string;
  title?: string;
  description?: string;
}

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 240;

const Alert: React.FC = () => {
  const { addToast } = useToast();
  const [enterprise, setEnterprise] = useState<Enterprise>({});
  const [current, setCurrent] = useState<Communication>({});
  const [draft, setDraft] = useState<Communication>({
    title: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );

  const loadEnterprise = useCallback(async () => {
    try {
      const response = await api.get('/enterprises/mine');
      setEnterprise(response.data || {});
      localStorage.setItem(
        '@NaHora:myEnterprise',
        JSON.stringify(response.data),
      );
    } catch {}
  }, []);

  const loadCurrent = useCallback(async () => {
    if (!myEnterprise?.id) return;
    try {
      const response = await api.get(`/alert/${myEnterprise.id}`);
      const data = response.data || {};
      setCurrent(data);
      setDraft({
        title: data.title || '',
        description: data.description || '',
      });
    } catch {
      setCurrent({});
    }
  }, [myEnterprise?.id]);

  useEffect(() => {
    loadEnterprise();
    loadCurrent();
  }, [loadEnterprise, loadCurrent]);

  const publish = useCallback(async () => {
    if (!draft.title?.trim() && !draft.description?.trim()) {
      addToast({
        type: 'error',
        title: 'Escreva um título ou descrição para publicar o comunicado.',
      });
      return;
    }
    setSaving(true);
    try {
      await api.post('/alert', {
        title: draft.title,
        description: draft.description,
      });
      addToast({ type: 'success', title: 'Comunicado publicado.' });
      loadCurrent();
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao publicar o comunicado.',
      });
    } finally {
      setSaving(false);
    }
  }, [draft.title, draft.description, addToast, loadCurrent]);

  const removeCurrent = useCallback(async () => {
    if (!current?.id) return;
    setDeleting(true);
    try {
      await api.delete(`/alert/${current.id}`);
      addToast({ type: 'success', title: 'Comunicado desativado.' });
      setCurrent({});
      setDraft({ title: '', description: '' });
    } catch (err: any) {
      addToast({
        type: 'error',
        title:
          err?.response?.data?.message || 'Erro ao desativar o comunicado.',
      });
    } finally {
      setDeleting(false);
    }
  }, [current?.id, addToast]);

  const hasDraftChanges = useMemo(() => {
    return (
      (draft.title || '') !== (current?.title || '') ||
      (draft.description || '') !== (current?.description || '')
    );
  }, [draft.title, draft.description, current?.title, current?.description]);

  const status = useMemo(() => {
    if (current?.id && !hasDraftChanges)
      return { label: 'Publicado', tone: 'success' as const };
    if (current?.id && hasDraftChanges)
      return { label: 'Alterações não publicadas', tone: 'draft' as const };
    if (draft.title || draft.description)
      return { label: 'Rascunho', tone: 'draft' as const };
    return { label: 'Sem comunicado', tone: 'muted' as const };
  }, [current?.id, draft.title, draft.description, hasDraftChanges]);

  const titleLength = (draft.title || '').length;
  const descLength = (draft.description || '').length;

  const previewTitle = draft.title || current?.title;
  const previewDescription = draft.description || current?.description;
  const hasPreview = Boolean(previewTitle || previewDescription);

  return (
    <AdminShell
      eyebrow="Comunicação"
      title="Comunicado da empresa"
      description="Publique um aviso rápido que aparece no app dos clientes. Ideal para feriado, manutenção, promoção ou mudança de horário."
      actions={
        <PrimaryButton type="button" onClick={publish} disabled={saving}>
          <FiSave /> {saving ? 'Publicando...' : 'Publicar comunicado'}
        </PrimaryButton>
      }
    >
      <Metrics>
        <MetricCard>
          <MetricEyebrow>
            <FiBell /> Estado
          </MetricEyebrow>
          <strong>{current?.id ? 'Ativo' : 'Inativo'}</strong>
          <span>{status.label}</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiType /> Título
          </MetricEyebrow>
          <strong>{titleLength}</strong>
          <span>de {TITLE_LIMIT} caracteres</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiMessageSquare /> Descrição
          </MetricEyebrow>
          <strong>{descLength}</strong>
          <span>de {DESCRIPTION_LIMIT} caracteres</span>
        </MetricCard>
        <MetricCard>
          <MetricEyebrow>
            <FiCheckCircle /> Publicado desde
          </MetricEyebrow>
          <strong>{current?.id ? 'Sim' : '—'}</strong>
          <span>
            {current?.id
              ? 'Visível no app dos clientes agora.'
              : 'Nenhuma mensagem publicada.'}
          </span>
        </MetricCard>
      </Metrics>

      <Grid>
        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Editor do comunicado</h2>
                <p>
                  Escreva a mensagem que os clientes verão no topo do app.
                  Somente um comunicado pode estar ativo por vez.
                </p>
              </PanelTitleWrap>
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
            </PanelHeader>

            <FormPanel>
              <Field>
                <span>Título</span>
                <Input
                  name="title"
                  value={draft.title || ''}
                  maxLength={TITLE_LIMIT}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  placeholder="Ex.: Fechado no feriado"
                />
                <CharCount danger={titleLength >= TITLE_LIMIT}>
                  {titleLength}/{TITLE_LIMIT}
                </CharCount>
              </Field>

              <Field>
                <span>Descrição</span>
                <Textarea
                  name="description"
                  value={draft.description || ''}
                  maxLength={DESCRIPTION_LIMIT}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  placeholder="Explique o comunicado com detalhes. Pode usar quebras de linha."
                />
                <CharCount danger={descLength >= DESCRIPTION_LIMIT}>
                  {descLength}/{DESCRIPTION_LIMIT}
                </CharCount>
              </Field>

              <ActionRow>
                <PrimaryButton
                  type="button"
                  onClick={publish}
                  disabled={saving}
                >
                  <FiSave /> {saving ? 'Publicando...' : 'Publicar'}
                </PrimaryButton>
                {current?.id && (
                  <DangerButton
                    type="button"
                    onClick={removeCurrent}
                    disabled={deleting}
                  >
                    <FiTrash2 />
                    {deleting ? 'Desativando...' : 'Desativar atual'}
                  </DangerButton>
                )}
              </ActionRow>
            </FormPanel>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Comunicado ativo</h2>
                <p>Mensagem visível para o cliente neste momento.</p>
              </PanelTitleWrap>
            </PanelHeader>

            {current?.id ? (
              <ActiveCard>
                <StatusPill tone="success">
                  <FiCheckCircle /> Publicado
                </StatusPill>
                <strong>{current.title || 'Sem título'}</strong>
                <p>{current.description || 'Sem descrição.'}</p>
              </ActiveCard>
            ) : (
              <EmptyState>
                Nenhum comunicado publicado. Escreva um aviso acima e clique em
                Publicar.
              </EmptyState>
            )}
          </Panel>
        </Column>

        <Column>
          <Panel>
            <PanelHeader>
              <PanelTitleWrap>
                <h2>Prévia no app</h2>
                <p>
                  Como o comunicado aparece dentro do app assim que o cliente
                  abre.
                </p>
              </PanelTitleWrap>
            </PanelHeader>

            <PreviewPhone>
              <PreviewScreen
                primary={enterprise.primary_color || '#28262e'}
                secondary={enterprise.secondary_color || '#ff9000'}
              >
                <PreviewHeader
                  secondary={enterprise.secondary_color || '#ff9000'}
                >
                  <FiEye color="#fff" />
                  <img
                    src={enterprise.logo_url || EnterpriseImg}
                    alt="Empresa"
                  />
                </PreviewHeader>
                <PreviewBody>
                  <div style={{ color: '#fff', fontWeight: 700 }}>
                    Home do cliente
                  </div>
                  {hasPreview ? (
                    <PreviewToast
                      secondary={enterprise.secondary_color || '#ff9000'}
                    >
                      <strong>{previewTitle || 'Título do comunicado'}</strong>
                      <p>
                        {previewDescription ||
                          'A mensagem completa aparece aqui.'}
                      </p>
                    </PreviewToast>
                  ) : (
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.85rem',
                      }}
                    >
                      Nenhum comunicado no app.
                    </div>
                  )}
                </PreviewBody>
              </PreviewScreen>
            </PreviewPhone>
          </Panel>
        </Column>
      </Grid>
    </AdminShell>
  );
};

export default Alert;
