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
import { Switch } from '@material-ui/core';

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
  const [values, setValues] = useState({});
  const [libras, setLibras] = useState(false);

  const getBenchmark = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/benchmark/enterprise/${thisEnterprise.id}`,
      );
      setValues(response.data);
    } catch {}
  }, [thisEnterprise]);

  useEffect(() => {
    getBenchmark();
  }, []);

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  const handleBenchmark = useCallback(async () => {
    start();
    try {
      delete values.id;
      delete values.updated_at;
      delete values.created_at;
      delete values.user_id;

      const body = {
        enterprise_id: thisEnterprise.id,
        ...values,
      };
      await api.post(`/training/benchmark`, body);
      getBenchmark();
      toast.addToast({ type: 'success', title: 'Pr adicionado!' });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao adicionar o pr, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao adicionar o pr, tente novamente',
        });
      }
    } finally {
      stop();
    }
  }, [thisEnterprise, values]);

  // useEffect(()=>{

  // },[libras])

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
        {/* <Switch
          onChange={(e) => setLibras(e.target.checked)}
          name="libras"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          checked={!!libras}
        />
        <h3>Libras</h3> */}
        <main>
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
              suffix=" Lbs"
              placeholder="Back Squat"
              thousandSeparator="."
              type="text"
              value={values.backsquat}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  backsquat: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Bench Press
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="benchpress"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Bench Press"
              thousandSeparator="."
              type="text"
              value={values.benchpress}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  benchpress: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Deadlift
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="deadlift"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Deadlift"
              thousandSeparator="."
              type="text"
              value={values.deadlift}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  deadlift: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Front Squat
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="frontsquat"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Front Squat"
              thousandSeparator="."
              type="text"
              value={values.frontsquat}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  frontsquat: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Overhead Squat
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="overheadsquat"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Overhead Squat"
              thousandSeparator="."
              type="text"
              value={values.overheadsquat}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  overheadsquat: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Push Press
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="pushpress"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Push Press"
              thousandSeparator="."
              type="text"
              value={values.pushpress}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  pushpress: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Shouder Press
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="shoulderpress"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Shouder Press"
              thousandSeparator="."
              type="text"
              value={values.shoulderpress}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  shoulderpress: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Thruster
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="thruster"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Thruster"
              thousandSeparator="."
              type="text"
              value={values.thruster}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  thruster: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Clean
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="clean"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Clean"
              thousandSeparator="."
              type="text"
              value={values.clean}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  clean: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Clean & Jerk
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="cleanjerk"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Clean & Jerk"
              thousandSeparator="."
              type="text"
              value={values.cleanjerk}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  cleanjerk: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Cluster
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="cluster"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Cluster"
              thousandSeparator="."
              type="text"
              value={values.cluster}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  cluster: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Hang Power Clean
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="hangpowerclean"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Hang Power Clean"
              thousandSeparator="."
              type="text"
              value={values.hangpowerclean}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  hangpowerclean: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Hang Power Snatch
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="hangpowersnatch"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Hang Power Snatch"
              thousandSeparator="."
              type="text"
              value={values.hangpowersnatch}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  hangpowersnatch: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Hang Squat Snatch
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="handsquatsnatch"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Hang Squat Snatch"
              thousandSeparator="."
              type="text"
              value={values.handsquatsnatch}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  handsquatsnatch: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Hang Squat Clean
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="hangsquatclean"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Hang Squat Clean"
              thousandSeparator="."
              type="text"
              value={values.hangsquatclean}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  hangsquatclean: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Power Clean
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="powerclean"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Power Clean"
              thousandSeparator="."
              type="text"
              value={values.powerclean}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  powerclean: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Power Snatch
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="powersnatch"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Power Snatch"
              thousandSeparator="."
              type="text"
              value={values.powersnatch}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  powersnatch: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Push Jerk
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="pushjerk"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Push Jerk"
              thousandSeparator="."
              type="text"
              value={values.pushjerk}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  pushjerk: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Snatch
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="snatch"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Snatch"
              thousandSeparator="."
              type="text"
              value={values.snatch}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  snatch: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Snatch Balance
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="snatchbalance"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Snatch Balance"
              thousandSeparator="."
              type="text"
              value={values.snatchbalance}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  snatchbalance: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Split Jerk
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="splitjerk"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Split Jerk"
              thousandSeparator="."
              type="text"
              value={values.splitjerk}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  splitjerk: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Squat Clean
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="squatclean"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Squat Clean"
              thousandSeparator="."
              type="text"
              value={values.squatclean}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  squatclean: e.floatValue,
                });
              }}
            />
          </label>
          <label htmlFor="">
            Squat Snatch
            <NumberFormat
              isNumericString
              customInput={InputDefault}
              decimalScale={2}
              decimalSeparator=","
              name="squatsnatch"
              margin={false}
              maxWidth="180px"
              suffix=" Lbs"
              placeholder="Squat Snatch"
              thousandSeparator="."
              type="text"
              value={values.squatsnatch}
              onValueChange={(e) => {
                setValues({
                  ...values,
                  squatsnatch: e.floatValue,
                });
              }}
            />
          </label>
        </main>
        <Button
          primaryColor={primaryColor || '#28262e'}
          secondaryColor={secondaryColor || '#ff9000'}
          onClick={handleBenchmark}
        >
          adicionar
        </Button>
      </div>
    </Container>
  );
};

export default Benchmark;
