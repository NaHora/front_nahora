import React, { useCallback, useEffect, useState } from 'react';
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdTitle,
  MdFormatUnderlined,
  MdFormatBold,
  MdFormatItalic,
  MdSave,
  MdFullscreen,
  MdFullscreenExit,
} from 'react-icons/md';
import PropTypes from 'prop-types';
import {
  DraftailEditor,
  BLOCK_TYPE,
  INLINE_STYLE,
  ENTITY_TYPE,
} from 'draftail';
import 'draft-js/dist/Draft.css';
import 'draftail/dist/draftail.css';
import './styles.js';
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { convertFromRaw } from 'draft-js';
import {
  addHours,
  format,
  getDate,
  getMonth,
  getYear,
  setHours,
} from 'date-fns';
import InputDefault from '../InputDefault';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { createEditorStateFromRaw, serialiseEditorStateToRaw } from 'draftail';
import { Container } from './styles';
import { Avatar } from '@material-ui/core';
import EnterpriseImg from '../../assets/nahora192.png';
const exporterConfig = {
  blockToHTML: (block) => {
    if (block.type === BLOCK_TYPE.BLOCKQUOTE) {
      return <blockquote />;
    }

    // Discard atomic blocks, as they get converted based on their entity.
    if (block.type === BLOCK_TYPE.ATOMIC) {
      return {
        start: '',
        end: '',
      };
    }

    return null;
  },

  entityToHTML: (entity, originalText) => {
    if (entity.type === ENTITY_TYPE.LINK) {
      return <a href={entity.data.url}>{originalText}</a>;
    }

    if (entity.type === ENTITY_TYPE.IMAGE) {
      return <img alt={entity.data.alt} src={entity.data.src} />;
    }

    if (entity.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      return <hr />;
    }

    return originalText;
  },
};

function RichTextEditor({
  onChange,
  defaultValue,
  readOnly,
  date,
  type,
  thisEnterprise,
  fullScreen,
  setFullScreen,
}) {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const getTraining = useCallback(async () => {
    try {
      const response = await api.get(
        `/training/year/${getYear(new Date(date))}/month/${
          getMonth(new Date(date)) + 1
        }/day/${getDate(new Date(date)) + 1}/enterprise/${thisEnterprise}`,
      );

      setEditorState(
        createEditorStateFromRaw(JSON.parse(response.data.description)),
      );
    } catch {}
  }, [date, thisEnterprise]);

  function test(e) {
    setValues(JSON.stringify(serialiseEditorStateToRaw(editorState)));
    setEditorState(e);
  }

  useEffect(() => {
    getTraining();
    setEditorState(
      createEditorStateFromRaw(
        !readOnly
          ? {
              blocks: [
                {
                  key: '6qiqi',
                  text: 'MOBILITY ',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 8, style: 'BOLD' },
                    { offset: 0, length: 8, style: 'ITALIC' },
                    { offset: 0, length: 8, style: 'UNDERLINE' },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'cvbr6',
                  text: '',
                  type: 'unordered-list-item',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'e9idi',
                  text: 'WARMP UP ',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 8, style: 'BOLD' },
                    { offset: 0, length: 8, style: 'ITALIC' },
                    { offset: 0, length: 8, style: 'UNDERLINE' },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'e3v2h',
                  text: '',
                  type: 'unordered-list-item',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'cqctj',
                  text: 'SKILL / STRENGHT ',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 16, style: 'BOLD' },
                    { offset: 0, length: 16, style: 'ITALIC' },
                    { offset: 0, length: 16, style: 'UNDERLINE' },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: '8t37q',
                  text: '',
                  type: 'unordered-list-item',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: '551pf',
                  text: 'WOD ',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 3, style: 'UNDERLINE' },
                    { offset: 0, length: 3, style: 'ITALIC' },
                    { offset: 0, length: 3, style: 'BOLD' },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'ejddu',
                  text: '',
                  type: 'unordered-list-item',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: 'cd9jb',
                  text: 'EXTRA ',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    { offset: 0, length: 5, style: 'ITALIC' },
                    { offset: 0, length: 5, style: 'BOLD' },
                    { offset: 0, length: 5, style: 'UNDERLINE' },
                  ],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: '1b78p',
                  text: '',
                  type: 'unordered-list-item',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
              entityMap: {},
            }
          : {
              blocks: [
                {
                  key: '6qiqi',
                  text: 'Nenhum treino registrado até o momento.',
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
              ],
              entityMap: {},
            },
      ),
    );
  }, [date]);

  useEffect(() => {
    if (readOnly) {
      document.querySelector('.Draftail-Toolbar').style.display = 'none';
    } else {
      document.querySelector('.Draftail-Toolbar').style.display = 'block';
    }
  }, [readOnly]);

  const saveText = useCallback(async () => {
    try {
      const [newyear, newmonth, newdate] = date.split('-');
      const body = {
        title: '',
        date: new Date(newyear, newmonth - 1, newdate, 3),
        description: values,
        type: type,
      };

      const response = await api.post('/training', body);

      toast.addToast({
        type: 'success',
        title: 'Treino cadastrado.',
      });
    } catch (err) {
      if (err.response) {
        toast.addToast({
          type: 'error',
          title:
            err.response.data.message ||
            'Ocorreu um erro ao cadastrar o treino, tente novamente',
        });
      } else {
        toast.addToast({
          type: 'error',
          title: 'Ocorreu um erro ao cadastrar o treino, tente novamente',
        });
      }
    }
  }, [values, date, type]);

  return (
    <Container fullScreen={fullScreen}>
      {fullScreen && <img src={EnterpriseImg} alt="NaHora" />}
      {fullScreen ? (
        <MdFullscreenExit
          size={25}
          cursor="pointer"
          onClick={() => setFullScreen(!fullScreen)}
        />
      ) : (
        <MdFullscreen
          cursor="pointer"
          onClick={() => setFullScreen(!fullScreen)}
        />
      )}
      <DraftailEditor
        editorState={editorState}
        onChange={test}
        blockTypes={[
          { type: BLOCK_TYPE.HEADER_THREE, icon: <MdTitle /> },
          {
            type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
            icon: <MdFormatListBulleted />,
            description: 'Marcadores',
          },
          {
            type: BLOCK_TYPE.ORDERED_LIST_ITEM,
            icon: <MdFormatListNumbered />,
            description: 'Numeração',
          },

          {
            type: INLINE_STYLE.SAVE,
            icon: <MdSave onClick={saveText} />,
            description: 'Salvar',
          },
        ]}
        inlineStyles={[
          {
            type: INLINE_STYLE.BOLD,
            icon: <MdFormatBold />,
            description: 'Negrito',
          },
          {
            type: INLINE_STYLE.ITALIC,
            icon: <MdFormatItalic />,
            description: 'Itálico',
          },
          {
            type: INLINE_STYLE.UNDERLINE,
            icon: <MdFormatUnderlined />,
            description: 'Sublinhado',
          },
        ]}
        readOnly={readOnly}
      />
    </Container>
  );
}

RichTextEditor.propTypes = {
  type: PropTypes.string,
  date: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  thisEnterprise: PropTypes.object,
  readOnly: PropTypes.bool,
};

RichTextEditor.defaultProps = {
  defaultValue: null,
  thisEnterprise: null,
  type: 'amrap',
  date: new Date(),
  readOnly: false,
  onChange: () => {},
};

export default RichTextEditor;
