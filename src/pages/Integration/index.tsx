import React, { useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/Auth';

export const Integration: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const navigate = useHistory();

  const { getUserUpdate, user } = useAuth();

  useEffect(() => {
    document.title = 'Integração';

    api.get(`integration?code=${searchParams.get('code')}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
      },
    }).then(() => {
      getUserUpdate(user.id);
      navigate.push('game-form');
    });
  });

  return (
    <h1>Carregando</h1>
  );
};
