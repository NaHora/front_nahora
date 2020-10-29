import React from 'react';
import { Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Route from './Route';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import Enterprises from '../pages/Enterprises';
import Schedule from '../pages/Schedule';
import SignUpEnterprise from '../pages/EnterprisePages/SignUp';
import EnterpriseProfile from '../pages/EnterprisePages/EnterpriseProfile';
import Plans from '../pages/EnterprisePages/Plans';
import EnterpriseSchedule from '../pages/EnterprisePages/EnterpriseSchedule';
import SuccessPage from '../pages/EnterprisePages/SuccessPage';
import Financial from '../pages/EnterprisePages/Financial';
import PolicyPrivate from '../pages/PolicyPrivate';
import TermsUse from '../pages/TermsUse';
import ClientDetail from '../pages/EnterprisePages/ClientDetail';
import Training from '../pages/Training';

export const routes = {
  dashboard: '/dashboard',
  profile: '/profile',
  training: '/training',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  enterprise: '/enterprise',
  clientDetailNoParams: '/detalhes-do-usuario',
  clientDetail: '/detalhes-do-usuario/:client_id',
  schedule: '/schedule',
  private: '/politica-de-privacidade',
  terms: '/termos-de-uso',
  signupEnterprise: '/signupEnterprise',
  enterpriseProfile: '/perfil-empresa',
  enterpriseSchedule: '/gestão-de-horários',
  financial: '/gestão-financeira',
  plan: '/gestão-de-planos',
  success: '/success',
  signin: '/',
};

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={routes.dashboard} component={Dashboard} isPrivate />
      <Route path={routes.enterprise} component={Enterprises} isPrivate />
      <Route path={routes.clientDetail} component={ClientDetail} isPrivate />
      <Route path={routes.schedule} component={Schedule} isPrivate />
      <Route path={routes.training} component={Training} isPrivate />
      <Route path={routes.profile} component={Profile} isPrivate />
      <Route path={routes.plan} component={Plans} isPrivate />
      <Route path={routes.success} component={SuccessPage} isPrivate />
      <Route path={routes.financial} component={Financial} isPrivate />
      <Route
        path={routes.enterpriseSchedule}
        component={EnterpriseSchedule}
        isPrivate
      />
      <Route
        path={routes.signupEnterprise}
        component={SignUpEnterprise}
        isPrivate
      />
      <Route
        path={routes.enterpriseProfile}
        component={EnterpriseProfile}
        isPrivate
      />
      <Route path={routes.private} component={PolicyPrivate} />
      <Route path={routes.terms} component={TermsUse} />
      <Route path={routes.signup} component={SignUp} />
      <Route path={routes.forgotPassword} component={ForgotPassword} />
      <Route path={routes.resetPassword} component={ResetPassword} />

      <Route path={routes.signin} component={SignIn} />
    </Switch>
  );
};

export default Routes;
