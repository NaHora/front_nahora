import React, { useState, useEffect, useCallback } from 'react';

import { format, getDate, getDay, getMonth, getYear } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { Container, SelectDefault } from './styles';
import 'react-day-picker/lib/style.css';

import { useToast } from '../../hooks/toast';

import { useAuth } from '../../hooks/auth';

import { useLoad } from '../../hooks/load';

import EnterpriseHeader from '../../components/EnterpriseHeader';

import InputDefault from '../../components/InputDefault';
import { routes } from '../../routes';
import api from '../../services/api';
import Button from '../../components/Button';
import NumberFormat from 'react-number-format';

const Benchmark = () => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
  // const { socket } = useSocket();
  const { start, stop } = useLoad();

  useEffect(() => {
    if (!user.gender) {
      toast.addToast({
        type: 'info',
        title: 'Informe seu gênero, para continuar.',
      });
      history.push(routes.profile);
    }
  }, []);

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const owner_enterprise = thisEnterprise.owner_id === user.id;

  const [primaryColor, setPrimaryColor] = useState('#28262e');

  const [secondaryColor, setSecondaryColor] = useState('#ff9000');
  const [values, setValues] = useState({
    category: 'rx',
  });

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [training, setTraining] = useState({});

  const getTraining = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/year/${getYear(new Date(date))}/month/${
          getMonth(new Date(date)) + 1
        }/day/${getDate(new Date(date)) + 1}/enterprise/${thisEnterprise.id}`,
      );
      setTraining(response.data);
    } catch {}
  }, [date, thisEnterprise]);

  useEffect(() => {
    getTraining();
  }, [date]);
  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  const handleScore = useCallback(async () => {
    start();
    try {
      const body = {
        enterprise_id: thisEnterprise.id,
        training_id: training.id,
        type: values.category,
        gender: user.gender,
        score: values.score,
      };
      const response = await api.post(`/training/wod`, body);
      toast.addToast({ type: 'success', title: 'score adicionado!' });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao adicionar o score, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao adicionar o score, tente novamente',
        });
      }
    } finally {
      stop();
    }
  }, [user, thisEnterprise, values, training]);

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
        <h2>Adicione seu pr:</h2>
        <main>
          benchpress deadlift frontsquat overheadsquat maxwallball pushpress
          shoulderpress thruster clean cleanjerk cluster hangpowerclean
          hangpowersnatch handsquatsnatch hangsquatclean powerclean powersnatch
          pushjerk snatch snatchbalance splitjerk squatclean squatsnatch
          <label htmlFor="">
            Back Squat
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="backsquat"
              margin={false}
              maxWidth="180px"
              suffix=" Kg"
              placeholder="Back Squat"
              thousandSeparator="."
              type="text"
              value={values.backsquat}
              onValueChange={(e) => {
                console.log(e);
                setValues({
                  ...values,
                  backsquat: e.floatValue,
                });
              }}
            />
          </label>
        </main>
        <Button
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
          onClick={() => console.log(values)}
        >
          adicionar
        </Button>
      </div>
    </Container>
  );
};

export default Benchmark;
