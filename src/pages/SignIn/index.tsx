import React, { useCallback, useRef, useState } from 'react';

import { FiLogIn, FiMail, FiLock, FiFacebook } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import FacebookLogin from 'react-facebook-login';
import logoImg from '../../assets/nahora.png';
import {
  Container,
  Content,
  Background,
  AnimationContainer,
  GoogleLoginStyled,
  ButtonStyled,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { routes } from '../../routes';
import api from '../../services/api';

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
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const auth = useAuth();

  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setByEmail] = useState(false);

  const handleAccount = useCallback(
    async (data: SignUpFormData) => {
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

        await auth.signInSocial({
          email: data.email,
          password: data.password,
          name: data.name,
          celphone: data.celphone,
        });

        history.push(routes.enterprise);

        toast.addToast({
          type: 'success',
          title: 'Bem Vindo,',
          description: 'Autenticado com sucesso',
        });
      } catch (err) {
        toast.addToast({
          type: 'error',
          title:
            'Já existe uma conta cadastrada com este email, tente entrar com email',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, history, auth],
  );

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

  const loginFacebook = useCallback(
    async (facebook: any) => {
      try {
        await handleAccount({
          email: facebook.email,
          password: facebook.id,
          name: facebook.name,
        });
      } catch (err) {}
    },
    [handleAccount],
  );

  const responseGoogle = useCallback(
    async (response: any) => {
      try {
        await handleAccount({
          email: response.profileObj.email,
          password: response.profileObj.googleId,
          name: response.profileObj.name,
        });
      } catch (err) {}
    },
    [handleAccount],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <img src={logoImg} alt="" />
            <h1>Faça seu login</h1>
            {email && (
              <>
                {' '}
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
              </>
            )}
          </Form>

          {!email && (
            <ButtonStyled onClick={() => setByEmail(!email)}>
              <MdEmail />
              <span>Entrar com email</span>
            </ButtonStyled>
          )}
          {!email && (
            <>
              <GoogleLoginStyled
                clientId="980793766976-bc2pfer912godkfah31tp9jjmr53pn80.apps.googleusercontent.com"
                buttonText={
                  (
                    <>
                      <FaGoogle />
                      <span>Entrar com google</span>
                    </>
                  ) as any
                }
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
              <FacebookLogin
                appId="330940161588292"
                // redirectUri="https://nahora.app.br"
                fields="first_name,name,email,picture"
                disableMobileRedirect
                textButton={
                  (
                    <span>
                      <FiFacebook />
                      Entrar com facebook
                    </span>
                  ) as any
                }
                // onClick={loginFacebook}
                callback={loginFacebook}
              />
            </>
          )}
          <Link style={{ color: '#fff' }} to={routes.forgotPassword}>
            Esqueci minha senha
          </Link>
          <Link to={routes.signup}>
            <FiLogIn />
            Criar conta
          </Link>
          {email && (
            <p
              style={{ marginTop: '20px', cursor: 'pointer' }}
              onClick={() => setByEmail(!email)}
            >
              voltar
            </p>
          )}
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
