import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';

import { makeStyles } from '@material-ui/core/styles';

import { Container, SelectDefault } from './styles';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';

import EnterpriseHeader from '../../components/EnterpriseHeader';

import RichTextEditor from '../../components/RichTextEditor';
import InputDefault from '../../components/InputDefault';

const Training = () => {
  const { user } = useAuth();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const owner_enterprise = thisEnterprise.owner_id === user.id;

  const [primaryColor, setPrimaryColor] = useState('#28262e');

  const [secondaryColor, setSecondaryColor] = useState('#ff9000');

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('time');

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  return (
    <Container
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      <EnterpriseHeader
        service={true}
        primaryColor={primaryColor || '#28262e'}
        secondaryColor={secondaryColor || '#ff9000'}
        name={thisEnterprise.name}
        logo_url={thisEnterprise.logo_url}
      />
      <div>
        <header>
          <InputDefault
            name="date"
            maxWidth="180px"
            margin={true}
            type="date"
            value={date}
            placeholder="Data"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />

          {owner_enterprise && (
            <SelectDefault
              name="type"
              value={type}
              placeholder="Tipo"
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value="time">rank por tempo</option>
              <option value="reps">rank por reps</option>
            </SelectDefault>
          )}
        </header>

        <RichTextEditor
          thisEnterprise={thisEnterprise.id}
          readOnly={!owner_enterprise}
          date={date}
          type={type}
        />
      </div>
    </Container>
  );
};

export default Training;
