import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import numeral from 'numeral';
import Routes from './routes';
import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import 'numeral/locales/pt-br';

const App: React.FC = () => {
  numeral.locale('pt-br');
  return (
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>
      <GlobalStyle />
    </Router>
  );
};

export default App;
