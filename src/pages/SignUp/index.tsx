/* eslint-disable consistent-return */
import React, { useCallback, useEffect } from 'react';
import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

import { AnimationContainer, Container, Content } from './styles';
import { useAuth } from '../../hooks/auth';

interface Inputs {
  username: string;
  password: string;
}

export const SignUp: React.FC = () => {
  useEffect(() => {
    document.title = 'Crie sua conta';
  });

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
        return navigate.push('/login');
      }
    },
    [signUp, navigate],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Crie sua conta</h1>

            <Input
              rightIcon={FiUser}
              colorIcon="#FFFFFF"
              placeholder="Username"
              errorMessage={errors.username?.message}
              {...register('username', {
                required: 'O nome de usuário é obrigatório',
              })}
            />
            <Input
              rightIcon={FiLock}
              colorIcon="#FFFFFF"
              type="password"
              placeholder="Senha"
              errorMessage={errors.password?.message}
              {...register('password', {
                required: 'A senha é obrigatória',
              })}
            />

            <Button type="submit">Criar</Button>
          </form>

          <Button color="#ffffff" onClick={() => navigate.push('/')}>
            <FiLogIn />
            Já tenho conta
          </Button>
        </AnimationContainer>
      </Content>
    </Container>
  );
};
