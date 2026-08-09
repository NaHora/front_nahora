import React, { useState } from 'react';
import { format } from 'date-fns';
import 'react-day-picker/lib/style.css';
import AdminShell from '../../components/AdminShell';
import RichTextEditor from '../../components/RichTextEditor';
import { useAuth } from '../../hooks/auth';
import {
  Panel,
  Toolbar,
  Field,
  Label,
  DateInput,
  Select,
  EditorWrap,
} from './styles';

const Training = () => {
  const { user } = useAuth();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const ownerEnterprise = thisEnterprise.owner_id === user.id;

  const [fullScreen, setFullScreen] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('time');

  if (fullScreen) {
    return (
      <RichTextEditor
        setFullScreen={setFullScreen}
        fullScreen={fullScreen}
        thisEnterprise={thisEnterprise.id}
        readOnly={!ownerEnterprise}
        date={date}
        type={type}
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

        <EditorWrap>
          <RichTextEditor
            setFullScreen={setFullScreen}
            fullScreen={fullScreen}
            thisEnterprise={thisEnterprise.id}
            readOnly={!ownerEnterprise}
            date={date}
            type={type}
          />
        </EditorWrap>
      </Panel>
    </AdminShell>
  );
};

export default Training;
