import styled, { css, keyframes } from 'styled-components';

interface GameInfoProps {
  containsData: boolean;
}

interface TopBarMenuProps {
  connectedWithNotion: boolean;
}

interface InsertGameFormProps {
  connectedWithNotion: boolean;
  loadingVisible: boolean;
}

export const Container = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: #272a34;
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  animation: ${fadeIn} 0.5s;
`;

export const TopBarMenu = styled.div<TopBarMenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 1.4rem;

  animation: ${fadeIn} 0.5s;

  > div {
    width: 100%;
    display: flex;
  }

  div div button {
    display: flex;
    align-items: center;
    margin-top: 1.2rem;

    color: #2A2A2A;
    text-decoration: none;
    background-color: #cfd8dc;
    border-radius: 0.4rem;
    padding: 0.4rem 1.4rem;

    svg {
      margin-right: 1.4rem;
    }
  }

  div button {
    display: flex;
    align-items: center;
    margin-top: 1.2rem;
  }

  h1 {
    margin-top: 2.4rem;
    margin-bottom: 1.4rem;
    color: #FFFFFF;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;

    color: #2A2A2A;
    text-decoration: none;
    background-color: #cfd8dc;
    border-radius: 0.4rem;
    padding: 1.2rem;

    svg {
      margin-right: 1.2rem;
    }

    ${(props) => props.connectedWithNotion && css`
      background-color: #4DB6AC;
    `}
  }
`;

export const Logout = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
`;

export const InsertGameForm = styled.div<InsertGameFormProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    height: 70%;
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 1.4rem;
    border-radius: 1.2rem 0 0 1.2rem;

    box-shadow: 0rem 1.4rem 1.4rem 0.2rem rgba(0, 0, 0, 0.5);

    padding-top: 4.8rem;
    padding-left: 2.8rem;

    h1 {
      color: #FFFFFF;
    }

    > div {
      width: 80%;
      background-color: rgba(255, 255, 255, 0.1);
    }

    > div + div {
      margin-top: 0.8rem;
    }

    div input {
      color: #FFFFFF;
      margin-right: 0.8rem;
    }

    h1 {
      margin-bottom: 24px;
    }

    label {
      color: #FFFFFF;
      margin-top: 0.8rem;
    }

    select {
      background-color: #CFD8DC;
      color: #2A2A2A;
      padding: 1.2rem;
      width: 80%;
      border-radius: 0.4rem;
    }

    button {
      background-color: #CFD8DC;
      color: #2A2A2A;
      padding: 1.2rem 2.4rem;
      margin-top: 1.4rem;
      width: 40%;
      border-radius: 0.4rem;
      transition: color 0.2s;

      &:hover {
        ${(props) => (props.connectedWithNotion && !props.loadingVisible) && css`
          color: #4DB6AC;
        `}
      }

      ${(props) => (!props.connectedWithNotion || props.loadingVisible) && css`
        background-color: #f2f2f280;
        cursor: not-allowed;
      `}
    }

    a {
      background-color: #CFD8DC;
      color: #2A2A2A;
      display: block;
      margin-top: 1.4rem;
      text-decoration: none;
      border-radius: 0.8rem;
      padding: 1.4rem;
      width: 60%;

      transition: color 0.2s;

      &:hover {
        color: #4DB6AC;
      }
    }
  }

  > button {
    display: block;
    background-color: transparent;
    color: #FFFFFF;
    padding: 1.4rem;
    border-radius: 0.8rem;

    display: flex;
    align-items: center;

    text-decoration: none;
    transition: color 0.2s;

    svg {
      margin-right: 15px;
    }

    &:hover {
      color: #4DB6AC;
    }
  }

`;

export const GameInfos = styled.div`
  height: 70%;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2rem;

  background-color: #1c1e25;
  box-shadow: 0.2rem 1.4rem 1.4rem 0.2rem rgba(0, 0, 0, 0.5);

  border-radius: 0 1.2rem 1.2rem 0;

  padding: 4.8rem 1.4rem 1.4rem 1.4rem;

  h1 {
    color: #ffffff;
    margin-bottom: 0.8rem;
  }
`;

export const GameInfo = styled.div<GameInfoProps>`
  margin-top: 0.2rem;
  color: #FFFFFF;
  font-size: 2rem;

  ${(props) => !props.containsData && css`
    color: #FFFFFF66;
  `}
`;
