import React, { useCallback, useRef, useState } from 'react';

import { FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import logoImg from '../../assets/nahora.png';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils';
import { useToast } from '../../hooks/toast';
import { routes } from '../../routes';
import api from '../../services/api';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const [verified, setVerified] = useState(false);

  const toast = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordForm) => {
      formRef.current?.setErrors({});
      setLoading(true);
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', { email: data.email });
        // history.push(routes.dashboard);

        toast.addToast({
          type: 'success',
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um email para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));

          return;
        }
        toast.addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <img src={logoImg} alt="NaHora" />
            <h1>Recuperar senha</h1>
            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="E-mail"
            />
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                onChange={() => setVerified(true)}
              />
            </div>
            <Button loading={loading} disabled={!verified} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to={routes.signin}>
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
