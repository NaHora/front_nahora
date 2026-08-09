import React, { useCallback, useState } from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';

import { useHistory, Link, useLocation } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import { Tooltip } from '@material-ui/core';
import { MdInfoOutline } from 'react-icons/md';
import { Cel, Header, Body, Form } from '../EnterpriseProfile/styles';
import { Container } from './styles';

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
  open_hour?: string;
  close_hour?: string;
  primary_color: string;
  secondary_color: string;
  isPrivate: boolean;
}

interface ErrorFormData {
  name: string;
  area: string;
  address: string;
  open_hour?: string;
  close_hour?: string;
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
    primary_color: '#28262e',
    secondary_color: '#ff9000',
    isPrivate: true,
  });
  const queryParams = new URLSearchParams(useLocation().search);

  const handleSubmit = useCallback(async () => {
    if (
      queryParams.get('session_id') === localStorage.getItem('session_id') ||
      queryParams.get('session_id') === 'redirected'
    ) {
      setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          area: Yup.string().required('Área obrigatório'),
          address: Yup.string().required('Endereço obrigatório'),
          primary_color: Yup.string().required('Cor Primária obrigatório'),
          secondary_color: Yup.string().required('Cor Secundária obrigatório'),
          isPrivate: Yup.boolean(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('enterprises', data);

        history.push(routes.adminDashboard);

        addToast({
          type: 'success',
          title: 'Cadastro Realizado!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description:
            err.response.data.message ||
            'Ocorreu um erro ao fazer o cadastro, tente novamente',
        });
      }
    } else {
      addToast({
        type: 'error',
        title: 'Sessão de pagamento não encontrada',
      });

      history.push(routes.enterprise);
    }
  }, [addToast, history, data, queryParams]);

  return (
    <Container>
      <header>
        <div>
          <Link to={routes.enterprise}>
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <div>
        <Form>
          <div>
            <div>
              <label htmlFor="">
                Nome da empresa:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data?.name}
                  error={error?.name}
                  type="text"
                  name="name"
                />
              </label>

              <label htmlFor="">
                Área de atuação:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.area}
                  error={error?.area}
                  type="text"
                  name="area"
                />
              </label>

              <label htmlFor="">
                Endereço:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.address}
                  error={error?.address}
                  type="text"
                  name="address"
                />
              </label>
              <label style={{ width: '150px' }} htmlFor="">
                Cor primária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.primary_color}
                  error={error?.primary_color}
                  type="color"
                  name="primary_color"
                />
              </label>
              <label style={{ width: '150px' }} htmlFor="">
                Cor secundária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.secondary_color}
                  error={error?.secondary_color}
                  type="color"
                  name="secondary_color"
                />
              </label>
              <Tooltip title="Perfil fechado você controla quem poderá se agendar, já o perfil aberto qualquer usuário estará apto a se agendar na plataforma">
                <label htmlFor="">
                  <MdInfoOutline style={{ marginRight: '8px' }} />
                  Perfil Fechado :
                  <Switch
                    onChange={(e) =>
                      setData({
                        ...data,
                        [e.target.name]: e.target.checked,
                      })
                    }
                    name="isPrivate"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    checked={!!data.isPrivate}
                  />
                </label>
              </Tooltip>
              <Button onClick={handleSubmit}>Cadastrar</Button>
            </div>
            <div>
              <span>
                Prévia da tela que o usuário verá com seus dados preenchidos
              </span>
              <br />
              <Cel>
                <Header
                  primaryColor={data?.primary_color || '#28262e'}
                  secondaryColor={data?.secondary_color || '#ff9000'}
                >
                  <FiArrowLeft />

                  <img
                    src="https://api.adorable.io/avatars/285/.png"
                    alt="NaHora"
                  />
                </Header>
                <Body
                  primaryColor={data?.primary_color || '#28262e'}
                  secondaryColor={data?.secondary_color || '#ff9000'}
                >
                  <Button
                    primaryColor={data?.primary_color || '#28262e'}
                    secondaryColor={data?.secondary_color || '#ff9000'}
                  >
                    Modelo de Botão
                  </Button>
                </Body>
              </Cel>
            </div>
          </div>
        </Form>
      </div>
    </Container>
    // <Container>

    //   <Content>
    //     <AnimationContainer>
    //       <img src={logoImg} alt="" />
    //       <form onSubmit={handleSubmit}>
    //         <h1>Cadastro da empresa</h1>
    //         <InputDefault
    //           icon={FiUser}
    //           name="name"
    //           type="text"
    //           value={data?.name}
    //           error={error.name}
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           placeholder="Nome da empresa"
    //         />

    //         <InputDefault
    //           icon={FiMail}
    //           error={error.area}
    //           value={data.area}
    //           name="area"
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           type="text"
    //           placeholder="Área de atuação"
    //         />
    //         <InputDefault
    //           icon={FiLock}
    //           error={error.address}
    //           value={data.address}
    //           name="address"
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           type="text"
    //           placeholder="Endereço"
    //         />

    //         <InputDefault
    //           error={error.open_hour}
    //           value={data.open_hour}
    //           icon={FiLock}
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           name="open_hour"
    //           type="text"
    //           placeholder="Hora de abertura"
    //         />
    //         <InputDefault
    //           icon={FiLock}
    //           error={error.close_hour}
    //           value={data.close_hour}
    //           name="close_hour"
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           type="text"
    //           placeholder="Hora de fechamento"
    //         />
    //         <InputDefault
    //           icon={FiLock}
    //           error={error.primary_color}
    //           value={data.primary_color}
    //           name="primary_color"
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           type="color"
    //           placeholder="Cor primária"
    //         />
    //         <InputDefault
    //           error={error.secondary_color}
    //           value={data.secondary_color}
    //           icon={FiLock}
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           name="secondary_color"
    //           type="color"
    //           placeholder="Cor secundária"
    //         />
    //         <label htmlFor="isPrivate">Usuários necessitam planos ?</label>
    //         <Switch
    //           checked={data.isPrivate}
    //           name="isPrivate"
    //           onChange={(e) =>
    //             setData({ ...data, [e.target.name]: e.target.value })
    //           }
    //           color="primary"
    //         />
    //         <Button type="submit">Cadastrar</Button>
    //       </form>
    //     </AnimationContainer>
    //   </Content>
    // </Container>
  );
};

export default SignUp;
