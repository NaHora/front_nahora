import React, { useCallback, useRef, useState } from 'react';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';

import logoImg from '../../assets/nahora.png';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { routes } from '../../routes';

interface SignInForm {
  email: string;
  password: string;
  type?: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  celphone?: string;
  photoUrl?: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const auth = useAuth();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: SignInForm) => {
      formRef.current?.setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await auth.signIn({
          email: data.email,
          password: data.password,
        });

        history.push(routes.enterprise);

        toast.addToast({
          type: 'success',
          title: 'Bem Vindo,',
          description: 'Autenticado com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          toast.addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao fazer login, cheque as credenciais',
          });
        }
        toast.addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
        });
      } finally {
        setLoading(false);
      }
    },
    [auth, toast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <img src={logoImg} alt="" />
            <h1>Faça seu login</h1>

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
              Entrar
            </Button>
          </Form>

          <Link style={{ color: '#fff' }} to={routes.forgotPassword}>
            Esqueci minha senha
          </Link>
          <Link to={routes.signup}>
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
