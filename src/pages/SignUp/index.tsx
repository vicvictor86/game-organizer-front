/* eslint-disable consistent-return */
import React, { useCallback } from 'react';
import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

import { Container, Content } from './styles';
import { useAuth } from '../../hooks/Auth';

interface Inputs {
  username: string;
  password: string;
}

export const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { signUp } = useAuth();

  const navigate = useHistory();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ username, password }) => {
      const signUpSuccessful = await signUp({ username, password });

      if (signUpSuccessful) {
        return navigate.push('/chat');
      }
    },
    [signUp, navigate],
  );

  return (
    <Container>
      <Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Crie sua conta</h1>

          <Input
            rightIcon={FiUser}
            colorIcon="#FFFFFF"
            placeholder="Username"
            {...register('username')}
          />
          <Input
            rightIcon={FiLock}
            colorIcon="#FFFFFF"
            type="password"
            placeholder="Senha"
            {...register('password')}
          />
          {errors.username && <span>This field is required</span>}

          <Button type="submit">Criar</Button>
        </form>

        <Button color="#ffffff" onClick={() => navigate.push('/')}>
          <FiLogIn />
          Já tenho conta
        </Button>
      </Content>
    </Container>
  );
};
