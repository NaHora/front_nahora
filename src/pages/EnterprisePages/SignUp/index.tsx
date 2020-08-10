import React, { useCallback, useState } from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';

import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import {
  Container,
  Cel,
  Header,
  Body,
  Form,
} from '../EnterpriseProfile/styles';

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

  const handleSubmit = useCallback(async () => {
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
        isPrivate: Yup.boolean().required('Privado obrigatório'),
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
  }, [addToast, history, data]);

  return (
    <Container>
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
                  type="text"
                  name="name"
                />
              </label>
              <label htmlFor="">
                Horário de abertura:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.open_hour}
                  type="text"
                  name="open_hour"
                />
                Horário de fechamento:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.close_hour}
                  type="text"
                  name="close_hour"
                />
              </label>
              <label htmlFor="">
                Área de atuação:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.area}
                  type="text"
                  name="area"
                />
              </label>
              {/* <label htmlFor="">
              cep:{' '}
           <InputDefault
                onChange={(e) =>
                  setdata({
                    ...data,
                    [e.target.name]: e.target.value,
                  })
                }
                value={data.cep}
                type="text"
                name="cep"
              />  </label> */}
              <label htmlFor="">
                Endereço:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.address}
                  type="text"
                  name="address"
                />
              </label>
              <label htmlFor="">
                Cor primária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.primary_color}
                  type="color"
                  name="primary_color"
                />
              </label>
              <label htmlFor="">
                Cor secundária:{' '}
                <InputDefault
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  value={data.secondary_color}
                  type="color"
                  name="secondary_color"
                />
              </label>
              <label htmlFor="">
                Usuário necessitam de plano:{' '}
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
                    alt="GoBarber"
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
