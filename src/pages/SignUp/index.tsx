import React, { useCallback, useRef, useState } from 'react';

import { FiMail, FiLock, FiUser, FiArrowLeft, FiPhone } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import logoImg from '../../assets/nahora.png';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  celphone: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({});
      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
          password: Yup.string().min(
            6,
            'A senha deve conter no mínimo 6 dígitos',
          ),
          celphone: Yup.string().min(
            10,
            'Confira se digitou o telefone com DDD',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('users', data);

        history.push(routes.signin);

        addToast({
          type: 'success',
          title: 'Cadastro Realizado!',
          description: 'Você já pode fazer seu login no NaHora!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <img src={logoImg} alt="" />
            <h1>Faça seu cadastro</h1>
            <Input icon={FiUser} name="name" type="text" placeholder="Nome" />
            <NumberFormat
              customInput={Input}
              icon={FiPhone}
              type="text"
              format="(##) #####-####"
              name="celphone"
              // allowLeadingZeros
              // allowEmptyFormatting
              mask="_"
              placeholder="Telefone"
            />
            {/* <Input
              name="celphone"
              icon={FiPhone}
              type="text"
              placeholder="Telefone"
            /> */}
            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="E-mail"
            />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />
            <Button loading={loading} type="submit">
              Cadastrar
            </Button>
          </Form>
          <Link to={routes.signin}>
            <FiArrowLeft />
            voltar para login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
