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
import Avatar from '../../components/Avatar';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'black',
  },
  divButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Ranking = () => {
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
    category: '3',
  });

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [training, setTraining] = useState({});
  const [ranking, setRanking] = useState([]);
  const [rankType, setRankType] = useState('wod');
  const [benchmarkType, setBenchmarType] = useState('backsquat');

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

  const getRanking = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/training/${training.id}/enterprise/${thisEnterprise.id}`,
      );
      setRanking(response.data);
    } catch {}
  }, [training, thisEnterprise]);

  const getPrRanking = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/rank/${benchmarkType}/benchmark/enterprise/${thisEnterprise.id}`,
      );
      setRanking(response.data);
    } catch {}
  }, [thisEnterprise, benchmarkType]);

  useEffect(() => {
    getTraining();
  }, [date]);

  useEffect(() => {
    if (rankType === 'wod') {
      if (training) {
        getRanking();
      }
    } else if (rankType === 'pr') {
      getPrRanking();
    }
  }, [training, rankType, benchmarkType]);

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
      getRanking();
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
        <div>
          <label htmlFor="">
            Rankear por:
            <SelectDefault
              name="rankType"
              value={rankType}
              placeholder="Tipo de Rank"
              onChange={(e) => {
                setRankType(e.target.value);
              }}
            >
              <option value="wod">Treino do dia</option>
              <option value="pr">Recordes Pessoais</option>
            </SelectDefault>
          </label>
          {rankType === 'pr' && (
            <label htmlFor="">
              Movimento:
              <SelectDefault
                name="benchmarkType"
                value={benchmarkType}
                placeholder="Movimento"
                onChange={(e) => {
                  setBenchmarType(e.target.value);
                }}
              >
                <option value="backsquat">Back Squat</option>
                <option value="benchpress">Bench Press</option>
                <option value="deadlift">Deadlift</option>
                <option value="frontsquat">Front Squat</option>
                <option value="overheadsquat">Overhead Squat</option>
                <option value="pushpress">Push Press</option>
                <option value="shoulderpress">Shouder Press</option>
                <option value="thruster">Thruster</option>
                <option value="clean">Clean</option>
                <option value="cleanjerk">Clean & Jerk</option>
                <option value="cluster">Cluster</option>
                <option value="hangpowerclean">Hang Power Clean</option>
                <option value="hangpowersnatch">Hang Power Snatch</option>
                <option value="handsquatsnatch">Hang Squat Snatch</option>
                <option value="hangsquatclean">Hang Squat Clean</option>
                <option value="powerclean">Power Clean</option>
                <option value="powersnatch">Power Snatch</option>
                <option value="pushjerk">Push Jerk</option>
                <option value="snatch">Snatch</option>
                <option value="snatchbalance">Snatch Balance</option>
                <option value="splitjerk">Split Jerk</option>
                <option value="squatclean">Squat Clean</option>
                <option value="squatsnatch">Squat Snatch</option>
              </SelectDefault>
            </label>
          )}
        </div>
        {rankType === 'pr' && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Score</th>
                <th>Gênero</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length > 0 ? (
                ranking.map((rank, index) => (
                  <tr key={rank.id}>
                    <td>{index + 1}</td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      {
                        <Avatar
                          isPrivate={rank.user.isPrivate}
                          name={rank.user.name}
                          avatarUrl={rank.user.avatar_url}
                        />
                      }
                      {rank.user.isPrivate ? 'Anônimo' : rank.user.name}
                    </td>
                    <td>{rank[benchmarkType]}</td>
                    <td>
                      {rank.user.gender === 'm'
                        ? 'Masculino'
                        : rank.user.gender === 'f'
                        ? 'Feminino'
                        : 'Indefinido'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum recorde pessoal registrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {rankType === 'wod' && (
          <>
            {training && <h2>Adicione seu treino:</h2>}
            <header>
              <label htmlFor="">
                Data do treino
                <InputDefault
                  name="date"
                  maxWidth="180px"
                  margin={false}
                  type="date"
                  value={date}
                  placeholder="Data"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </label>
              {training && (
                <>
                  <label htmlFor="">
                    Score
                    {training.type === 'time' ? (
                      <NumberFormat
                        customInput={InputDefault}
                        type="text"
                        format="##:##"
                        name="score"
                        margin={false}
                        allowLeadingZeros
                        allowEmptyFormatting
                        mask="_"
                        maxWidth="160px"
                        placeholder="Score"
                        value={values.score}
                        onValueChange={(e) => {
                          setValues({
                            ...values,
                            score: e.formattedValue,
                          });
                        }}
                      />
                    ) : (
                      <InputDefault
                        name="score"
                        maxWidth="180px"
                        margin={false}
                        placeholder="Score"
                        type="number"
                        value={values.score}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    )}
                  </label>
                  <label htmlFor="">
                    Categoria
                    <SelectDefault
                      name="category"
                      value={values.category}
                      placeholder="Categoria"
                      onChange={(e) => {
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    >
                      <option value="3">Rx</option>
                      <option value="2">Intermediate</option>
                      <option value="1">Scale</option>
                    </SelectDefault>
                  </label>
                  <Button
                    primaryColor={primaryColor || '#28262e'}
                    secondaryColor={secondaryColor || '#ff9000'}
                    onClick={handleScore}
                  >
                    adicionar
                  </Button>
                </>
              )}
            </header>

            {!training ? (
              <span>Nenhum treino cadastrado neste dia</span>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Score</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.length > 0 ? (
                    ranking.map((rank, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td style={{ display: 'flex', alignItems: 'center' }}>
                          {
                            <Avatar
                              isPrivate={rank.user.isPrivate}
                              name={rank.user.name}
                              avatarUrl={rank.user.avatar_url}
                            />
                          }
                          {rank.user.isPrivate ? 'Anônimo' : rank.user.name}
                        </td>
                        <td>{rank.score}</td>
                        <td>
                          {rank.type === '3'
                            ? 'Rx'
                            : rank.type === '2'
                            ? 'Int'
                            : 'Scl'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Nenhum treino registrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Ranking;
