import React, { useCallback, useRef, useState } from 'react';
import { FiArrowRight, FiLock, FiMail, FiShield, FiTrendingUp, FiZap } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/nahora.png';
import {
  Container,
  Content,
  Background,
  AnimationContainer,
  Brand,
  FeatureList,
  FormCard,
  FooterLinks,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { routes } from '../../routes';

interface SignInForm {
  email: string;
  password: string;
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
            .email('Email invalido')
            .required('Email obrigatorio'),
          password: Yup.string().required('Senha obrigatoria'),
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
          title: 'Bem-vindo',
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
          return;
        }

        toast.addToast({
          type: 'error',
          title: 'Erro na autenticacao',
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
      <Background>
        <Brand>
          <img src={logoImg} alt="NaHora" />
          <div>
            <span>NaHora Platform</span>
            <h1>Operacao bonita, agenda viva, experiencia premium.</h1>
            <p>
              O admin ganhou uma interface com mais clareza visual, leitura
              rápida de performance e menos atrito para operar agenda e clientes.
            </p>
          </div>
        </Brand>

        <FeatureList>
          <li>
            <FiTrendingUp />
            <div>
              <strong>Visao executiva</strong>
              <span>Resumo de ocupacao, receita e ritmo da operacao.</span>
            </div>
          </li>
          <li>
            <FiZap />
            <div>
              <strong>Fluxo mais rapido</strong>
              <span>Menos cliques para navegar entre empresas, agenda e alertas.</span>
            </div>
          </li>
          <li>
            <FiShield />
            <div>
              <strong>Base preservada</strong>
              <span>Mesmas APIs e regras do projeto atual, com nova camada visual.</span>
            </div>
          </li>
        </FeatureList>
      </Background>

      <Content>
        <AnimationContainer>
          <FormCard>
            <span>Painel administrativo</span>
            <h2>Faça seu login</h2>
            <p>
              Entre para gerenciar empresas, acompanhar agendamentos e operar o
              dia com mais contexto.
            </p>

            <Form ref={formRef} onSubmit={handleSubmit}>
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
                Entrar no painel
                <FiArrowRight />
              </Button>
            </Form>

            <FooterLinks>
              <Link to={routes.forgotPassword}>Esqueci minha senha</Link>
              <Link to={routes.signup}>Criar conta</Link>
            </FooterLinks>
          </FormCard>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
