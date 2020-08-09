import React, { useState, useEffect, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { Switch } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
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
  const myEnterprise = JSON.parse(
    localStorage.getItem('@NaHora:myEnterprise') || '{}',
  );
  const { addToast } = useToast();
  const history = useHistory();

  const [formCategoryName, setFormCategoryName] = useState('');
  const [formService, setFormService] = useState<any>({});
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
                  onClick={() => {
                    handlePressCategory(category.id);
                  }}
                >
                  <span>{category.name}</span>
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
            Horário
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
            Limite de vagas
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
            Horas de antecedência
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
            Agendar com agendamento pendente?
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
