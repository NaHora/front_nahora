import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import numeral from 'numeral';
import Routes from './routes';
import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import 'numeral/locales/pt-br';
import * as serviceWorker from './serviceWorker';
import { Snackbar, Button } from '@material-ui/core';

const App: React.FC = () => {
  numeral.locale('pt-br');
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  return (
    <Router>
      <Snackbar
        open={showReload}
        message="Nova versão disponível!"
        onClick={reloadPage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={reloadPage}>
            Atualizar
          </Button>
        }
      />
      <AppProvider>
        <Routes />
      </AppProvider>
      <GlobalStyle />
    </Router>
  );
};

export default App;
