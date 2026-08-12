import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Container } from './styles';
import 'react-day-picker/lib/style.css';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { useLoad } from '../../hooks/load';
import EnterpriseHeader from '../../components/EnterpriseHeader';
import InputDefault from '../../components/InputDefault';
import { routes } from '../../routes';
import api from '../../services/api';
import Button from '../../components/Button';
import {
  getPrMovements,
  parseTimeInput,
  centisecondsToInputDigits,
} from '../../config/prMovements';

const Benchmark = () => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
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

  const [primaryColor, setPrimaryColor] = useState('#28262e');
  const [secondaryColor, setSecondaryColor] = useState('#ff9000');
  const [values, setValues] = useState({});

  const movements = useMemo(
    () => getPrMovements(thisEnterprise?.area),
    [thisEnterprise?.area],
  );

  const isSwimming = movements.length > 0 && movements[0].unit === 'time';

  const getBenchmark = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/benchmark/enterprise/${thisEnterprise.id}`,
      );
      setValues(response.data || {});
    } catch {}
  }, [thisEnterprise.id]);

  useEffect(() => {
    getBenchmark();
  }, [getBenchmark]);

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, [thisEnterprise.primary_color, thisEnterprise.secondary_color]);

  const handleBenchmark = useCallback(async () => {
    start();
    try {
      const cleaned = { ...values };
      delete cleaned.id;
      delete cleaned.updated_at;
      delete cleaned.created_at;
      delete cleaned.user_id;

      const body = {
        enterprise_id: thisEnterprise.id,
        ...cleaned,
      };
      await api.post(`/training/benchmark`, body);
      getBenchmark();
      toast.addToast({ type: 'success', title: 'Pr adicionado!' });
    } catch (err) {
      toast.addToast({
        type: 'error',
        title:
          err?.response?.data?.message ||
          'Ocorreu um erro ao adicionar o pr, tente novamente',
      });
    } finally {
      stop();
    }
  }, [thisEnterprise.id, values, getBenchmark, toast, start, stop]);

  const setField = (key, value) =>
    setValues((prev) => ({ ...prev, [key]: value }));

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
        <h2>{isSwimming ? 'Adicione seu tempo:' : 'Adicione seu pr:'}</h2>
        <main>
          {movements.map((movement) => {
            const currentValue = values?.[movement.key];

            if (movement.unit === 'time') {
              return (
                <label key={movement.key} htmlFor={movement.key}>
                  {movement.label}
                  <NumberFormat
                    customInput={InputDefault}
                    name={movement.key}
                    format="##:##.##"
                    mask="_"
                    allowEmptyFormatting
                    margin={false}
                    maxWidth="180px"
                    placeholder="mm:ss.cc"
                    value={centisecondsToInputDigits(currentValue)}
                    onValueChange={(v) => {
                      setField(movement.key, parseTimeInput(v.formattedValue));
                    }}
                  />
                </label>
              );
            }

            return (
              <label key={movement.key} htmlFor={movement.key}>
                {movement.label}
                <NumberFormat
                  isNumericString
                  customInput={InputDefault}
                  decimalScale={0}
                  name={movement.key}
                  margin={false}
                  maxWidth="180px"
                  suffix=" Lbs"
                  placeholder={movement.label}
                  thousandSeparator="."
                  type="text"
                  value={currentValue || ''}
                  onValueChange={(v) =>
                    setField(
                      movement.key,
                      v.floatValue != null ? Math.round(v.floatValue) : 0,
                    )
                  }
                />
              </label>
            );
          })}
        </main>
        <Button
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
          onClick={handleBenchmark}
        >
          Salvar
        </Button>
      </div>
    </Container>
  );
};

export default Benchmark;
