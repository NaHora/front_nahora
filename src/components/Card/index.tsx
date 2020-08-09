import React, { useState } from 'react';

import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CardContainer } from './styles';

const Card: React.FC = () => {
  const [openSolicitationCard, setOpenSolicitationCard] = useState(false);

  return (
    <CardContainer>
      <div>
        <div onClick={() => setOpenSolicitationCard(!openSolicitationCard)}>
          {!openSolicitationCard ? (
            <FiChevronDown
              style={{ marginRight: '8px' }}
              onClick={() => setOpenSolicitationCard(true)}
              cursor="pointer"
              size={20}
              color="#ff9000"
            />
          ) : (
            <FiChevronUp
              style={{ marginRight: '8px' }}
              onClick={() => setOpenSolicitationCard(false)}
              cursor="pointer"
              size={20}
              color="#ff9000"
            />
          )}
          <img
            src="https://api.adorable.io/avatars/285/.png"
            alt="logo empresa"
          />
          <span>Augustp</span>
        </div>
      </div>
      {openSolicitationCard && (
        <main>
          <hr />

          <select name="oi" id="">
            <option value="ola">oi</option>
          </select>
        </main>
      )}
    </CardContainer>
  );
};

export default Card;
