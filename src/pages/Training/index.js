import React, { useCallback, useEffect, useState } from 'react';
import { format, getDate, getMonth, getYear } from 'date-fns';
import 'react-day-picker/lib/style.css';
import AdminShell from '../../components/AdminShell';
import RichTextEditor from '../../components/RichTextEditor';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Panel,
  Toolbar,
  Field,
  Label,
  DateInput,
  Select,
  EditorWrap,
  PlanChips,
  PlanChip,
  Help,
} from './styles';

const Training = () => {
  const { user } = useAuth();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const ownerEnterprise = thisEnterprise.owner_id === user.id;

  const [fullScreen, setFullScreen] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('time');
  const [plans, setPlans] = useState([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState([]);

  const loadPlans = useCallback(async () => {
    if (!ownerEnterprise) return;
    try {
      const response = await api.get('/plans');
      setPlans(response.data || []);
    } catch {}
  }, [ownerEnterprise]);

  const loadTrainingPlans = useCallback(async () => {
    if (!thisEnterprise?.id || !date) return;
    try {
      const d = new Date(date);
      const response = await api.get(
        `/training/year/${getYear(d)}/month/${
          getMonth(d) + 1
        }/day/${getDate(d) + 1}/enterprise/${thisEnterprise.id}`,
      );
      const existingPlans = response?.data?.plans || [];
      setSelectedPlanIds(existingPlans.map((p) => p.id));
    } catch {
      setSelectedPlanIds([]);
    }
  }, [date, thisEnterprise?.id]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    loadTrainingPlans();
  }, [loadTrainingPlans]);

  const togglePlan = (planId) => {
    setSelectedPlanIds((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId],
    );
  };

  if (fullScreen) {
    return (
      <RichTextEditor
        setFullScreen={setFullScreen}
        fullScreen={fullScreen}
        thisEnterprise={thisEnterprise.id}
        readOnly={!ownerEnterprise}
        date={date}
        type={type}
        planIds={ownerEnterprise ? selectedPlanIds : undefined}
        onSaved={loadTrainingPlans}
      />
    );
  }

  return (
    <AdminShell
      eyebrow="Operação"
      title="Treino do dia"
      description="Escolha a data, defina o tipo de rank e descreva o wod que a turma vai executar."
    >
      <Panel>
        <Toolbar>
          <Field>
            <Label>Data</Label>
            <DateInput
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          {ownerEnterprise && (
            <Field>
              <Label>Tipo de rank</Label>
              <Select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="time">Rank por tempo</option>
                <option value="reps">Rank por reps</option>
              </Select>
            </Field>
          )}
        </Toolbar>

        {ownerEnterprise && (
          <Field style={{ width: '100%' }}>
            <Label>Planos que enxergam esse treino</Label>
            {plans.length === 0 ? (
              <Help>
                Nenhum plano cadastrado. Sem plano associado, o treino fica
                visível para todos os clientes.
              </Help>
            ) : (
              <>
                <PlanChips>
                  {plans.map((plan) => (
                    <PlanChip
                      key={plan.id}
                      type="button"
                      active={selectedPlanIds.includes(plan.id)}
                      onClick={() => togglePlan(plan.id)}
                    >
                      {plan.name}
                    </PlanChip>
                  ))}
                </PlanChips>
                <Help>
                  {selectedPlanIds.length === 0
                    ? 'Sem plano selecionado — o treino fica visível para todos os clientes.'
                    : `Somente ${
                        selectedPlanIds.length
                      } plano(s) selecionado(s) verão esse treino.`}
                </Help>
              </>
            )}
          </Field>
        )}

        <EditorWrap>
          <RichTextEditor
            setFullScreen={setFullScreen}
            fullScreen={fullScreen}
            thisEnterprise={thisEnterprise.id}
            readOnly={!ownerEnterprise}
            date={date}
            type={type}
            planIds={ownerEnterprise ? selectedPlanIds : undefined}
            onSaved={loadTrainingPlans}
          />
        </EditorWrap>
      </Panel>
    </AdminShell>
  );
};

export default Training;
