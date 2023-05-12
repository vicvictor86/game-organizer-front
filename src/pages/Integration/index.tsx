import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Loading } from '../../components/Loading';
import { Container } from './styles';
import { useToast } from '../../hooks/toast';

export const Integration: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const navigate = useHistory();

  const { getUserUpdate, user } = useAuth();
  const { createToast } = useToast();

  useEffect(() => {
    document.title = 'Integração';

    try {
      api.get(`integration?code=${searchParams.get('code')}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
        },
      }).then(() => {
        getUserUpdate(user.id);
        navigate.push('game-form');
      });
    } catch (err) {
      navigate.push('game-form');

      createToast({
        type: 'error',
        title: 'Erro ao conectar com o notion',
        description: 'Verifique se o login do notion é correto ou se você selecionou apenas um workspace',
      });
    }
  });

  return (
    <Container>
      <div>
        <h1>Conectando</h1>
        <Loading svgColor="light" />
      </div>
    </Container>
  );
};
