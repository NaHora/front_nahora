import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

import { Container } from './styles';

const Menu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <FiMenu onClick={() => setOpenMenu(!openMenu)} color="#FF9D3B" />
      {openMenu && (
        <Container>
          <div>
            <FiMenu
              onClick={() => setOpenMenu(!openMenu)}
              color="#FF9D3B"
              size={55}
            />
            <span onClick={() => setOpenMenu(false)}>Fechar</span>
          </div>
          <h2>Menu</h2>

          <span>Dashboard</span>
          <span>Horários</span>
          <span>Perfil da Empresa</span>
          <span>Gestão de planos</span>
          <hr />
          <span>Perfil do usuário</span>
          <span>sair</span>
        </Container>
      )}
    </>
  );
};

export default Menu;
