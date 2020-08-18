import React, { useState, useEffect, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { Switch, Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { MdInfoOutline } from 'react-icons/md';
import { FiX } from 'react-icons/fi';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import HeaderMenu from '../../../components/Header';

import {
  Container,
  Category,
  DivCategory,
  ButtonCategory,
  Services,
} from './styles';
import api from '../../../services/api';
import InputDefault from '../../../components/InputDefault';
import { useToast } from '../../../hooks/toast';
import { routes } from '../../../routes';
import { OpenDelete } from '../../Schedule/styles';
import Button from '../../../components/Button';

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
interface Category {
  id: string;
  name: string;
}

interface Service {
  start_hour: string;
  description_id?: string;
  category_id: string;
  capacity: number;
  day_week: number;
  pending_scheduling?: number;
  hour_to_schedule: number;
  user_name?: string;
}

const EnterpriseSchedule: React.FC = () => {
  const classes = useStyles();

  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );
  const { addToast } = useToast();
  const history = useHistory();

  const [formCategoryName, setFormCategoryName] = useState('');
  const [openDeleteCategory, setOpenDeleteCategory] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [formService, setFormService] = useState<any>({
    pending_scheduling: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectectedCategory, setSelectectedCategory] = useState<string[]>([]);
  const [selectectedDays, setSelectectedDays] = useState<number[]>([]);

  const getCategories = useCallback(async () => {
    api.get(`/services/category/${myEnterprise.id}`).then((response) => {
      setCategories(response.data);
    });
  }, [myEnterprise.id]);

  useEffect(() => {
    getCategories();
  }, []);

  const createCategory = useCallback(async () => {
    try {
      const body = {
        name: formCategoryName,
      };
      await api.post(`/services/category`, body);

      getCategories();

      addToast({
        type: 'success',
        title: 'Novo tipo de serviço adicionado!',
      });
    } catch (err) {
      if (err.response) {
        addToast({
          type: 'error',
          title: 'Vishi',
          description:
            err.response.data.message ||
            'Ocorreu um erro ao adicionar o tipo de serviço, tente novamente',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Vishi',
          description:
            'Ocorreu um erro ao adicionar o tipo de serviço, tente novamente',
        });
      }
    }
  }, [addToast, formCategoryName, getCategories]);

  const deleteCategory = useCallback(async () => {
    try {
      await api.delete(`/services/category/${categoryId}`);

      getCategories();
      setOpenDeleteCategory(false);
      addToast({
        type: 'success',
        title: 'Tipo de serviço deletado!',
      });
    } catch (err) {
      if (err.response) {
        addToast({
          type: 'error',
          title: 'Vishi',
          description:
            err.response.data.message ||
            'Ocorreu um erro ao deletar o tipo de serviço, tente novamente',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Vishi',
          description:
            'Ocorreu um erro ao deletar o tipo de serviço, tente novamente',
        });
      }
    }
  }, [addToast, categoryId, getCategories]);

  const createServices = useCallback(
    async (scheduleTimes) => {
      try {
        const body = {
          dataArray: scheduleTimes,
        };
        await api.post(`/services`, body);

        setFormService({ ...formService, start_hour: '' });

        addToast({
          type: 'success',
          title: 'Horários adicionados!',
        });
      } catch (err) {
        if (err.response) {
          addToast({
            type: 'error',
            title: 'Vishi',
            description:
              err.response.data.message ||
              'Ocorreu um erro ao adicionar horários, tente novamente',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Vishi',
            description:
              'Ocorreu um erro ao adicionar horários, tente novamente',
          });
        }
      }
    },
    [addToast, formService],
  );

  const handlePressWeek = useCallback(
    (day) => {
      if (selectectedDays.includes(day)) {
        setSelectectedDays(
          selectectedDays.filter((weekDay) => weekDay !== day),
        );
      } else {
        setSelectectedDays((days) => [...days, day]);
      }
    },
    [selectectedDays],
  );

  const handlePressCategory = useCallback(
    (category) => {
      if (selectectedCategory.includes(category)) {
        setSelectectedCategory(
          selectectedCategory.filter((allCategory) => allCategory !== category),
        );
      } else {
        setSelectectedCategory((allCategories) => [...allCategories, category]);
      }
    },
    [selectectedCategory],
  );

  const handleScheduleTime = useCallback(() => {
    if (selectectedCategory.length === 0 || selectectedDays.length === 0) {
      addToast({
        type: 'error',
        title: 'Ops',
        description:
          'Verifique se selecionou pelo menos um tipo de serviço e dia da semana, tente novamente',
      });
    } else if (formService.start_hour.replace(':', '') > 2359) {
      addToast({
        type: 'error',
        title: 'Ops',
        description: 'Horários só vão até 23:59, tente novamente',
      });
    } else {
      const totalSchedule: Service[] = [];
      selectectedCategory.forEach(
        (category) =>
          selectectedDays.forEach((day) =>
            totalSchedule.push({
              start_hour: formService.start_hour,
              category_id: category,
              capacity: formService.capacity,
              day_week: day,
              hour_to_schedule: formService.hour_to_schedule,
              pending_scheduling: formService.pending_scheduling,
            }),
          ),

        createServices(totalSchedule),
      );
    }
  }, [
    selectectedCategory,
    selectectedDays,
    formService.start_hour,
    formService.capacity,
    formService.hour_to_schedule,
    formService.pending_scheduling,
    createServices,
    addToast,
  ]);

  return (
    <Container>
      <HeaderMenu />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openDeleteCategory}
        onClose={() => setOpenDeleteCategory(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteCategory}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Deseja deletar este serviço?</h2>
            <p id="transition-modal-description">
              Ao deletar, todos agendamentos atrelados a ele serão perdidos.
            </p>
            <div className={classes.divButton}>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#28262e"
                onClick={() => setOpenDeleteCategory(false)}
                transparent
              >
                Cancelar
              </Button>
              <Button
                primaryColor="#ff9000"
                secondaryColor="#28262e"
                onClick={deleteCategory}
                // loading={loading}
              >
                Excluir
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
      <Category primaryColor="#28262e" secondaryColor="#ff9000">
        <span>Selecione os tipos de Serviços: </span>
        <main>
          <div>
            <InputDefault
              type="text"
              name="name"
              maxWidth="150px"
              placeholder="Criar serviço"
              value={formCategoryName}
              onChange={(e) => setFormCategoryName(e.target.value)}
            />
            <ButtonCategory
              primaryColor="#28262e"
              secondaryColor="#ff9000"
              currentSelected
              onClick={() => {
                createCategory();
              }}
            >
              <span>Adicionar</span>
            </ButtonCategory>
          </div>
          <div>
            <hr />
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <DivCategory
                  primaryColor="#28262e"
                  secondaryColor="#ff9000"
                  currentSelected={selectectedCategory.includes(category.id)}
                  key={category.id}
                >
                  <div
                    onClick={() => {
                      handlePressCategory(category.id);
                    }}
                  >
                    <span>{category.name}</span>
                  </div>
                  <FiX
                    onClick={() => {
                      setCategoryId(category.id);
                      setOpenDeleteCategory(true);
                    }}
                  />
                </DivCategory>
              ))
            ) : (
              <span>ainda não tem serviços, adicione um.</span>
            )}
          </div>
        </main>
      </Category>
      <Services>
        <div>
          <label htmlFor="">
            <Tooltip title="Horário que começará o serviço.">
              <span>
                <MdInfoOutline />
                Horário *
              </span>
            </Tooltip>
            <NumberFormat
              customInput={InputDefault}
              type="text"
              format="##:##"
              name="start_hour"
              allowLeadingZeros
              allowEmptyFormatting
              mask="_"
              maxWidth="160px"
              placeholder="Horário"
              value={formService.start_hour}
              onChange={(e) =>
                setFormService({
                  ...formService,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </label>
          <label htmlFor="">
            <Tooltip title="Qual o máximo de pessoas que poderá se agendar este horário.">
              <span>
                <MdInfoOutline />
                Limite de vagas *
              </span>
            </Tooltip>
            <InputDefault
              type="text"
              name="capacity"
              maxWidth="200px"
              placeholder="Limite de vagas"
              value={formService.capacity}
              onChange={(e) =>
                setFormService({
                  ...formService,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </label>

          <label htmlFor="">
            <Tooltip title="Até quantas horas antes do horário de agendamento o usuário conseguirá se cadastrar. exemplo: 'Para um serviço que será as 08:00h, com 1 hora de antecedência, o usuário só poderá se agendar se ainda não for 07:00h.'">
              <span>
                <MdInfoOutline />
                Horas de antecedência *
              </span>
            </Tooltip>
            <InputDefault
              type="text"
              name="hour_to_schedule"
              maxWidth="200px"
              placeholder="Horas de antecedência"
              value={formService.hour_to_schedule}
              onChange={(e) =>
                setFormService({
                  ...formService,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </label>

          <label htmlFor="">
            <Tooltip title="É possível se agendar caso o usuário já esteja com algum agendamento que ainda não passou ?">
              <span>
                <MdInfoOutline />
                Agendar com agendamento pendente? *
              </span>
            </Tooltip>
            <Switch
              onChange={(e) =>
                setFormService({
                  ...formService,
                  [e.target.name]: e.target.checked,
                })
              }
              name="pending_scheduling"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              checked={!!formService.pending_scheduling}
            />
          </label>
          <ButtonCategory
            primaryColor="#28262e"
            secondaryColor="#ff9000"
            currentSelected
            onClick={() => {
              handleScheduleTime();
            }}
          >
            <span>Incluir Horário</span>
          </ButtonCategory>
        </div>
        <span>Selecione os dias para incluir os horários: </span>

        <table>
          <tr>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(0)}
                onClick={() => {
                  handlePressWeek(0);
                }}
              >
                <span>Domingo</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(1)}
                onClick={() => {
                  handlePressWeek(1);
                }}
              >
                <span>Segunda</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(2)}
                onClick={() => {
                  handlePressWeek(2);
                }}
              >
                <span>Terça</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(3)}
                onClick={() => {
                  handlePressWeek(3);
                }}
              >
                <span>Quarta</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(4)}
                onClick={() => {
                  handlePressWeek(4);
                }}
              >
                <span>Quinta</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(5)}
                onClick={() => {
                  handlePressWeek(5);
                }}
              >
                <span>Sexta</span>
              </DivCategory>
            </th>
            <th>
              <DivCategory
                primaryColor="#28262e"
                secondaryColor="#ff9000"
                currentSelected={selectectedDays.includes(6)}
                onClick={() => {
                  handlePressWeek(6);
                }}
              >
                <span>Sábado</span>
              </DivCategory>
            </th>
          </tr>
          <tr>
            <td />
          </tr>
        </table>
        <ButtonCategory
          primaryColor="#28262e"
          secondaryColor="#ff9000"
          currentSelected
          onClick={() => {
            localStorage.setItem('enterprise', JSON.stringify(myEnterprise));
            history.push(routes.dashboard);
          }}
        >
          <span>Ver horários</span>
        </ButtonCategory>
      </Services>
    </Container>
  );
};

export default EnterpriseSchedule;
