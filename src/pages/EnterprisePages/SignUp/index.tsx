import React, { useCallback, useState } from 'react';

import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import logoImg from '../../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import InputDefault from '../../../components/InputDefault';
import Button from '../../../components/Button';
import getValidationErrors from '../../../utils';
import { routes } from '../../../routes';
import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';

interface SignUpFormData {
  name: string;
  area: string;
  address: string;
  open_hour: string;
  close_hour: string;
  primary_color: string;
  secondary_color: string;
  isPrivate: boolean;
}

interface ErrorFormData {
  name: string;
  area: string;
  address: string;
  open_hour: string;
  close_hour: string;
  primary_color: string;
  secondary_color: string;
  isPrivate: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const [error, setErrors] = useState<ErrorFormData | any>({});
  const [data, setData] = useState<SignUpFormData | any>({
    name: '',
    area: '',
    address: '',
    open_hour: '',
    close_hour: '',
    primary_color: '#28262e',
    secondary_color: '#ff9000',
    isPrivate: true,
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          area: Yup.string().required('Área obrigatório'),
          address: Yup.string().required('Endereço obrigatório'),
          open_hour: Yup.string().required('Endereço obrigatório'),
          close_hour: Yup.string().required('Endereço obrigatório'),
          primary_color: Yup.string().required('Endereço obrigatório'),
          secondary_color: Yup.string().required('Endereço obrigatório'),
          isPrivate: Yup.string().required('Privado obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('enterprises', data);

        history.push(routes.signin);

        addToast({
          type: 'success',
          title: 'Cadastro Realizado!',
          description: 'Você já pode fazer seu login no GoBarber!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente',
        });
      }
    },
    [addToast, history, data],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="" />
          <form onSubmit={handleSubmit}>
            <h1>Cadastro da empresa</h1>
            <InputDefault
              icon={FiUser}
              name="name"
              type="text"
              value={data?.name}
              error={error.name}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              placeholder="Nome da empresa"
            />

            <InputDefault
              icon={FiMail}
              error={error.area}
              value={data.area}
              name="area"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              type="text"
              placeholder="Área de atuação"
            />
            <InputDefault
              icon={FiLock}
              error={error.address}
              value={data.address}
              name="address"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              type="text"
              placeholder="Endereço"
            />

            <InputDefault
              error={error.open_hour}
              value={data.open_hour}
              icon={FiLock}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              name="open_hour"
              type="text"
              placeholder="Hora de abertura"
            />
            <InputDefault
              icon={FiLock}
              error={error.close_hour}
              value={data.close_hour}
              name="close_hour"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              type="text"
              placeholder="Hora de fechamento"
            />
            <InputDefault
              icon={FiLock}
              error={error.primary_color}
              value={data.primary_color}
              name="primary_color"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              type="color"
              placeholder="Cor primária"
            />
            <InputDefault
              error={error.secondary_color}
              value={data.secondary_color}
              icon={FiLock}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              name="secondary_color"
              type="color"
              placeholder="Cor secundária"
            />
            <label htmlFor="isPrivate">Usuários necessitam planos ?</label>
            <Switch
              checked={data.isPrivate}
              name="isPrivate"
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              color="primary"
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
