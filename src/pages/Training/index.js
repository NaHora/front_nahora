import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  FiClock,
  FiArrowLeft,
  FiUsers,
  FiHome,
  FiX,
  FiCheckCircle,
  FiChevronRight,
  FiChevronLeft,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, getDay, getYear, getMonth, getDate } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EnterpriseImg from '../../assets/empresa.png';
import { Container, SelectDefault } from './styles';
import 'react-day-picker/lib/style.css';
import api from '../../services/api';
import { routes } from '../../routes';
import { useToast } from '../../hooks/toast';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import { removeMask } from '../../utils';
import { useSocket } from '../../hooks/socket';
import { useLoad } from '../../hooks/load';
import Avatar from '../../components/Avatar';
import EnterpriseHeader from '../../components/EnterpriseHeader';
import TrainingBoard from '../../components/TrainingBoard';
import RichTextEditor from '../../components/RichTextEditor';
import InputDefault from '../../components/InputDefault';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'black',
  },
  divButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Training = () => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
  // const { socket } = useSocket();
  const { start, stop } = useLoad();

  const thisEnterprise = JSON.parse(localStorage.getItem('enterprise') || '{}');
  const owner_enterprise = thisEnterprise.owner_id === user.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekDay, setCurrentWeekDay] = useState(getDay(new Date()));

  const [selectectedCategory, setSelectectedCategory] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#28262e');
  const [loading, setLoading] = useState(false);
  const [currentService, setCurrentService] = useState('');

  const [categories, setCategories] = useState([]);
  const [secondaryColor, setSecondaryColor] = useState('#ff9000');
  const classes = useStyles();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('AMRAP');
  const [training, setTraining] = useState('');

  useEffect(() => {
    setPrimaryColor(thisEnterprise.primary_color);
    setSecondaryColor(thisEnterprise.secondary_color);
  }, []);

  return (
    <Container
      primaryColor={primaryColor || '#28262e'}
      secondaryColor={secondaryColor || '#ff9000'}
    >
      <EnterpriseHeader
        service={true}
        primaryColor={primaryColor || '#28262e'}
        secondaryColor={secondaryColor || '#ff9000'}
        name={thisEnterprise.name}
        logo_url={thisEnterprise.logo_url}
      />
      <div>
        <header>
          <InputDefault
            name="date"
            maxWidth="180px"
            margin={true}
            type="date"
            value={date}
            placeholder="Data"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />

          {owner_enterprise && (
            <SelectDefault
              name="type"
              value={type}
              placeholder="Tipo"
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value="AMRAP">
                AMRAP – As many rounds/repetitions as possible
              </option>
              <option value="EMOM">EMOM – Every Minute On the Minute</option>
              <option value="RFT">RFT – Rounds For Time</option>
              <option value="RNFT">RNFT – Rounds Not For Time</option>
              <option value="Tabata">
                Tabata – 8rd 20s fazendo, 10s parado
              </option>
            </SelectDefault>
          )}
        </header>

        <RichTextEditor
          thisEnterprise={thisEnterprise.id}
          readOnly={!owner_enterprise}
          date={date}
          type={type}
        />
      </div>
    </Container>
  );
};

export default Training;
