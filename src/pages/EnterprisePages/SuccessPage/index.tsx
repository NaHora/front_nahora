import React, { useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import api from '../../../services/api';

// import { Container } from './styles';

const SuccessPage: React.FC = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const { addToast } = useToast();

  const checkRedirect = useCallback(async () => {
    if (queryParams.get('session_id') === localStorage.getItem('session_id')) {
      try {
        const response = await api.get('enterprises/hasEnterprise');
        if (response.data === true) {
          history.push(routes.adminDashboard);
        } else if (response.data === false) {
          history.push(
            `${routes.signupEnterprise}?session_id=${queryParams.get(
              'session_id',
            )}`,
          );
        }

        addToast({
          type: 'success',
          title: 'Assinatura realizada com sucesso!',
        });
      } catch (err) {
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
  }, [addToast, history, queryParams]);

  useEffect(() => {
    checkRedirect();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Loader type="Watch" color="#ff9000" height={100} width={100} />
    </div>
  );
};

export default SuccessPage;
