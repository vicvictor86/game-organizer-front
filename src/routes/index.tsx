import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { GameForm } from '../pages/GameForm';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/sign-up" component={SignUp} />
    <Route path="/game-form" component={GameForm} />
  </Switch>
);

export default Routes;
