import React, { useCallback, useMemo, useState } from 'react';
import { FiBold, FiItalic } from 'react-icons/fi';

import { Container } from './styles';

interface BoardProps {
  owner: boolean;
  primaryColor: string;
  secondaryColor: string;
}
const TrainingBoard: React.FC<BoardProps> = ({
  owner,
  primaryColor,
  secondaryColor,
}) => {
  const [text, setText] = useState('');

  const setBold = useCallback(() => {
    return setText(`${text}<b></b>`);
  }, [text]);

  const setItalic = useCallback(() => {
    return setText(`${text}__ __`);
  }, [text]);

  const textRender = useMemo(() => {
    return text.replace(/<b>/g, '<b>').replace(/<\/b>/g, '</i>');
  }, [text]);

  return (
    <Container
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      {owner && (
        <div>
          <FiItalic onClick={setItalic} />
          <FiBold onClick={setBold} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            name=""
            id=""
            cols={30}
            rows={10}
          />
        </div>
      )}
      <main dangerouslySetInnerHTML={{ __html: `<p>${textRender}</p>` }} />
    </Container>
  );
};

export default TrainingBoard;
