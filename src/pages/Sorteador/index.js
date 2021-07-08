import React, { useState, useEffect } from 'react';

import { Container, Content } from './styles';

import { useToast } from '../../hooks/toast';

import EnterpriseHeader from '../../components/EnterpriseHeader';

import InputDefault from '../../components/InputDefault';
import Button from '../../components/Button';
import NoSleep from 'nosleep.js';
const noSleep = new NoSleep();
const Sorteador = () => {
  const toast = useToast();
  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');

  const [primaryColor, setPrimaryColor] = useState('#28262e');

  const [secondaryColor, setSecondaryColor] = useState('#ff9000');
  const [values, setValues] = useState('');
  const [treinos, setTreinos] = useState([]);
  const [concluidos, setConcluidos] = useState([]);
  const [baralho, setBaralho] = useState('');

  async function enableNoSleep() {
    await noSleep.enable();
  }

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
    enableNoSleep();
  }, []);

  const adicionarTreino = () => {
    if (!values) {
      return toast.addToast({
        title: 'Escreva um treino para adicionar como opção',
      });
    }
    const newTreinos = [...treinos];
    newTreinos.push(values);
    setTreinos(newTreinos);
    return setValues('');
  };

  function embaralhar(cartasParaEmbaralhar) {
    for (
      var j, x, i = cartasParaEmbaralhar.length;
      i;
      j = Math.floor(Math.random() * i),
        x = cartasParaEmbaralhar[--i],
        cartasParaEmbaralhar[i] = cartasParaEmbaralhar[j],
        cartasParaEmbaralhar[j] = x
    );
    return cartasParaEmbaralhar;
  }

  function comprar(baralhoAtual, qtd) {
    return baralhoAtual.slice(0, qtd);
  }

  function devolver(baralhoAtual, cartaParaDevolver) {
    return baralhoAtual.push(cartaParaDevolver);
  }

  const sortear = () => {
    if (treinos.length === 0) {
      return toast.addToast({
        title: 'Adicione opções de treino',
      });
    }
    const newTreinos = [...treinos];
    const embaralhado = embaralhar(newTreinos);

    const card = comprar(embaralhado, 1);

    setBaralho(card[0]);
    const newConcluidos = [...concluidos];
    newConcluidos.push(card[0]);
    setConcluidos(newConcluidos);
  };

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
      <Content>
        <div className="addTreino">
          <label htmlFor="">
            Opção de treino
            <InputDefault
              name="date"
              maxWidth="180px"
              margin={false}
              value={values}
              placeholder="Treino"
              onChange={(e) => {
                setValues(e.target.value);
              }}
            />
          </label>
          <Button
            style={{ width: '100%', height: '54px', marginLeft: '8px' }}
            onClick={adicionarTreino}
          >
            Adicionar
          </Button>
        </div>
        <div className="sorteados">
          <h2>Opções Adicionadas:</h2>

          {treinos.length === 0 ? (
            <p>Você não adicionou opções de treino</p>
          ) : (
            treinos.map((treino, index) => {
              return <span>{treino}</span>;
            })
          )}
        </div>

        <Button onClick={sortear}>Sortear</Button>
        <div className="daVez">{baralho}</div>
        <div className="sorteados">
          <h4>total de rounds : {concluidos.length}</h4>
          <h2>Treinos Concluídos:</h2>
          {concluidos.map((treino, index) => {
            return <h3>{treino}</h3>;
          })}
        </div>
      </Content>
    </Container>
  );
};

export default Sorteador;
