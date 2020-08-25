import React, { useCallback, useRef, ChangeEvent, useState } from 'react';

import {
  FiMail,
  FiLock,
  FiUser,
  FiCamera,
  FiArrowLeft,
  FiPower,
  FiPhone,
} from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory, Link } from 'react-router-dom';
import { Switch } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors, { removeMask } from '../../utils';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import InputDefault from '../../components/InputDefault';

interface ProfileFormData {
  name: string;
  celphone: string | undefined;
  email: string;
  isPrivate: boolean;
  password: any;
  password_confirmation: any;
  old_password: any;
}

const Profile: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { user, updateUser, signOut } = useAuth();

  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [data, setData] = useState<ProfileFormData>({
    name: user.name,
    email: user.email,
    celphone: removeMask(user.celphone),
    isPrivate: !!user.isPrivate,
    password: '',
    password_confirmation: '',
    old_password: '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          celphone: Yup.string(),
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),

          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          celphone,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          isPrivate,
          celphone,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push(routes.enterprise);

        addToast({
          type: 'success',
          title: 'Perfil Atualizado!',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualizar o perfil, tente novamente',
        });
      }
    },
    [addToast, history, updateUser, isPrivate, data],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const formData = new FormData();
        formData.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', formData).then((response) => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar Atualizado!',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to={routes.enterprise}>
            <FiArrowLeft />
          </Link>
          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </div>
      </header>
      <Content>
        <form onSubmit={handleSubmit}>
          <AvatarInput>
            <img
              src={
                user.avatar_url ||
                `https://api.adorable.io/avatars/285/${user.id}.png`
              }
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" onChange={handleAvatarChange} id="avatar" />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>
          <InputDefault
            error={errors.name}
            value={data.name}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            icon={FiUser}
            name="name"
            type="text"
            placeholder="Nome"
          />
          {/* <InputDefault
            icon={FiPhone}
            name="celphone"
            type="text"
            placeholder="Telefone"

          /> */}
          <NumberFormat
            customInput={InputDefault}
            error={errors.celphone}
            icon={FiPhone}
            type="text"
            format="(##) #####-####"
            name="celphone"
            value={data.celphone}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            // allowLeadingZeros
            // allowEmptyFormatting
            mask="_"
            placeholder="Telefone"
          />
          <InputDefault
            error={errors.email}
            value={data.email}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            icon={FiMail}
            name="email"
            type="email"
            placeholder="E-mail"
          />
          <div>
            Perfil Anônimo:{' '}
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(!isPrivate)}
              name="isPrivate"
            />
          </div>
          <InputDefault
            value={data.old_password}
            error={errors.old_password}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
            containerStyle={{ marginTop: 24 }}
          />
          <InputDefault
            value={data.password}
            error={errors.password}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova senha"
          />
          <InputDefault
            value={data.password_confirmation}
            error={errors.password_confirmation}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </form>
      </Content>
    </Container>
  );
};

export default Profile;
