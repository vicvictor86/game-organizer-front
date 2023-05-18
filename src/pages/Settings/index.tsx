import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { SiNotion } from 'react-icons/si';
import { FiArrowLeft } from 'react-icons/fi';

import { AxiosError } from 'axios';

import { api } from '../../services/api';

import {
  AnimationContainer,
  Container,
  Content,
  InsertConfigsForm,
  TopBarMenu,
} from './styles';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';

interface Inputs {
  statusName: string;
}

interface ErrorDescriptions {
  [key: string]: string;
}

const errorDescriptions: ErrorDescriptions = {
  'Game already exists': 'Você já adicionou esse jogo',
  'Game not found': 'O jogo adicionado não foi encontrado',
};

export const Settings: React.FC = () => {
  const [connectedWithNotion, setConnectedWithNotion] = useState<boolean>(false);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);

  const navigate = useHistory();

  const { user, userSettings, updateUserSettings } = useAuth();
  const { createToast } = useToast();

  useEffect(() => {
    document.title = 'Configurações do usuário';

    setConnectedWithNotion(user.notionUserConnections.length > 0);
  }, [user]);

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ statusName }) => {
      setLoadingVisible(true);

      try {
        if (statusName) {
          await api.put(
            '/users/settings',
            {
              statusName,
            },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem(
                  '@Game-Organizer:jwt-token',
                )}`,
              },
            },
          );

          updateUserSettings(statusName);
        }

        setLoadingVisible(false);
        createToast({
          type: 'success',
          title: 'As informações foram salvas',
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          const errorMessage: string = err.response?.data.message;

          createToast({
            type: 'error',
            title: 'Erro ao atualizar as informações',
            description: errorDescriptions[errorMessage] || 'Erro desconhecido',
          });
        }

        setLoadingVisible(false);
      }
    },
    [createToast, updateUserSettings],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <TopBarMenu connectedWithNotion={connectedWithNotion}>
            <div>
              <Button
                icon={FiArrowLeft}
                color="#ffffff"
                onClick={() => navigate.push('game-form')}
              />
            </div>
            <h1>Olá {user.username}, configure seu perfil</h1>
          </TopBarMenu>
          <InsertConfigsForm
            connectedWithNotion={connectedWithNotion}
            loadingVisible={loadingVisible}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Configurações</h1>

              <label htmlFor="statusName">
                Nome do status do novo jogo adicionado
              </label>
              <Input
                id="statusName"
                // value={userSettings.statusName}
                placeholder="Desejo jogar"
                {...register('statusName')}
              />

              <label htmlFor="connect-with-notion">Conectar com o Notion</label>
              <a
                id="connect-with-notion"
                href={process.env.REACT_APP_AUTHORIZATION_URL}
              >
                <SiNotion size={18} />
                {connectedWithNotion
                  ? 'Conexão com o notion completa'
                  : 'Conectar com o Notion'}
              </a>

              <Button
                disabled={!connectedWithNotion || loadingVisible}
                type="submit"
              >
                Atualizar informações
              </Button>
              {loadingVisible && <Loading />}
            </form>
          </InsertConfigsForm>
        </AnimationContainer>
      </Content>
    </Container>
  );
};
