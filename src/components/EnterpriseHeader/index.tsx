import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Header } from './styles';

import { useAuth } from '../../hooks/auth';
import { routes } from '../../routes';

import EnterpriseImg from '../../assets/empresa.png';
import MenuEnterprise from '../MenuEnterprise';

interface HeaderProps {
  name: string;
  logo_url: string;
  primaryColor: string;
  secondaryColor: string;
  service: boolean;
}

function EnterpriseHeader({
  name,
  logo_url,
  primaryColor,
  secondaryColor,
  service,
}: HeaderProps) {
  return (
    <Header
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      <div>
        <button>
          {service ? (
            <MenuEnterprise
              primaryColor={primaryColor || '#28262e'}
              secondaryColor={secondaryColor || '#ff9000'}
            />
          ) : (
            <Link to={routes.enterprise}>
              <FiArrowLeft />
            </Link>
          )}
        </button>
        <span>{name && name}</span>
        <img src={logo_url || EnterpriseImg} alt="NaHora" />
      </div>
    </Header>
  );
}

export default EnterpriseHeader;
