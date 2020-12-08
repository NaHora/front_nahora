import React, { useCallback, useRef, useState } from 'react';

import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowLeft,
  FiPhone,
  FiFacebook,
} from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { FaGoogle } from 'react-icons/fa';

import FacebookLogin from 'react-facebook-login';
import logoImg from '../../assets/nahora.png';
import {
  Container,
  Content,
  Background,
  AnimationContainer,
  GoogleLoginStyled,
  SelectDefault,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';

import { useAuth } from '../../hooks/auth';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  celphone?: string;
  photoUrl?: string;
  gender?: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const { signInSocial } = useAuth();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    gender: 'm',
  } as SignUpFormData);

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

        await signInSocial({
          email: data.email,
          password: data.password,
          name: data.name,
          celphone: data.celphone,
          photoUrl: values?.photoUrl,
          gender: values?.gender,
        });

        addToast({
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
          return addToast({
            type: 'error',
            title:
              err.response.data.message ||
              'Ocorreu um erro ao fazer o cadastro, tente novamente',
          });
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
    [addToast, signInSocial, values],
  );

  const loginFacebook = useCallback((facebook: any) => {
    setValues({
      email: facebook?.email,
      password: '',
      name: facebook?.name,
      photoUrl: facebook?.picture?.data?.url,
    });
  }, []);

  const responseGoogle = useCallback((response: any) => {
    setValues({
      email: response?.profileObj?.email,
      password: '',
      name: response?.profileObj?.name,
      photoUrl: response?.profileObj?.imageUrl,
    });
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <Form initialData={values} ref={formRef} onSubmit={handleAccount}>
            <img src={logoImg} alt="" />
            <h1>Complete seu cadastro</h1>
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
            <SelectDefault
              value={values.gender}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              name="gender"
              placeholder="Gênero"
            >
              <option value="m">Masculino</option>
              <option value="f">Feminino</option>
            </SelectDefault>
            <Button loading={loading} type="submit">
              Cadastrar
            </Button>
            <hr style={{ margin: '20px' }} />
            <GoogleLoginStyled
              clientId="980793766976-bc2pfer912godkfah31tp9jjmr53pn80.apps.googleusercontent.com"
              buttonText={
                (
                  <>
                    <FaGoogle />
                    <span>Cadastrar com gmail</span>
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
                    Cadastrar com facebook
                  </span>
                ) as any
              }
              // onClick={loginFacebook}
              callback={loginFacebook}
            />
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
